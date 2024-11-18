import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IdNotFoundException } from '../common/exceptions';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body(ValidationPipe) createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const album = await this.albumService.findOne(id);

    if (album == undefined) throw new IdNotFoundException();

    return album;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto,
  ) {
    const isFound = await this.albumService.hasOne(id);

    if (!isFound) throw new IdNotFoundException();

    return this.albumService.update(id, updateAlbumDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const isFound = await this.albumService.hasOne(id);

    if (!isFound) throw new IdNotFoundException();

    return this.albumService.remove(id);
  }
}
