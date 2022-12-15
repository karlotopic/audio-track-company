import { TrackService } from './track.service';
import { GetAllTracksDto, PaginatedDto } from './dtos';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Tracks')
@Controller('tracks')
@ApiBearerAuth('access-token')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get paginated list of all tracks.',
    type: PaginatedDto,
  })
  getAll(@Query() getTracks: GetAllTracksDto) {
    return this.trackService.getAll(getTracks);
  }
}
