import { Controller, Delete, Get, Post, Body, Param, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {




  constructor(
    private readonly eventService: EventService,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.eventService.findOneBySlug(slug);
  }

  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.update(slug, dto);
  }

  @Get(':slug/accounting')
  async getAccounting(@Param('slug') slug: string) {
    return this.eventService.getAccounting(slug);
  }

  @Post(':slug/expenses')
  async addExpense(
    @Param('slug') slug: string,
    @Body() payload: { label: string; amount: number; note?: string },
  ) {
    return this.eventService.addExpense(slug, payload);
  }

  @Post(':slug/incomes')
  async addIncome(
    @Param('slug') slug: string,
    @Body() payload: { label: string; amount: number; note?: string },
  ) {
    return this.eventService.addIncome(slug, payload);
  }

  @Delete(':slug/expenses/:id')
  async deleteExpense(@Param('slug') slug: string, @Param('id') id: string) {
    return this.eventService.deleteExpense(slug, Number(id));
  }

  @Delete(':slug/incomes/:id')
  async deleteIncome(@Param('slug') slug: string, @Param('id') id: string) {
    return this.eventService.deleteIncome(slug, Number(id));
  }

}
