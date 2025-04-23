import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSedeDto {
  @ApiProperty({ example: 'Sede Central', description: 'Nombre de la sede' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección de la sede',
  })
  @IsNotEmpty({ message: 'La dirección no debe estar vacía' })
  @MaxLength(200)
  address: string;

  @ApiProperty({
    example: '989999999',
    description: 'Número telefónico de contacto',
  })
  @IsNotEmpty({ message: 'El teléfono no debe estar vacío' })
  @MaxLength(50)
  phone: string;
}
