import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import User from 'src/users/User.interface';

@Injectable()
export class UsersService {
  private Users: User[] = [
    {
      id: 1,
      name: 'Kirill',
      email: 'qq.qq.com',
    },
    {
      id: 2,
      name: 'Tanya',
      email: 'qwe@a.com',
    },
  ];
  getUsers(): User[] {
    return this.Users;
  }
  addUser(user: User): void {
    if (this.Users.findIndex((elem) => elem.id === user.id) !== -1)
      throw new BadRequestException('User with this id is already exist');
    this.Users.push(user);
  }

  changeUser(id: number, user: Partial<User>): User {
    const userIndex = this.Users.findIndex((elem) => elem.id === id);
    if (userIndex === -1) throw new NotFoundException('User not found');

    this.Users[userIndex] = { ...this.Users[userIndex], ...user };

    return this.Users[userIndex];
  }

  deleteUser(id: number): User {
    const index = this.Users.findIndex((elem) => elem.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    const user = this.Users.splice(index, 1)[0];
    return user;
  }
}
