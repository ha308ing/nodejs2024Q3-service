import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [FavsController],
  providers: [PrismaService, FavsService],
})
export class FavsModule {}
