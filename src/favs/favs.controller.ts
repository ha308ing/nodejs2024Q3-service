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
import { AuthId } from '../common/auth-id.decorator';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('track/:id')
  async addTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    const isTrack = await this.favsService.checkTrackId(id);

    if (!isTrack) throw new UnprocessableEntityException();

    return this.favsService.addTrack(userId, id);
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    const isAlbum = await this.favsService.checkAlbumId(id);

    if (!isAlbum) throw new UnprocessableEntityException();

    return this.favsService.addAlbum(userId, id);
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    const isArtist = await this.favsService.checkArtistId(id);

    if (!isArtist) throw new UnprocessableEntityException();

    return this.favsService.addArtist(userId, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('track/:id')
  removeTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    return this.favsService.deleteTrack(userId, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('album/:id')
  removeAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    return this.favsService.deleteAlbum(userId, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('artist/:id')
  removeArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthId() userId: string,
  ) {
    return this.favsService.deleteArtist(userId, id);
  }

  @Get()
  getAll(@AuthId() userId: string) {
    return this.favsService.getAll(userId);
  }
}
