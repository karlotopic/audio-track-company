import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class GetAllTracksDto {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
    description: 'Page number greater than 0.',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    default: 20,
    description: 'Tracks per page greater than 0 lower than 50.',
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
