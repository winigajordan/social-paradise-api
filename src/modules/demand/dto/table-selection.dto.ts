import { IsInt, Min } from 'class-validator';

export class TableSelectionDto {
  @IsInt()
  tableId: number; // adapte si ta table a un UUID

  @IsInt()
  @Min(1)
  quantity: number;
}