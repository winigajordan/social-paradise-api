import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Price } from '../price/entities/price.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { Table } from '../table/entities/table.entity';
import { EventExpense } from './entities/event-expense.entity';
import { EventIncome } from './entities/event-income.entity';
import { Payment } from '../payment/entities/payment.entity';
import { DemandStatus } from '../demand/enum/demand-status.enum';
import { Demand } from '../demand/entities/demand.entity';
import { Guest } from '../guest/entities/guest.entity';

@Injectable()
export class EventService {

  @InjectRepository(Event)
  private eventRepository: Repository<Event>

  @InjectRepository(Price)
  private priceRepository: Repository<Price>

  @InjectRepository(Table)
  private tableRepository: Repository<Table>

  @InjectRepository(EventExpense)
  private expenseRepository: Repository<EventExpense>

  @InjectRepository(EventIncome)
  private incomeRepository: Repository<EventIncome>

  @InjectRepository(Payment)
  private paymentRepository: Repository<Payment>

  @InjectRepository(Demand)
  private demandRepository: Repository<Demand>

  @InjectRepository(Guest)
  private guestRepository: Repository<Guest>

  async create(createEventDto: CreateEventDto) {

    const {
      name,
      date,
      prices,
      tables,
      location,
      description,
      coverImage,
      paymentMethods,
      allowCash,
      cashPlacesConfig,
      isActive,
    } = createEventDto;

    const event = this.eventRepository.create({
      name,
      location,
      description,
      coverImage,
      isActive: isActive ?? true,
      date: new Date(date),
      prices: prices,
      tables: tables,
      paymentMethods,
      allowCash: allowCash ?? true,
      cashPlacesConfig,
      initialBalance: createEventDto.initialBalance ?? 0,
    });
    const savedEvent = await this.eventRepository.save(event);

    /*
    const priceEntities = prices.map(price =>

      this.priceRepository.create({
        ...price,
        event: savedEvent,
      }),
    );

    await this.priceRepository.save(priceEntities);
    */
    return this.eventRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['prices','tables'],
    });

  }

  async findAll() {
    return this.eventRepository.find({
      order: {
        date: 'ASC',
      },
    });
  }


  async findOneBySlug(slug: string) {
    const event = await this.eventRepository.findOne({
      where: { slug },
      relations: ['prices','tables'],
    });

    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    return event;
  }


  async update(slug: string, dto: UpdateEventDto)  {
    const event = await this.eventRepository.findOne({
      where: { slug },
      relations: ['prices','tables'],
    });


    if (!event) throw new HttpException(`Événement non trouvé`, HttpStatus.NOT_FOUND);

    // Mise à jour des champs simples
    if (dto.name) event.name = dto.name;
    if (dto.coverImage) event.coverImage = dto.coverImage;
    if (dto.location) event.location = dto.location;
    if (dto.description) event.description = dto.description;
    if (dto.date) event.date = new Date(dto.date);
    if (dto.paymentMethods) event.paymentMethods = dto.paymentMethods;
    if (dto.allowCash !== undefined) event.allowCash = dto.allowCash;
    if (dto.cashPlacesConfig) event.cashPlacesConfig = dto.cashPlacesConfig;
    if (dto.isActive !== undefined) event.isActive = dto.isActive;
    if (dto.initialBalance !== undefined && dto.initialBalance !== null) {
      event.initialBalance = dto.initialBalance;
    }

    // Gestion des prix si présents
    if (dto.prices) {
      const newPrices = dto.prices;

      // 1. Supprimer les prix absents de la nouvelle liste
      const incomingIds = newPrices.filter(p => p.id).map(p => p.id);
      const toDelete = event.prices.filter(p => !incomingIds.includes(p.id));
      await this.priceRepository.remove(toDelete);

      // 2. Mettre à jour ou créer les prix
      const updatedPrices: Price[] = [];

      for (const priceDto of newPrices) {
        if (priceDto.id) {
          const existing = event.prices.find(p => p.id === priceDto.id);
          if (existing) {
            existing.amount = priceDto.amount;
            existing.name = priceDto.name;
            existing.startDate = new Date(priceDto.startDate);
            existing.endDate = new Date(priceDto.endDate);
            updatedPrices.push(existing);
          }
        } else {
          const newPrice = this.priceRepository.create({
            ...priceDto,
            event: event,
          });
          updatedPrices.push(newPrice);
        }
      }

      // Remplacer la relation
      event.prices = updatedPrices;
    }

    if (dto.tables) {
      const newTables = dto.tables;

      // 1. Supprimer les prix absents de la nouvelle liste
      /*const incomingIdsT  = newTables.filter(p => p.id).map(p => p.id);
      const toDeleteT = event.tables.filter(p => !incomingIdsT.includes(p.id));
      await this.tableRepository.remove(toDeleteT);*/

      // 2. Mettre à jour ou créer les prix
      const updatedTables: Table[] = [];

      for (const tableDto of newTables) {
        if (tableDto.id) {
          const existingT = event.tables.find(p => p.id === tableDto.id);
          if (existingT) {
            existingT.amount = tableDto.amount;
            existingT.capacity = tableDto.capacity;
            existingT.name = tableDto.name;
            updatedTables.push(existingT);
          }
        } else {
          const newTable = this.tableRepository.create({
            ...tableDto,
            event: event,
          });
          updatedTables.push(newTable);
        }
      }

      // Remplacer la relation
      event.tables = updatedTables;
    }

    // Enregistrer l'événement
    await this.eventRepository.save(event);

    return this.eventRepository.findOne({
      where: { id: event.id },
      relations: ['prices','tables']
    });
  }

  async getAccounting(slug: string) {
    const event = await this.eventRepository.findOne({
      where: { slug },
      relations: ['prices'],
    });

    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    const [{ totalExpenses = 0 }] = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'totalExpenses')
      .where('expense.eventId = :eventId', { eventId: event.id })
      .getRawMany();

    const [{ totalIncomesManual = 0 }] = await this.incomeRepository
      .createQueryBuilder('income')
      .select('COALESCE(SUM(income.amount), 0)', 'totalIncomesManual')
      .where('income.eventId = :eventId', { eventId: event.id })
      .getRawMany();

    const { totalPaidFromDemands = 0 } = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.demand', 'demand')
      .innerJoin('demand.event', 'event')
      .select('COALESCE(SUM(payment.amount), 0)', 'totalPaidFromDemands')
      .where('event.id = :eventId', { eventId: event.id })
      .andWhere('demand.status = :status', { status: DemandStatus.PAYEE })
      .getRawOne();

    const initialBalance = event.initialBalance ?? 0;

    const expenses = await this.expenseRepository.find({
      where: { event: { id: event.id } },
      order: { createdAt: 'DESC' },
    });

    const incomes = await this.incomeRepository.find({
      where: { event: { id: event.id } },
      order: { createdAt: 'DESC' },
    });

    // -------- tickets vendus par tarif (par période) — PAYÉE uniquement
    // Affectation par date du paiement associé (payment.date)
    const soldRows = await this.demandRepository
      .createQueryBuilder('demand')
      .innerJoin('demand.payment', 'payment')
      .leftJoin('demand.guests', 'guest')
      .select('demand.id', 'demandId')
      .addSelect('payment.date', 'paidAt')
      .addSelect('COUNT(guest.id)', 'tickets')
      .where('demand.eventId = :eventId', { eventId: event.id })
      .andWhere('demand.status = :status', { status: DemandStatus.PAYEE })
      .groupBy('demand.id')
      .addGroupBy('payment.date')
      .getRawMany();

    const prices = (event.prices ?? []).slice().sort((a: any, b: any) => {
      const at = new Date(a.startDate).getTime();
      const bt = new Date(b.startDate).getTime();
      return at - bt;
    });

    const ticketsByPrice = prices.map((p: any) => {
      const from = new Date(p.startDate);
      const to = new Date(p.endDate);
      const ticketsSold = soldRows.reduce((acc: number, r: any) => {
        const dt = new Date(r.paidAt);
        const inRange = dt.getTime() >= from.getTime() && dt.getTime() <= to.getTime();
        return acc + (inRange ? Number(r.tickets || 0) : 0);
      }, 0);
      return {
        priceId: p.id,
        name: p.name ?? null,
        amount: Number(p.amount ?? 0),
        startDate: p.startDate,
        endDate: p.endDate,
        ticketsSold,
      };
    });

    const currentBalance =
      initialBalance +
      Number(totalIncomesManual) +
      Number(totalPaidFromDemands) -
      Number(totalExpenses);

    return {
      initialBalance,
      totalExpenses: Number(totalExpenses),
      totalIncomesManual: Number(totalIncomesManual),
      totalPaidFromDemands: Number(totalPaidFromDemands),
      currentBalance,
      ticketsByPrice,
      expenses,
      incomes,
    };
  }

  async addExpense(slug: string, payload: { label: string; amount: number; note?: string }) {
    const event = await this.eventRepository.findOne({ where: { slug } });
    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    const expense = this.expenseRepository.create({
      event,
      label: payload.label,
      amount: payload.amount,
      note: payload.note,
    });
    return this.expenseRepository.save(expense);
  }

  async addIncome(slug: string, payload: { label: string; amount: number; note?: string }) {
    const event = await this.eventRepository.findOne({ where: { slug } });
    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    const income = this.incomeRepository.create({
      event,
      label: payload.label,
      amount: payload.amount,
      note: payload.note,
    });
    return this.incomeRepository.save(income);
  }

  async deleteExpense(slug: string, expenseId: number) {
    const event = await this.eventRepository.findOne({ where: { slug } });
    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, event: { id: event.id } },
    });

    if (!expense) {
      throw new HttpException(`Dépense introuvable.`, HttpStatus.NOT_FOUND);
    }

    await this.expenseRepository.remove(expense);
  }

  async deleteIncome(slug: string, incomeId: number) {
    const event = await this.eventRepository.findOne({ where: { slug } });
    if (!event) {
      throw new HttpException(`Événement avec le slug ${slug} introuvable.`, HttpStatus.NOT_FOUND);
    }

    const income = await this.incomeRepository.findOne({
      where: { id: incomeId, event: { id: event.id } },
    });

    if (!income) {
      throw new HttpException(`Entrée introuvable.`, HttpStatus.NOT_FOUND);
    }

    await this.incomeRepository.remove(income);
  }

}
