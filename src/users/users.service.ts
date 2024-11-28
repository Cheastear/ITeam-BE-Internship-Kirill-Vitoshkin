import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './users.entity';

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
    return await this.usersRepository.findOneBy({ id });
  }

  async addUser(user: User): Promise<User> {
    return await this.usersRepository.save({ ...user, createdAt: new Date() });
  }

  async changeUser(id: number, user: Partial<User>): Promise<User> {
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

    return await this.usersRepository.findOneBy({ id });
  }

  async deleteUser(id: number): Promise<User> {
    const dbUser = await this.usersRepository.findOneBy({ id });
    if (!dbUser) throw new NotFoundException('User not found');

    await this.usersRepository.delete({ id });

    return dbUser;
  }
}
