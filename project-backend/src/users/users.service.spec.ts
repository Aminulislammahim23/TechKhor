import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User, Role } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('create saves a new user when the email is available', async () => {
    const input = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
      role: Role.CUSTOMER,
    };
    const createdUser = { id: 1, ...input };

    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(createdUser);
    repo.save.mockResolvedValue(createdUser);

    const result = await service.create(input);

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: input.email },
    });
    expect(repo.create).toHaveBeenCalledWith(input);
    expect(repo.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(createdUser);
  });

  it('create throws when the email already exists', async () => {
    repo.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(
      service.create({
        email: 'test@example.com',
        password: 'hashed-password',
      }),
    ).rejects.toThrow(new ConflictException('Email already exists'));
  });

  it('findAll returns all users', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    repo.find.mockResolvedValue(users);

    await expect(service.findAll()).resolves.toEqual(users);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findByEmail looks up a user by email', async () => {
    const user = { id: 1, email: 'test@example.com' };
    repo.findOne.mockResolvedValue(user);

    await expect(service.findByEmail('test@example.com')).resolves.toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('findOne returns the user when present', async () => {
    const user = { id: 1, email: 'test@example.com' };
    repo.findOne.mockResolvedValue(user);

    await expect(service.findOne(1)).resolves.toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('findOne throws when the user does not exist', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('update merges new data into the existing user and saves it', async () => {
    const existingUser = {
      id: 1,
      fullName: 'Old Name',
      email: 'test@example.com',
      role: Role.CUSTOMER,
    };
    const update = {
      fullName: 'New Name',
      role: Role.SELLER,
    };
    const savedUser = { ...existingUser, ...update };

    repo.findOne.mockResolvedValue(existingUser);
    repo.save.mockResolvedValue(savedUser);

    const result = await service.update(1, update);

    expect(repo.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('remove deletes the existing user', async () => {
    const user = { id: 1, email: 'test@example.com' };
    repo.findOne.mockResolvedValue(user);
    repo.remove.mockResolvedValue(user);

    const result = await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });
});
