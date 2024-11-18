import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbum } from './interfaces/album.interface';
import { IArtist } from '../artist/interfaces/artist.interface';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AlbumService {
  private readonly albums = new Map<IAlbum['id'], IAlbum>();
  private readonly albumsArtist = new Map<IArtist['id'], Set<IAlbum['id']>>();

  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAlbumDto) {
    return this.prisma.album.create({ data });
  }

  findAll() {
    return this.prisma.album.findMany();
  }

  findOne(id: string) {
    return this.prisma.album.findUnique({ where: { id } });
  }

  async hasOne(id: string) {
    return (await this.prisma.album.count({ where: { id } })) > 0;
  }

  update(id: string, data: UpdateAlbumDto) {
    return this.prisma.album.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.album.delete({ where: { id } });
  }
}
