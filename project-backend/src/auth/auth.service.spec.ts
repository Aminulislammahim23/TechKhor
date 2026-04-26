import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    create: jest.Mock;
    findByEmail: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
  };
  let bcryptHash: jest.Mock;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    bcryptHash = bcrypt.hash as jest.Mock;
    bcryptCompare = bcrypt.compare as jest.Mock;
    bcryptHash.mockReset();
    bcryptCompare.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('register hashes the password before creating the user', async () => {
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '01700111222',
      password: 'plain-password',
    };
    const savedUser = {
      id: 1,
      ...dto,
      password: 'hashed-password',
    };

    bcryptHash.mockResolvedValue('hashed-password');
    usersService.create.mockResolvedValue(savedUser);

    const result = await service.register(dto);

    expect(bcryptHash).toHaveBeenCalledWith('plain-password', 10);
    expect(usersService.create).toHaveBeenCalledWith({
      ...dto,
      password: 'hashed-password',
    });
    expect(result).toEqual(savedUser);
  });

  it('login throws when the user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'secret' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('login throws when the password does not match', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'customer',
    });
    bcryptCompare.mockResolvedValue(false);

    await expect(
      service.login({ email: 'test@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

    expect(bcryptCompare).toHaveBeenCalledWith(
      'wrong-password',
      'hashed-password',
    );
  });

  it('login returns a signed access token for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 7,
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'admin',
    });
    bcryptCompare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('signed-token');

    const result = await service.login({
      email: 'test@example.com',
      password: 'plain-password',
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 7,
      role: 'admin',
    });
    expect(result).toEqual({
      access_token: 'signed-token',
    });
  });
});
