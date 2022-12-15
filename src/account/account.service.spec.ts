import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { PrismaService } from '../prisma.service';
import { AccountService } from './account.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AccountService', () => {
  let service: AccountService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('Find account by id', () => {
    it('should return the account', async () => {
      const Account = {
        AccountId: 1,
        EmployeeId: 1,
        Password: 'Test Pw',
      };

      mockCtx.prisma.account.findFirst.mockResolvedValue(Account);

      await expect(service.findByEmployeeId(1)).resolves.toMatchObject(Account);
    });
  });

  describe('Find account by email', () => {
    it('should return the account', async () => {
      const Account = {
        AccountId: 1,
        EmployeeId: 1,
        Password: 'Test Pw',
      };

      mockCtx.prisma.account.findFirst.mockResolvedValue(Account);

      await expect(
        service.findByEmail('testemail@email.com'),
      ).resolves.toMatchObject(Account);
    });
  });

  describe('Create account', () => {
    it('should create the account', async () => {
      const Account = {
        AccountId: 1,
        EmployeeId: 1,
        Password: 'Test Pw',
      };

      mockCtx.prisma.account.create.mockResolvedValue(Account);

      await expect(service.create(1, 'Test Pw')).resolves.toMatchObject(
        Account,
      );
    });
  });
});
