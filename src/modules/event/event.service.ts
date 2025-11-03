import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Price } from '../price/entities/price.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { Table } from '../table/entities/table.entity';

@Injectable()
export class EventService {

  @InjectRepository(Event)
  private eventRepository: Repository<Event>

  @InjectRepository(Price)
  private priceRepository: Repository<Price>

  @InjectRepository(Table)
  private tableRepository: Repository<Table>

  async create(createEventDto: CreateEventDto) {

    const { name, date, prices, tables, location, description, coverImage } = createEventDto;

    const event = this.eventRepository.create({
      name,
      location,
      description,
      coverImage,
      date: new Date(date),
      prices: prices,
      tables: tables
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


}
