import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../role/role.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Emma', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Contreras', description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido no debe estar vacío' })
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del usuario',
    required: true,
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  birthDate: Date;

  @ApiProperty({ example: 'emma.contreras', description: 'Nombre de usuario' })
  @IsNotEmpty({ message: 'El nombre de usuario no debe estar vacío' })
  @MaxLength(100)
  username: string;

  @ApiProperty({
    example: 'Contrasena123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty({ message: 'La contreseña no debe estar vacío' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example: ['admin', 'user'],
    description: 'Roles del usuario',
  })
  @IsArray()
  @IsEnum(Role, { each: true, message: 'El rol no es válido' })
  @Transform(({ value }) => value.map((role) => role.toLowerCase()))
  roles: Role[];

  @ApiProperty({
    example: 1,
    description: 'Sede del usuario',
  })
  @IsNotEmpty({ message: 'Ingrese un sede del usuario' })
  sede: number;
}
