import { ArrayMinSize, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGuestDto } from '../../guest/dto/create-guest.dto';

export class CreateDemandDto {

  @IsUUID()
  eventSlug: string;

  @ValidateNested({each: true})
  @Type(() => CreateGuestDto)
  @ArrayMinSize(1)
  guests: CreateGuestDto[];
}
