import { Controller, Post, Body, Inject, Get, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Gestion des utilisateurs')
export class UserController {

  @Inject(UserService)
  private readonly userService: UserService;


  @Get()
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  findAll() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Suppression d\'un utilisateur' })
  deleteUser(@Body('id') id: number) {
    return this.userService.delete(id);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Création de utilisateur' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Modifiy user role
  @Put('/modify-role/:id')
  @ApiOperation({ summary: 'Modification du rôle d\'un utilisateur' })
  modifyUserRole(@Body('role') role: string, @Body('id') id: number) {
    return this.userService.updateRole(id, role);
  }



}
