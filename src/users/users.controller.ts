import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import User from './User.interface';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK', type: [User] })
  getUsers(): User[] {
    return this.UsersService.getUsers();
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Created', type: User })
  @ApiResponse({
    status: 400,
    description: 'Email or name is empty! Or id is already exist',
  })
  @ApiBody({ type: User })
  addUser(@Body() user: User): User {
    if (!(user.email && user.name)) throw new BadRequestException();

    this.UsersService.addUser(user);
    return user;
  }

  @Patch(':id')
  @ApiBody({ type: User })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  changeUser(@Param('id') id: string, @Body() user: Partial<User>): User {
    return this.UsersService.changeUser(+id, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  deleteUser(@Param('id') id: string): User {
    return this.UsersService.deleteUser(+id);
  }
}
