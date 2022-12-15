import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TrackService } from './track.service';

describe('TrackService', () => {
  let service: TrackService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<TrackService>(TrackService);
  });

  describe('Get all tracks', () => {
    it('should return paginated tracks', async () => {
      const page = 1;
      const size = 1;
      const total = 1000;

      // input
      const getAllTracksDto = {
        page,
        size,
      };

      // database
      const tracks = [
        {
          Name: 'name',
          Album: {
            Title: 'Album name',
            Artist: {
              Name: 'Artist name',
            },
          },
          MediaType: {
            Name: 'Media Type Name',
          },
          Genre: {
            Name: 'Genre name',
          },
          Composer: null,
          Milliseconds: 1,
          Bytes: null,
          UnitPrice: 1.1,
        },
      ];

      // output
      const paginatedResponse = {
        ...getAllTracksDto,
        total,
        data: [
          {
            name: tracks[0].Name,
            albumName: tracks[0].Album.Title,
            artistName: tracks[0].Album.Artist.Name,
            mediaType: tracks[0].MediaType.Name,
            genre: tracks[0].Genre.Name,
            composer: tracks[0].Composer,
            milliseconds: tracks[0].Milliseconds,
            bytes: tracks[0].Bytes,
            unitPrice: tracks[0].UnitPrice,
          },
        ],
      };

      mockCtx.prisma.track.count.mockResolvedValue(total);
      mockCtx.prisma.track.findMany.mockResolvedValue(tracks as any);

      await expect(service.getAll(getAllTracksDto)).resolves.toMatchObject(
        paginatedResponse,
      );
    });
  });
});
