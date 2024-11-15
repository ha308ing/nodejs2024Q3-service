import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTrackDto) {
    return this.prisma.track.create({ data });
  }

  async hasOne(id: string) {
    return (await this.prisma.track.count({ where: { id } })) > 0;
  }

  findAll() {
    return this.prisma.track.findMany();
  }

  findOne(id: string) {
    return this.prisma.track.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateTrackDto) {
    return this.prisma.track.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.track.delete({ where: { id } });
  }
}
