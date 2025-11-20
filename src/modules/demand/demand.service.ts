import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDemandDto } from './dto/create-demand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Demand } from './entities/demand.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Guest } from '../guest/entities/guest.entity';
import { MailService } from '../../common/services/mail/mail.service';
import { Event } from '../event/entities/event.entity';
import { DemandType } from './enum/demand-type.enum';
import { DemandWithMainGuestDto } from './dto/demand-with-main-guest.dto';
import { DemandFilterDto } from './dto/demand-filter.dto';
import { DemandStatus } from './enum/demand-status.enum';
import { UpdateDemandStatusDto } from './dto/update-demand-status.dto';
import { Table } from '../table/entities/table.entity';
import { DemandTableItem } from './entities/demand-table-item.entity';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class DemandService {
  @InjectRepository(Demand)
  private readonly demandRepository: Repository<Demand>;

  @InjectRepository(Guest)
  private readonly guestRepository: Repository<Guest>;

  @InjectRepository(Event)
  private readonly eventRepository: Repository<Event>;

  @InjectRepository(Table)
  private readonly tableRepo: Repository<Table>;

  @InjectRepository(DemandTableItem)
  private readonly itemRepo: Repository<DemandTableItem>;

  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  @Inject(MailService)
  private readonly mailService: MailService;

  private readonly dataSource: DataSource;

  async create(createDemandDto: CreateDemandDto) {
    const guests = createDemandDto.guests;

    const mainGuests = guests.filter((g) => g.isMainGuest === true);
    if (mainGuests.length !== 1) {
      throw new HttpException(
        'Une demande doit avoir exactement un invité principal (isMainGuest: true)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const mainGuest = guests.find((g) => g.isMainGuest === true);

    const demand = this.demandRepository.create();

    if (guests.length > 1) {
      demand.type = DemandType.GROUP;
    }

    const event = await this.eventRepository.findOne({
      where: { slug: createDemandDto.eventSlug },
      relations: ['tables'],
    });

    /*if (tables.length !== wantedIds.length) {
      throw new BadRequestException('Certaines tables sont introuvables.');
    }*/

    if (!event)
      throw new HttpException('Événement introuvable', HttpStatus.NOT_FOUND);
    demand.event = event;
    if(createDemandDto.tableSelections) {
      const wantedIds = createDemandDto.tableSelections.map((s) => s.tableId);
      const tables = await this.tableRepo.findBy({ id: In(wantedIds) });

      const eventTableIds = new Set(event.tables.map((t) => t.id));
      const invalid = tables.filter((t) => !eventTableIds.has(t.id));
      if (invalid.length) {
        throw new BadRequestException('Une ou plusieurs tables ne correspondent pas à cet événement.');
      }
      demand.tableItems = createDemandDto.tableSelections.map((sel) => {
        const table = tables.find((t) => t.id === sel.tableId)!;
        return this.itemRepo.create({
          table,
          quantity: sel.quantity,
          // unitPrice: table.price ?? null, // si tu veux snapshot
        });
      });
    }
    let savedDemand = await this.demandRepository.save(demand);

    const guestEntities = guests.map((g) => {

      return this.guestRepository.create({
        ...g,
        demand: savedDemand,
      });
    });

    await this.guestRepository.save(guestEntities);

    await this.mailService.sendTemplateEmail(
      mainGuest!.email,
      mainGuest!.firstName + ' ' + mainGuest!.lastName,
    );

     savedDemand = await this.demandRepository.findOneOrFail({
      where: { slug: savedDemand.slug },
      relations: ['guests', 'event', 'tableItems' ],
    });

    await this.mailService.notifyNewDemandToAdmin(savedDemand);

    return savedDemand;
  }

  async findByEventSlug(slug: string, filter?: DemandFilterDto) {
    const event = await this.eventRepository.findOne({ where: { slug } });

    if (!event) {
      throw new HttpException(
        `Événement avec le slug ${slug} introuvable.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const where: any = { event: { id: event.id } };

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.type) {
      where.type = filter.type;
    }

    const demands = await this.demandRepository.find({
      where,
      relations: ['guests','tableItems'],
      order: { createdAt: 'DESC' },
    });

    return demands.map((d) => new DemandWithMainGuestDto(d));
  }

  async findOneBySlug(slug: string) {
    const demand = await this.demandRepository.findOne({
      where: { slug },
      relations: ['guests', 'event','payment', 'tableItems' ],
    });

    if (!demand) {
      throw new HttpException(
        `Demande avec le slug ${slug} introuvable.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return demand;
  }

  async findOneBySlugWithPayment(slug: string) {
    const demand = await this.demandRepository.findOne({
      where: { slug },
      relations: ['payment'],
    })

    if (!demand) {
      throw new HttpException(
        `Demande avec le slug ${slug} introuvable.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return demand;
  }


  async updateStatus(slug: string, dto: UpdateDemandStatusDto) {
    const demand = await this.demandRepository.findOne({where: { slug }});

    if (!demand)
      throw new HttpException(
        `Demande avec le slug ${slug} introuvable.`,
        HttpStatus.NOT_FOUND
      )

    demand.status = dto.status;
    await this.demandRepository.save(demand);

    switch (dto.status) {
      case DemandStatus.VALIDEE:
        await this.validateDemand(demand);
        break;
      case DemandStatus.PAIEMENT_NOTIFIE:
        break;
      case DemandStatus.PAYEE:
        await this.sendQrCodes(demand);
        break;
    }

  }

  async validateDemand(demand: Demand) {

    const mainGuest = await this.guestRepository.findOne({
      where: {
        demand: { id: demand.id },
        isMainGuest: true,
      },
    });

    if (!mainGuest) throw new HttpException("Invité principal non trouvé", HttpStatus.NOT_FOUND);

    //const demandLink : string = `https://www.event.socialparadise.com/demand/${demand.slug}`;

    return this.mailService.notifyValidationToMainGuest(
        mainGuest.email,
        `${mainGuest.firstName} ${mainGuest.lastName}`,
        demand.slug,
    )
  }

  async sendQrCodes(demand: Demand) {
    const guests : Guest[] = await this.guestRepository.find({
      where: {
        demand: { id: demand.id },
      }
    })

    const mainGuest = guests.find(
      guest => guest.isMainGuest
    )

    if (!mainGuest) throw new HttpException(
      'Invité principal non trouvé',
      HttpStatus.NOT_FOUND,
    )

    await this.mailService.sendQrTicketsToMainGuest(
      mainGuest.email,
      mainGuest.firstName,
      guests.map(guests => ({
        ...guests,
      }))
    )

    return HttpStatus.ACCEPTED;

  }

  async getDemandStatsByEvent(eventSlug: string) {
    const event = await this.eventRepository.findOne({ where: { slug: eventSlug } });

    if (!event) throw new HttpException(
      `Aucun événement trouvé avec le slug ${eventSlug}`,
      HttpStatus.NOT_FOUND,
    )

    const rawStats = await this.demandRepository
      .createQueryBuilder('demand')
      .leftJoin('demand.guests', 'guest')
      .select('demand.status', 'status')
      .addSelect('COUNT(DISTINCT demand.id)', 'totalDemands')
      .addSelect('COUNT(guest.id)', 'totalParticipants')
      .where('demand.eventId = :eventId', { eventId: event.id }) // ici on utilise l'ID interne
      .groupBy('demand.status')
      .getRawMany();

    return rawStats.map(row => ({
      status: row.status,
      totalDemands: Number(row.totalDemands),
      totalParticipants: Number(row.totalParticipants),
    }));
  }

  /*async deleteBySlug(slug: string): Promise<void> {
    const demand = await this.demandRepository.findOne({
      where: { slug },
      relations: ['payment'],
    });

    if (!demand) {
      throw new NotFoundException('Demand not found');
    }

    const demandId = demand.id;

    // 2) Supprimer les dépendances (défensif, même si certaines FKs sont en CASCADE)

    // 2a) Items de tables
    await this.itemRepo.delete({ demand: { id: demandId } });

    // 2b) Guests
    await this.guestRepository.delete({ demand: { id: demandId } });

    // 2c) Payment
    if (demand.payment?.id) {
      await this.paymentRepository.delete(demand.payment.id);
    }

    // 3) Supprimer la demande elle-même
    await this.demandRepository.delete(demandId);
  }*/

  async deleteBySlug(slug: string): Promise<void> {
    await this.demandRepository.manager.transaction(async (manager) => {
      // On récupère les repositories "scopés" à la transaction
      const demandRepo   = manager.getRepository(Demand);
      const itemRepo     = manager.getRepository(DemandTableItem);
      const guestRepo    = manager.getRepository(Guest);
      const paymentRepo  = manager.getRepository(Payment);

      // 1) Charger la demande + paiement éventuel
      const demand = await demandRepo.findOne({
        where: { slug },
        relations: ['payment'],
      });

      if (!demand) {
        throw new NotFoundException('Demand not found');
      }

      const demandId = demand.id;

      // 2) Supprimer les dépendances

      // 2a) Items de tables
      await itemRepo.delete({ demand: { id: demandId } });

      // 2b) Guests
      await guestRepo.delete({ demand: { id: demandId } });

      // 2c) Payment
      if (demand.payment?.id) {
        await paymentRepo.delete(demand.payment.id);
      }

      // 3) Supprimer la demande elle-même
      await demandRepo.delete(demandId);
    });
  }


}
