import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {

  }


  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if(user && await bcrypt.compare(loginDto.password, user.password)) {
      const {password, ...result} = user;
      return result;
    }

    throw new UnauthorizedException('Invalid Credentials');
  }

  async login(user : any) {
    const payload = {
      sub : user.id
    }

    return {
      access_token : this.jwtService.sign(payload)
    }

  }




}
