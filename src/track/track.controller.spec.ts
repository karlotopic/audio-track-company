import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

describe('TrackController', () => {
  let controller: TrackController;
  const trackPaginatedResponse = [
    {
      page: 1,
      size: 20,
      data: [
        {
          name: 'name',
          albumName: 'album name',
          artistName: 'artist name',
          mediaType: 'media type',
          genre: 'genre',
          composer: null,
          milliseconds: 1,
          bytes: null,
          unitPrice: 1.1,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const mock_Guard: CanActivate = {
      canActivate: jest.fn(() => false),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
    })
      .useMocker((token) => {
        if (token === TrackService) {
          return {
            getAll: jest.fn().mockResolvedValue(trackPaginatedResponse),
          };
        }
      })
      .overrideGuard(AuthGuard)
      .useValue(mock_Guard)
      .compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should return paginated tracks', async () => {
    expect(await controller.getAll({ page: 1, size: 20 })).toMatchObject(
      trackPaginatedResponse,
    );
  });
});
