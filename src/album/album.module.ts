import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [TrackModule],
  exports: [AlbumService],
})
export class AlbumModule {}
