import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sede } from './entity/sede.entity';
import { Repository } from 'typeorm';
import { CreateSedeDto } from './dto/create-sede.dto';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede) private sedeRepository: Repository<Sede>,
  ) {}

  async findById(id: number): Promise<Sede | null> {
    const sede = await this.sedeRepository.findOne({ where: { id } });

    if (!sede) {
      throw new NotFoundException(
        'No se encontró la sede con el ID proporcionado',
      );
    }

    return sede;
  }

  async findAll(): Promise<Sede[]> {
    return await this.sedeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async create(dto: CreateSedeDto): Promise<Sede> {
    const sedeNameExists = await this.sedeRepository.findOne({
      where: { name: dto.name.toLowerCase().trim() },
    });

    if (sedeNameExists) {
      throw new ConflictException('Ya existe una sede con ese nombre');
    }

    const sede = this.sedeRepository.create({
      name: dto.name.toLowerCase().trim(),
      address: dto.address.toLowerCase().trim(),
      phone: dto.phone.toLowerCase().trim(),
      flag: true,
    });

    const savedSede = await this.sedeRepository.save(sede);
    return savedSede;
  }

  async delete(id: number): Promise<void> {
    const sede = await this.sedeRepository.findOne({ where: { id } });

    if (!sede) {
      throw new NotFoundException(
        'No se encontró la sede con el ID proporcionado',
      );
    }

    await this.sedeRepository.delete(id);
  }
}
