import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account/account.service';
import { EmployeeService } from '../employee/employee.service';
import { CryptoUtil } from './utils/hash.util';

describe('AuthService', () => {
  let service: AuthService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, AccountService, EmployeeService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register user', () => {
    it('should register the user and return the access token', async () => {
      const Employee = {
        Email: 'employee@gmail.com',
        EmployeeId: '1',
      };
      const registerDto = {
        firstName: 'employeeName',
        lastName: 'employeeLastName',
        email: 'employee@gmail.com',
        password: 'PassWoR$',
      };

      mockCtx.prisma.employee.findFirst.mockResolvedValue(Employee as any);
      mockCtx.prisma.account.create({} as any);

      await expect(service.register(registerDto)).resolves.toHaveProperty(
        'accessToken',
      );
    });
  });

  describe('login user', () => {
    it('should login the user and return the access token', async () => {
      const hashedPw = await CryptoUtil.generateHash('TestPW');
      const Account = {
        Password: hashedPw,
        EmployeeId: '1',
      };
      const loginDto = {
        email: 'employee@gmail.com',
        password: 'TestPW',
      };

      mockCtx.prisma.account.findFirst.mockResolvedValue(Account as any);
      await expect(service.login(loginDto)).resolves.toHaveProperty(
        'accessToken',
      );
    });
  });
});
