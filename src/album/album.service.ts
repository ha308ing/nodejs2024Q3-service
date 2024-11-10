import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'node:crypto';
import { IAlbum } from './interfaces/album.interface';
import { TrackService } from 'src/track/track.service';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { Fav } from 'src/common/fav.generic.service';

@Injectable()
export class AlbumService extends Fav {
  private readonly albums = new Map<IAlbum['id'], IAlbum>();
  private readonly albumsArtist = new Map<IArtist['id'], Set<IAlbum['id']>>();

  constructor(private readonly trackService: TrackService) {
    super();
  }

  create(createAlbumDto: CreateAlbumDto) {
    const id = randomUUID();

    const album = { ...createAlbumDto, id };

    this.albums.set(id, album);
    const artistId = album.artistId;

    if (artistId == null) return album;

    if (!this.albumsArtist.has(artistId)) {
      this.albumsArtist.set(artistId, new Set());
    }

    const albumsIds = this.albumsArtist.get(artistId);

    albumsIds?.add(id);

    if (albumsIds != undefined) {
      this.albumsArtist.set(artistId, albumsIds);
    }

    return album;
  }

  removeArtist(artistId: string) {
    const albums = this.albumsArtist.get(artistId);

    if (albums == undefined) return;

    for (const albumId of albums) {
      const album = this.albums.get(albumId);

      if (album == undefined) continue;

      album.artistId = null;

      this.albums.set(album.id, album);
    }

    this.albumsArtist.delete(artistId);
  }

  findAll() {
    return Array.from(this.albums.values());
  }

  findOne(id: string) {
    return this.albums.get(id);
  }

  hasOne(id: string) {
    return this.albums.has(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.albums.get(id);

    if (album == undefined) return;

    const newAlbum = { ...album, ...updateAlbumDto, id };

    this.albums.set(id, newAlbum);

    return newAlbum;
  }

  remove(id: string) {
    this.trackService.removeAlbum(id);
    this.deleteFav(id);
    this.albums.delete(id);
  }

  async getFavs() {
    const favIds = this.getFavIds();

    return favIds.map((id) => this.albums.get(id));
  }
}
