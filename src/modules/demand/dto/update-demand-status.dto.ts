import { IsEnum } from 'class-validator';
import { DemandStatus } from '../enum/demand-status.enum';

export class UpdateDemandStatusDto {
  @IsEnum(DemandStatus)
  status: DemandStatus;
}
