import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from './role/role.enum';
import { ApiCrudUserDocsDecorator } from './decorator/api-crud-user-docs';
import { ParseIntPipe } from 'src/common/pipe/parse-int.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('add')
  @Roles(Role.ADMIN)
  @ApiCrudUserDocsDecorator('create')
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    const { sede, password, ...rest } = user;
    return {
      ...rest,
      sede: sede.id,
    };
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiCrudUserDocsDecorator('getAll')
  async getAll(@Request() req) {
    const id = req.user.id as number;

    const users = await this.userService.findAll(id);
    const response = users.map((user) => {
      const { password, ...rest } = user;

      return {
        ...rest,
      };
    });

    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiCrudUserDocsDecorator('getOne')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiCrudUserDocsDecorator('delete')
  async delete(@Param('íd', new ParseIntPipe()) id: number) {
    return this.userService.delete(id)
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiCrudUserDocsDecorator('update')
  async update(@Param('id', new ParseIntPipe()) id: number,  @Body() dto: UpdateUserDto) {
    console.log("Update")
  }
}
