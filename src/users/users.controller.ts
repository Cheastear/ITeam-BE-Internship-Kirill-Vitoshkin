import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import User from './users.entity';
import CreateUserDto from 'src/dto/create-user.dto';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { Paginated } from 'nestjs-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  async getPaginatedUsers(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Paginated<User>> {
    return this.usersService.findAll({ page, limit, path: req.path });
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  @UseGuards(JwtAuthGuard)
  async changeUser(
    @Request() req,
    @Body() user: Partial<CreateUserDto>,
  ): Promise<User> {
    return await this.usersService.changeUser(req.user.id, user);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  async deleteUser(@Request() req): Promise<User> {
    return await this.usersService.deleteUser(req.user.id);
  }
}
