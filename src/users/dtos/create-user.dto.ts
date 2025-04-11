import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator"
import { Role } from "../role/role.enum"
import { Transform } from "class-transformer"

export class CreateUserDto {
    @IsNotEmpty({message: 'El nombre no debe estar vacío'})
    @MaxLength(100)
    name: string

    @IsNotEmpty({message: 'El apellido no debe estar vacío'})
    @MaxLength(100)
    lastName: string
    
    @IsOptional()
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate()
    birthDate: Date    
    
    @IsNotEmpty({message: 'El nombre de usuario no debe estar vacío'})
    @MaxLength(100)
    username: string
    
    @IsNotEmpty({message: 'La contreseña no debe estar vacío'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    @MaxLength(100)
    password: string
    
    @IsArray()
    @IsEnum(Role, { each: true, message: 'El rol no es válido' })
    @Transform(({ value }) => value.map((role: string) => role.toLowerCase()))
    roles: string[]
}