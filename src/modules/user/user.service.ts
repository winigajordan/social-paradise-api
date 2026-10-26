import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existing) {
      throw new BadRequestException(`User already exists`);
    }

    const user = this.userRepository.create(createUserDto);
    const { password, ...saved } = await this.userRepository.save(user);
    return saved;
  }

  // Seul usage autorisé du mot de passe (hash) : la vérification au login
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: { id: true, email: true, role: true, password: true },
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll() {
    return this.userRepository.find();
  }

  //Modify user role
  async updateRole(id: number, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    user.role = role;
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    return this.userRepository.remove(user);
  }

}
