import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './users.entity';
import CreateUserDto from 'src/dto/create-user.dto';
import CreateAuthDto from 'src/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getOneUser(id: number): Promise<User> {
    const dbUser = await this.usersRepository.findOneBy({ id });
    if (!dbUser) throw new BadRequestException();
    return {
      ...dbUser,
      password: undefined,
      lastLogin: undefined,
      isActive: undefined,
    };
  }

  async addUser(user: CreateUserDto): Promise<User> {
    if (await this.usersRepository.findOneBy({ username: user.username }))
      throw new BadRequestException('User with that nickname is already exist');

    if (await this.usersRepository.findOneBy({ email: user.email }))
      throw new BadRequestException('User with that email is already exist');

    return await this.usersRepository.save({
      ...user,
      isActive: false,
      createdAt: new Date(),
    });
  }

  async changeUser(id: number, user: Partial<CreateUserDto>): Promise<User> {
    const dbUser = await this.usersRepository.findOneBy({ id });
    if (!dbUser) throw new NotFoundException('User not found');

    await this.usersRepository.save({
      ...dbUser,
      ...user,
      id,
      password: dbUser.password,
      role: dbUser.role,
      createdAt: dbUser.createdAt,
    });

    return await this.getOneUser(id);
  }

  async deleteUser(id: number): Promise<User> {
    const dbUser = await this.getOneUser(id);
    if (!dbUser) throw new NotFoundException('User not found');

    await this.usersRepository.delete({ id });

    return dbUser;
  }

  async validateUser(user: CreateAuthDto) {
    const dbUser = await this.usersRepository.findOne({
      where: {
        username: user.username,
        password: user.password,
      },
    });
    if (!dbUser) return null;

    await this.updateLastLogin(dbUser.id, new Date());

    return { id: dbUser.id, username: dbUser.username, email: dbUser.email };
  }

  async updateLastLogin(userId: number, date: Date) {
    return (
      await this.usersRepository.update(userId, {
        lastLogin: date,
      })
    ).affected !== 0
      ? true
      : false;
  }

  async getUserMessages(userId: number) {
    return (
      await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['messages'],
      })
    ).messages;
  }
}
