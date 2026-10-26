import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';

export class UpdateUserRoleDto {

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.SECURITY })
  role: UserRole;

}
