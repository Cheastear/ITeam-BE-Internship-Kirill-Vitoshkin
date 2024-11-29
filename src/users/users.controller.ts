import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import User from './users.entity';
import CreateUserDto from 'src/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK', type: [User] })
  async getUsers(): Promise<User[]> {
    return await this.UsersService.getUsers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Created', type: User })
  @ApiResponse({
    status: 400,
    description: 'Email or name is empty!',
  })
  async addUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.UsersService.addUser(user);
  }

  @Patch(':id')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  async changeUser(
    @Param('id') id: string,
    @Body() user: Partial<CreateUserDto>,
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
