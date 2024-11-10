import { IAlbum } from '../../album/interfaces/album.interface';
import { IArtist } from '../../artist/interfaces/artist.interface';
import { ITrack } from '../../track/interfaces/track.interface';

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface IFavoritesResponse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}
