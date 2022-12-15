import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetAllTracksDto, TrackDto } from './dtos';
import { TrackUtil } from './utils';

@Injectable()
export class TrackService {
  constructor(private prismaService: PrismaService) {}

  async getAll(options: GetAllTracksDto) {
    const size = options.size || 20;
    const page = options.page || 1;
    let tracks: TrackDto[] = [];

    const total = await this.prismaService.track.count();

    if (size * page < total) {
      const tracksEntity = await this.prismaService.track.findMany({
        take: size,
        skip: (page - 1) * size,
        include: {
          Album: {
            include: {
              Artist: true,
            },
          },
          Genre: true,
          MediaType: true,
        },
      });
      tracks = tracksEntity.map((track) => {
        return TrackUtil.fullTrackToDto(track);
      });
    }

    return {
      page,
      size: tracks.length,
      total,
      data: tracks,
    };
  }
}
