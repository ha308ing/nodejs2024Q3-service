import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    const isTrack = await this.favsService.checkTrackId(id);

    if (!isTrack) throw new UnprocessableEntityException();

    return this.favsService.addTrack(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const isAlbum = await this.favsService.checkAlbumId(id);

    if (!isAlbum) throw new UnprocessableEntityException();

    return this.favsService.addAlbum(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    const isArtist = await this.favsService.checkArtistId(id);

    if (!isArtist) throw new UnprocessableEntityException();

    return this.favsService.addArtist(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('track/:id')
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteTrack(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('album/:id')
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteAlbum(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('artist/:id')
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteArtist(id);
  }

  @Get()
  getAll() {
    return this.favsService.getAll();
  }
}
