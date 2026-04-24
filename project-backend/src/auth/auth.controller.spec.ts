import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('register delegates to AuthService.register', async () => {
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'secret',
    };
    authService.register.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('login delegates to AuthService.login', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'secret',
    };
    authService.login.mockResolvedValue({ access_token: 'token' });

    const result = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('getProfile returns the authenticated user from the request', async () => {
    const req = {
      user: {
        id: 1,
        email: 'test@example.com',
      },
    };

    await expect(controller.getProfile(req)).resolves.toEqual(req.user);
  });
});
