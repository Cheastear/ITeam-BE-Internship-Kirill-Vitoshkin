import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import User from './users.entity';
import CreateUserDto from 'src/dto/create-user.dto';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'User not found' })
  async getUser(@Request() req): Promise<User> {
    return await this.UsersService.getOneUser(req.user.id);
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
    return await this.UsersService.changeUser(req.user.id, user);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({
    status: 404,
    description: 'Id is invalid',
  })
  async deleteUser(@Request() req): Promise<User> {
    return await this.UsersService.deleteUser(req.user.id);
  }
}
