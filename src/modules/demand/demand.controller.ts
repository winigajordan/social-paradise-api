import {
  Controller,
  Post,
  Body,
  Query,
  Param,
  Get,
  Patch, Delete,
} from '@nestjs/common';
import { DemandService } from './demand.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { DemandFilterDto } from './dto/demand-filter.dto';
import { UpdateDemandStatusDto } from './dto/update-demand-status.dto';
import { Transaction } from 'typeorm';


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

  @Patch(':slug/status')
  async updateStatus(
    @Param('slug') slug: string,
    @Body() dto: UpdateDemandStatusDto,
  ){
    return this.demandService.updateStatus(slug, dto);
  }

  @Get('stats/:slug')
  async getStats(@Param('slug') slug: string) {
    return this.demandService.getDemandStatsByEvent(slug);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.demandService.deleteBySlug(slug);
  }


}
