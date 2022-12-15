import { Prisma } from '@prisma/client';

export type FullTrackType = Prisma.TrackGetPayload<{
  include: {
    Album: {
      include: {
        Artist: true;
      };
    };
    Genre: true;
    MediaType: true;
  };
}>;
