import request from 'supertest';
import { TrackDto } from '../src/track/dtos';
import { Prisma, Track } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma.service';
import { CryptoUtil, JwtUtil } from '../src/auth/utils';
import { AccountService } from '../src/account/account.service';
import { EmployeeService } from '../src/employee/employee.service';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';

describe('Track (e2e)', () => {
  let tracks: Track[] = [];
  let accessToken: string;
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
      lastName: 'track',
      firstName: 'track',
      email: 'track@email.com',
    });
    const hashedPw = await CryptoUtil.generateHash('pAswOrd!');
    await accountService.create(employee.EmployeeId, hashedPw);

    accessToken = JwtUtil.generateToken({
      email: 'track@email.com',
      employeeId: employee.EmployeeId,
    });

    await createTracks();
    await app.init();
  });

  describe('Get all tracks', () => {
    let getAllTracks: TrackDto[] = [];

    beforeAll(() => {
      getAllTracks = tracks.map((track) => ({
        name: track.Name,
        albumName: null,
        artistName: null,
        mediaType: 'test',
        genre: null,
        composer: null,
        milliseconds: 1,
        bytes: null,
        unitPrice: '1.1' as any,
      }));
    });

    describe('when user is not authenticated', () => {
      it('should return 401', async () => {
        return request(app.getHttpServer())
          .get('/tracks')
          .expect(({ body }) => {
            expect(body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          });
      });
    });

    describe('when pagination is not sent via query params', () => {
      it('should return the first 20 tracks', () => {
        return request(app.getHttpServer())
          .get('/tracks')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(({ body }) => {
            expect(body.data).toMatchObject(getAllTracks.slice(0, 20));
            expect(body).toHaveProperty('size', 20);
            expect(body).toHaveProperty('total', 60);
          });
      });
    });

    describe('when pagination is sent via query params and', () => {
      describe('when the size number exceeds 50', () => {
        it('should return bad request error', () => {
          return request(app.getHttpServer())
            .get('/tracks?page=1&size=10000')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(({ body }) => {
              expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
            });
        });
      });
    });
  });

  const createTracks = async () => {
    await prisma.mediaType.create({
      data: {
        MediaTypeId: 1,
        Name: 'test',
      },
    });

    for (let i = 0; i < 60; i++) {
      tracks.push({
        Name: 'Name',
        TrackId: i,
        AlbumId: null,
        Composer: null,
        GenreId: null,
        Bytes: null,
        MediaTypeId: 1,
        Milliseconds: 1,
        UnitPrice: new Prisma.Decimal(1.1),
      });
    }
    await prisma.track.createMany({
      data: tracks,
    });
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
