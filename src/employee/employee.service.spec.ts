import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  describe('Find employee by full name and email', () => {
    it('should return full employee details', async () => {
      const Employee = {
        EmployeeId: 1,
        LastName: 'Last Name',
        FirstName: 'First Name',
        Title: 'Title',
        ReportsTo: null,
        BirthDate: null,
        HireDate: null,
        Address: null,
        City: null,
        State: null,
        Country: null,
        PostalCode: null,
        Phone: null,
        Fax: null,
        Email: 'Test email',
      };

      mockCtx.prisma.employee.findFirst.mockResolvedValue(Employee);

      await expect(
        service.findByNameAndEmail('First Name', 'Last Name', 'Test email'),
      ).resolves.toMatchObject(Employee);
    });
  });
});
