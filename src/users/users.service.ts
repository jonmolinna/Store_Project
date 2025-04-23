import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userReposotory: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return await this.userReposotory.findOne({
      where: { username: username.toLowerCase().trim(), flag: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userReposotory.findOne({ where: { id, flag: true } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const usernameExist = await this.userReposotory.findOne({
      where: { username: dto.username.toLowerCase().trim() },
    });

    if (usernameExist) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userReposotory.create({
      name: dto.name.toLowerCase().trim(),
      lastName: dto.lastName.toLowerCase().trim(),
      birthDate: dto.birthDate,
      username: dto.username.toLowerCase().trim(),
      password: hash,
      roles: dto.roles.map((role) => role.toLowerCase()),
      flag: true,
    });

    const savedUser = await this.userReposotory.save(user);
    return savedUser;
  }
}
