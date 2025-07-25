import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsInt()
  age: number;

  @IsOptional()
  isMainGuest?: boolean;

}
