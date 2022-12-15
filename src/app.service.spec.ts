import {
  MockContext,
  Context,
  createMockContext,
} from '../test/mocks/prisma.mock';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppService', () => {
  let service: AppService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get hello world', () => {
    expect(service.getHello()).toEqual('Hello World!');
  });
});
