import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateArtistDto) {
    return this.prisma.artist.create({ data });
  }

  findAll() {
    return this.prisma.artist.findMany();
  }

  findOne(id: string) {
    return this.prisma.artist.findUnique({ where: { id } });
  }

  async hasOne(id: string) {
    return (await this.prisma.artist.count({ where: { id } })) > 0;
  }

  async update(id: string, data: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (artist == undefined) return;

    const newArtist = await this.prisma.artist.update({
      where: { id },
      data,
    });

    return newArtist;
  }

  remove(id: string) {
    return this.prisma.artist.delete({ where: { id } });
  }
}
