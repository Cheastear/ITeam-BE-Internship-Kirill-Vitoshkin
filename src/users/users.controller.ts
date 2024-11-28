import {
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
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import User from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK', type: [User] })
  async getUsers(): Promise<User[]> {
    return await this.UsersService.getUsers();
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Created', type: User })
  @ApiResponse({
    status: 400,
    description: 'Email or name is empty!',
  })
  @ApiBody({ type: User })
  async addUser(@Body() user: User): Promise<User> {
    return await this.UsersService.addUser(user);
  }

  @Patch(':id')
  @ApiBody({ type: User })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  async changeUser(
    @Param('id') id: string,
    @Body() user: Partial<User>,
  ): Promise<User> {
    return await this.UsersService.changeUser(+id, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.UsersService.deleteUser(+id);
  }
}
