import { Body, Controller, Post } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sedes')
@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post('add')
  @ApiOperation({ summary: 'Crear una nueva sede' })
  @ApiResponse({ status: 201, description: 'Sede creada correctamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una sede con ese nombre',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createSede(@Body() dto: CreateSedeDto) {
    return await this.sedesService.create(dto);
  }
}
