import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Test Jwt' })
  @ApiBearerAuth()
  testToken(@Request() req) {
    return req.user.id;
  }

}
