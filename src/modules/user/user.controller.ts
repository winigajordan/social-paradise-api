import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Gestion des utilisateurs')
export class UserController {

  @Inject(UserService)
  private readonly userService: UserService;


  @Post('/create')
  @ApiOperation({ summary: 'Création de utilisateur' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


}
