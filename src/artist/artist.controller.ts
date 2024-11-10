import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { IdNotFoundException } from 'src/common/exceptions';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body(ValidationPipe) createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const isFound = this.artistService.hasOne(id);

    if (!isFound) throw new IdNotFoundException();

    return this.artistService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateArtistDto: UpdateArtistDto,
  ) {
    const isFound = this.artistService.hasOne(id);

    if (!isFound) throw new IdNotFoundException();

    return this.artistService.update(id, updateArtistDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const isFound = this.artistService.hasOne(id);

    if (!isFound) throw new IdNotFoundException();

    return this.artistService.remove(id);
  }
}
