import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController = new UsersController(new UsersService());
  const user = {
    id: 1,
    name: 'Kirill',
    email: 'qq.qq.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('matches the exact object', () => {
    expect(controller.getUsers()[0]).toEqual(user);
  });
  test('must be equal', () => {
    expect(controller.deleteUser('1')).toEqual(user);
  });
  test('must be equal', () => {
    expect(controller.addUser({ ...user, id: 999 })).toEqual({
      ...user,
      id: 999,
    });
  });
});
