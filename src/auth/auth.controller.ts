import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateAuthDto from 'src/dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import CreateUserDto from 'src/dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import User from 'src/users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'OK' })
  async login(@Body() user: CreateAuthDto) {
    const payload = await this.userService.validateUser(user);
    if (!payload) throw new UnauthorizedException();
    return await this.authService.login(payload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Created' })
  async addUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.addUser(user);
  }
}
