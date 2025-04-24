import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSedeDto } from './create-sede.dto';
import { IsBoolean } from 'class-validator';

export class UpdateSedeDto extends PartialType(CreateSedeDto) {
  @ApiProperty({ example: true, description: 'Estado de la sede' })
  @IsBoolean()
  flag: boolean;
}
