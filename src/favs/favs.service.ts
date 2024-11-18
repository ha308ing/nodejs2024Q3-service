import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const user_id = '0';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.getArtists(),
      this.getAlbums(),
      this.getTracks(),
    ]);

    return { artists, albums, tracks };
  }

  async checkArtistId(id: string) {
    return (await this.prisma.artist.count({ where: { id } })) > 0;
  }

  async addArtist(id: string) {
    const { artistsIds } = (await this.prisma.favouriteArtists.findUnique({
      where: { user_id },
      select: {
        artistsIds: true,
      },
    })) ?? { artistsIds: [] };

    return this.prisma.favouriteArtists.upsert({
      where: { user_id },
      create: { user_id, artistsIds: [id] },
      update: { artistsIds: [...artistsIds, id] },
      select: {
        artistsIds: true,
      },
    });
  }

  async deleteArtist(id: string) {
    const { artistsIds } = (await this.prisma.favouriteArtists.findUnique({
      where: { user_id },
      select: {
        artistsIds: true,
      },
    })) ?? { artistsIds: [] };

    const newArtistsIds = artistsIds.filter((artistId) => artistId != id);

    return this.prisma.favouriteArtists.update({
      where: {
        user_id,
      },
      data: {
        artistsIds: newArtistsIds,
      },
    });
  }

  async getArtists() {
    const { artistsIds } = (await this.prisma.favouriteArtists.findUnique({
      where: { user_id },
      select: {
        artistsIds: true,
      },
    })) ?? { artistsIds: [] };

    return this.prisma.artist.findMany({
      where: {
        id: {
          in: artistsIds,
        },
      },
    });
  }

  async checkAlbumId(id: string) {
    return (await this.prisma.album.count({ where: { id } })) > 0;
  }

  async addAlbum(id: string) {
    const { albumsIds } = (await this.prisma.favouriteAlbums.findUnique({
      where: { user_id },
      select: {
        albumsIds: true,
      },
    })) ?? { albumsIds: [] };

    return this.prisma.favouriteAlbums.upsert({
      where: { user_id },
      create: { user_id, albumsIds: [id] },
      update: { albumsIds: [...albumsIds, id] },
    });
  }

  async deleteAlbum(id: string) {
    const { albumsIds } = (await this.prisma.favouriteAlbums.findUnique({
      where: { user_id },
      select: {
        albumsIds: true,
      },
    })) ?? { albumsIds: [] };

    const newAlbumsIds = albumsIds.filter((albumId) => albumId != id);

    return this.prisma.favouriteAlbums.update({
      where: {
        user_id,
      },
      data: {
        albumsIds: newAlbumsIds,
      },
    });
  }

  async getAlbums() {
    const { albumsIds } = (await this.prisma.favouriteAlbums.findUnique({
      where: { user_id },
      select: {
        albumsIds: true,
      },
    })) ?? { albumsIds: [] };

    return this.prisma.album.findMany({
      where: {
        id: {
          in: albumsIds,
        },
      },
    });
  }

  async checkTrackId(id: string) {
    return (await this.prisma.track.count({ where: { id } })) > 0;
  }

  async addTrack(id: string) {
    const { tracksIds } = (await this.prisma.favouriteTracks.findUnique({
      where: { user_id },
      select: {
        tracksIds: true,
      },
    })) ?? { tracksIds: [] };

    return this.prisma.favouriteTracks.upsert({
      where: { user_id },
      create: { user_id, tracksIds: [id] },
      update: { tracksIds: [...tracksIds, id] },
    });
  }

  async deleteTrack(id: string) {
    const { tracksIds } = (await this.prisma.favouriteTracks.findUnique({
      where: { user_id },
      select: {
        tracksIds: true,
      },
    })) ?? { tracksIds: [] };

    const newTracksIds = tracksIds.filter((trackId) => trackId != id);

    return this.prisma.favouriteTracks.update({
      where: {
        user_id,
      },
      data: {
        tracksIds: newTracksIds,
      },
    });
  }

  async getTracks() {
    const { tracksIds } = (await this.prisma.favouriteTracks.findUnique({
      where: {
        user_id,
      },
      select: {
        tracksIds: true,
      },
    })) ?? { tracksIds: [] };

    return this.prisma.track.findMany({
      where: {
        id: {
          in: tracksIds,
        },
      },
    });
  }
}
