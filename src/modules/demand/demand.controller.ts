import {
  Controller,
  Post,
  Body, Query, Param, Get,
} from '@nestjs/common';
import { DemandService } from './demand.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { DemandFilterDto } from './dto/demand-filter.dto';

@Controller('demand')
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Post()
  async create(@Body() createDemandDto: CreateDemandDto) {
    return this.demandService.create(createDemandDto);
  }

  @Get(':slug')
  async getOne(@Param('slug') slug: string) {
    return this.demandService.findOneBySlug(slug);
  }

  @Get('by-event/:slug')
  async getByEventSlug(
    @Param('slug') slug: string,
    @Query() filter: DemandFilterDto,
  ) {
    return this.demandService.findByEventSlug(slug, filter);
  }


}
