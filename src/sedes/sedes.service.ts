import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sede } from './entity/sede.entity';
import { Repository } from 'typeorm';
import { CreateSedeDto } from './dto/create-sede.dto';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede) private sedeRepository: Repository<Sede>,
  ) {}

  async create(dto: CreateSedeDto): Promise<Sede> {
    const sedeNameExists = await this.sedeRepository.findOne({
        where: {name: dto.name.toLowerCase().trim()}
    })

    if (sedeNameExists) {
        throw new ConflictException('Ya existe una sede con ese nombre')
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
}
