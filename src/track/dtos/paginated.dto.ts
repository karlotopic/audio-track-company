import { ApiProperty } from '@nestjs/swagger';
import { TrackDto } from './track.dto';

export class PaginatedDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ isArray: true })
  data: TrackDto;
}
