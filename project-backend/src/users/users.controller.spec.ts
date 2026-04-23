import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('findAll delegates to UsersService.findAll', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    usersService.findAll.mockResolvedValue(users);

    await expect(controller.findAll()).resolves.toEqual(users);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('findOne delegates to UsersService.findOne', async () => {
    const user = { id: 1 };
    usersService.findOne.mockResolvedValue(user);

    await expect(controller.findOne(1)).resolves.toEqual(user);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
  });

  it('update delegates to UsersService.update', async () => {
    const dto = { fullName: 'Updated Name' };
    const updatedUser = { id: 1, ...dto };
    usersService.update.mockResolvedValue(updatedUser);

    await expect(controller.update(1, dto)).resolves.toEqual(updatedUser);
    expect(usersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove delegates to UsersService.remove', async () => {
    const removedUser = { id: 1 };
    usersService.remove.mockResolvedValue(removedUser);

    await expect(controller.remove(1)).resolves.toEqual(removedUser);
    expect(usersService.remove).toHaveBeenCalledWith(1);
  });
});
