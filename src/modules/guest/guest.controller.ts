import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GuestService } from './guest.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/enum/user-role.enum';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  // Scan des QR codes à l'entrée
  @Post(':slug')
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  @HttpCode(HttpStatus.OK)
  async validateGuestBySlug(@Param('slug') slug: string) {
    return this.guestService.validateGuestBySlug(slug);
  }
}
