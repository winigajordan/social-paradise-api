import { Controller, Get, Post, Body, Param,  Put } from '@nestjs/common';
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
  )  {
    return this.eventService.update(slug, dto);
  }




}
