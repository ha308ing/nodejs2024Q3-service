import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { IdNotFoundException } from 'src/common/exceptions';
import { Fav } from 'src/common/fav.generic.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import type { IAlbum } from 'src/album/interfaces/album.interface';
import type { IArtist } from 'src/artist/interfaces/artist.interface';
import type { ITrack } from './interfaces/track.interface';

@Injectable()
export class TrackService extends Fav {
  private readonly tracks = new Map<ITrack['id'], ITrack>();

  private readonly artistTracks = new Map<IArtist['id'], Set<ITrack['id']>>();

  private readonly albumTracks = new Map<IAlbum['id'], Set<ITrack['id']>>();

  create(createTrackDto: CreateTrackDto) {
    const id = randomUUID() as string;

    const track = { ...createTrackDto, id };

    this.tracks.set(id, track);

    if (track.artistId != undefined) {
      const artistId = track.artistId;

      if (!this.artistTracks.has(artistId))
        this.artistTracks.set(artistId, new Set());

      const set = this.artistTracks.get(artistId)!;
      set.add(track.id);
      this.artistTracks.set(id, set);
    }

    if (track.albumId != undefined) {
      const albumId = track.albumId;

      if (!this.albumTracks.has(albumId))
        this.albumTracks.set(albumId, new Set());

      const set = this.albumTracks.get(albumId)!;
      set.add(track.id);
      this.albumTracks.set(id, set);
    }

    return track;
  }

  removeArtist(artistId: string) {
    const trackIds = this.artistTracks.get(artistId);

    if (trackIds == undefined) return;

    for (const trackId of trackIds) {
      const track = this.tracks.get(trackId);

      if (track == undefined) continue;

      track.artistId = null;

      this.tracks.set(trackId, track);
    }
  }

  removeAlbum(albumId: string) {
    const albumsIds = this.albumTracks.get(albumId);

    if (albumsIds == undefined) return;

    for (const trackId of albumsIds) {
      const track = this.tracks.get(trackId);

      if (track == undefined) continue;

      track.albumId = null;

      this.tracks.set(trackId, track);
    }
  }

  hasOne(id: string) {
    return this.tracks.has(id);
  }

  findAll() {
    return Array.from(this.tracks.values());
  }

  findOne(id: string) {
    return this.tracks.get(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.get(id);

    if (track == undefined) throw new IdNotFoundException();

    const newTrack = { ...track, ...updateTrackDto, id };

    this.tracks.set(id, newTrack);

    return newTrack;
  }

  remove(id: string) {
    this.tracks.delete(id);
    this.artistTracks.delete(id);
    this.deleteFav(id);
    this.albumTracks.delete(id);
  }

  async getFavs() {
    const favIds = this.getFavIds();

    return favIds.map((id) => this.tracks.get(id));
  }
}
