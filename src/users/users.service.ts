import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SedesService } from 'src/sedes/sedes.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userReposotory: Repository<User>,
    private readonly sedeService: SedesService,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return await this.userReposotory.findOne({
      where: { username: username.toLowerCase().trim(), flag: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userReposotory.findOne({
      where: { id, flag: true },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findAll(id?: number): Promise<Array<User>> {
    const users = await this.userReposotory.find({
      order: { id: 'DESC' },
      relations: {
        sede: true,
      },
    });

    if (id) {
      return users.filter((user) => user.id !== id);
    }

    return users;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const usernameExist = await this.userReposotory.findOne({
      where: { username: dto.username.toLowerCase().trim() },
    });

    if (usernameExist) throw new ConflictException('El usuario ya existe');

    const sede = await this.sedeService.findById(dto.sede);

    if (!sede) throw new NotFoundException('Sede no encontrada');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userReposotory.create({
      name: dto.name.toLowerCase().trim(),
      lastName: dto.lastName.toLowerCase().trim(),
      birthDate: dto.birthDate,
      username: dto.username.toLowerCase().trim(),
      password: hash,
      roles: dto.roles,
      flag: true,
      sede: sede,
    });

    const savedUser = await this.userReposotory.save(user);
    return savedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.userReposotory.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.userReposotory.delete(id);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.userReposotory.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const sede = await this.sedeService.findById(dto?.sede)
  }
}
