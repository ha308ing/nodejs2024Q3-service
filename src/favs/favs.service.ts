import { Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly tracksService: TrackService,
  ) {}

  async getAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.artistService.getFavs(),
      this.albumService.getFavs(),
      this.tracksService.getFavs(),
    ]);

    return { artists, albums, tracks };
  }

  checkTrackId(id: string) {
    return this.tracksService.hasOne(id);
  }

  addTrack(id: string) {
    return this.tracksService.addFav(id);
  }

  deleteTrack(id: string) {
    return this.tracksService.deleteFav(id);
  }

  checkAlbumId(id: string) {
    return this.albumService.hasOne(id);
  }

  addAlbum(id: string) {
    return this.albumService.addFav(id);
  }

  deleteAlbum(id: string) {
    return this.albumService.deleteFav(id);
  }

  checkArtistId(id: string) {
    return this.artistService.hasOne(id);
  }

  addArtist(id: string) {
    return this.artistService.addFav(id);
  }

  deleteArtist(id: string) {
    return this.artistService.deleteFav(id);
  }
}
