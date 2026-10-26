import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// Réservé aux ADMIN (règle par défaut du RolesGuard)
@Controller('user')
@ApiTags('Gestion des utilisateurs')
@ApiBearerAuth()
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
  deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.id === id) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte.');
    }
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
  modifyUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Request() req,
  ) {
    if (req.user.id === id) {
      throw new BadRequestException('Vous ne pouvez pas modifier votre propre rôle.');
    }
    return this.userService.updateRole(id, dto.role);
  }

}
