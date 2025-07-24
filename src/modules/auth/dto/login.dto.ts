import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email : string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234567890' })
  password : string;
}