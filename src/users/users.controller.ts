import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CustomException } from 'src/exceptions/custom.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('add')
  async createUser(@Body() dto: CreateUserDto) {
    try {
      return await this.userService.create(dto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomException(error.message, error.getStatus());
      }

      throw new CustomException(
        'Ocurrió un error al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
