import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234567890' })
  password: string;

}
