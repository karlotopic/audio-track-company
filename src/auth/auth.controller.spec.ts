import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            login: jest.fn().mockResolvedValue({ accessToken: 'testToken' }),
            register: jest.fn().mockResolvedValue({ accessToken: 'testToken' }),
          };
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should return access token', async () => {
      expect(
        await controller.register({
          firstName: 'employeeName',
          lastName: 'employeeLastName',
          email: 'employee@gmail.com',
          password: 'PassWoR$',
        }),
      ).toHaveProperty('accessToken', 'testToken');
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      expect(
        await controller.login({
          email: 'employee@gmail.com',
          password: 'TestPW',
        }),
      ).toHaveProperty('accessToken', 'testToken');
    });
  });
});
