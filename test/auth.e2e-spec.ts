import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoUtil } from '../src/auth/utils/hash.util';
import { AccountService } from '../src/account/account.service';
import { EmployeeService } from '../src/employee/employee.service';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accountService: AccountService;
  let employeeService: EmployeeService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prisma = new PrismaService();
    accountService = new AccountService(prisma);
    employeeService = new EmployeeService(prisma);

    const employee = await employeeService.create({
      lastName: 'lastName',
      firstName: 'firstName',
      email: 'user@email.com',
    });
    const hashedPw = await CryptoUtil.generateHash('pAswOrd!');
    await accountService.create(employee.EmployeeId, hashedPw);

    await app.init();
  });

  describe('login when', () => {
    describe('user provided invalid credentials', () => {
      it('should return 400', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'notanEmail.com',
            password: 'passwordnotvalid',
          })
          .expect((body) => {
            expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          });
      });
    });
    describe('user provided wrong credentials', () => {
      it('should return 401', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'testemail@email.com',
            password: 'qwerfW€a',
          })
          .expect(({ body }) => {
            expect(body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(body.message).toBe('Employee account does not exist!');
          });
      });
    });
    describe('user provided correct credentials', () => {
      it('should return the access token', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'user@email.com',
            password: 'pAswOrd!',
          })
          .expect(({ body }) => {
            expect(body).toHaveProperty('accessToken');
          });
      });
    });
  });

  describe('register when', () => {
    describe('user send invalid password/email format', () => {
      it('should return 400', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'notAnEmail.com',
            password: 'invalidPw',
          })
          .expect(({ body }) => {
            expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          });
      });
    });
    describe('account already exists', () => {
      it('should return 409', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'user@email.com',
            password: 'pAswOrd!',
          })
          .expect(({ body }) => {
            expect(body.statusCode).toBe(HttpStatus.CONFLICT);
            expect(body.message).toBe('Employee account already exists!');
          });
      });
    });
    describe('employee does not exist', () => {
      it('should return 404', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: 'NotExistingName',
            lastName: 'NotExistingLastName',
            email: 'email@email.com',
            password: 'pAswOrd!',
          })
          .expect(({ body }) => {
            expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(body.message).toBe('Employee with given data not found!');
          });
      });
    });
    describe('employee does exist and account does not exist', () => {
      it('should return the access token', async () => {
        await employeeService.create({
          firstName: 'name1',
          lastName: 'lastName1',
          email: 'email@email.com',
        });

        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: 'name1',
            lastName: 'lastName1',
            email: 'email@email.com',
            password: 'pAswOrd!',
          })
          .expect(({ body }) => {
            expect(body).toHaveProperty('accessToken');
          });
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
