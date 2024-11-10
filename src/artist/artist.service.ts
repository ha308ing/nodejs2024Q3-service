import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlbumService } from 'src/album/album.service';
import { Fav } from 'src/common/fav.generic.service';
import { TrackService } from 'src/track/track.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import type { IArtist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService extends Fav {
  private readonly artists = new Map<IArtist['id'], IArtist>();

  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {
    super();
  }

  create(createArtistDto: CreateArtistDto) {
    const id = randomUUID();

    const artist = { ...createArtistDto, id };

    this.artists.set(id, artist);

    return artist;
  }

  findAll() {
    return Array.from(this.artists.values());
  }

  findOne(id: string) {
    return this.artists.get(id);
  }

  hasOne(id: string) {
    return this.artists.has(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.get(id);

    if (artist == undefined) return;

    const newArtist = { ...artist, ...updateArtistDto, id };

    this.artists.set(id, newArtist);

    return newArtist;
  }

  remove(id: string) {
    this.albumService.removeArtist(id);
    this.trackService.removeArtist(id);
    this.deleteFav(id);
    this.artists.delete(id);
  }

  async getFavs() {
    const favIds = this.getFavIds();

    return favIds.map((id) => this.artists.get(id));
  }
}
