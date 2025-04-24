import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from 'src/common/pipe/parse-int.pipe';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/users/role/role.enum';
import { ApiCrudSedeDocsDecorator } from './decorator/api-crud-sede-docs';
import { UpdateSedeDto } from './dto/update-sede.dto';

@ApiTags('Sedes')
@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post('add')
  @ApiCrudSedeDocsDecorator('create')
  async createSede(@Body() dto: CreateSedeDto) {
    return await this.sedesService.create(dto);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiCrudSedeDocsDecorator('getAll')
  async getAllSedes() {
    return await this.sedesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiCrudSedeDocsDecorator('getOne')
  async getSedeById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.sedesService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiCrudSedeDocsDecorator('delete')
  async deleteSede(@Param('id', new ParseIntPipe()) id: number) {
    return await this.sedesService.delete(id)
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiCrudSedeDocsDecorator('update')
  async updateSede(@Param('id', new ParseIntPipe()) id: number, @Body() dto: UpdateSedeDto) {
    return await this.sedesService.update(id, {
      name: dto?.name?.toLowerCase().trim(),
      address: dto?.address?.toLowerCase().trim(),
      phone: dto?.phone?.toLowerCase().trim(),
      flag: dto?.flag,
    })
  }
}
