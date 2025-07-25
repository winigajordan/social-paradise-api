import { IsEnum, IsOptional } from 'class-validator';
import { DemandStatus } from '../enum/demand-status.enum';
import { DemandType } from '../enum/demand-type.enum';

export class DemandFilterDto {
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;

  @IsOptional()
  @IsEnum(DemandType)
  type?: DemandType;
}
