import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDemandDto } from './dto/create-demand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Demand } from './entities/demand.entity';
import { Repository } from 'typeorm';
import { Guest } from '../guest/entities/guest.entity';
import { MailService } from '../../common/services/mail/mail.service';
import { Event } from '../event/entities/event.entity';
import { DemandType } from './enum/demand-type.enum';
import { DemandWithMainGuestDto } from './dto/demand-with-main-guest.dto';
import { DemandFilterDto } from './dto/demand-filter.dto';
import { DemandStatus } from './enum/demand-status.enum';
import { UpdateDemandStatusDto } from './dto/update-demand-status.dto';

@Injectable()
export class DemandService {
  @InjectRepository(Demand)
  private readonly demandRepository: Repository<Demand>;

  @InjectRepository(Guest)
  private readonly guestRepository: Repository<Guest>;

  @InjectRepository(Event)
  private readonly eventRepository: Repository<Event>;

  @Inject(MailService)
  private readonly mailService: MailService;

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
    });

    if (!event)
      throw new HttpException('Événement introuvable', HttpStatus.NOT_FOUND);
    demand.event = event;

    const savedDemand = await this.demandRepository.save(demand);

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

    await this.mailService.notifyNewDemandToAdmin();

    return this.demandRepository.findOne({
      where: { id: savedDemand.id },
      relations: ['guests'],
    });
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
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });

    return demands.map((d) => new DemandWithMainGuestDto(d));
  }

  async findOneBySlug(slug: string) {
    const demand = await this.demandRepository.findOne({
      where: { slug },
      relations: ['guests', 'event'],
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

    const demandLink : string = `https://www.event.socialparadise.com/demand/${demand.slug}`;

    return this.mailService.notifyValidationToMainGuest(
        mainGuest.email,
        `${mainGuest.firstName} ${mainGuest.lastName}`,
        demandLink,
    )
  }

}
