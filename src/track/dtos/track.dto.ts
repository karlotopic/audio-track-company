import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', nullable: true })
  albumName: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  artistName: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  mediaType: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  genre: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  composer: string | null;

  @ApiProperty()
  milliseconds: number;

  @ApiProperty({ type: 'string', nullable: true })
  bytes: number | null;

  @ApiProperty({ type: 'number' })
  unitPrice: Prisma.Decimal;
}
