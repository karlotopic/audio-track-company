import { TrackDto } from '../dtos';
import { FullTrackType } from '../../types';

export class TrackUtil {
  public static fullTrackToDto(trackEntity: FullTrackType): TrackDto {
    return {
      name: trackEntity.Name,
      albumName: trackEntity.Album?.Title || null,
      artistName: trackEntity.Album?.Artist.Name || null,
      mediaType: trackEntity.MediaType.Name,
      genre: trackEntity.Genre?.Name || null,
      composer: trackEntity.Composer,
      milliseconds: trackEntity.Milliseconds,
      bytes: trackEntity.Bytes,
      unitPrice: trackEntity.UnitPrice,
    };
  }
}
