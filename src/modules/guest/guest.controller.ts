import { Controller, Param, Post } from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post(':slug')
  async validateGuestBySlug(@Param('slug') slug: string) {
    // console.log(slug);
    return this.guestService.validateGuestBySlug(slug);
  }
}
