import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AlbumModule } from './album/album.module';
import { AppModule } from './app.module';
import { ArtistModule } from './artist/artist.module';
import { FavsModule } from './favs/favs.module';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import 'dotenv/config';

const PORT = process.env?.PORT ?? 4000;

const swaggerEndpoint = 'doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('REST Service')
    .setDescription('Home Library REST API endpoints')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerEndpoint, app, documentFactory);

  addModuleSwagger('user', UserModule);
  addModuleSwagger('artist', ArtistModule);
  addModuleSwagger('album', AlbumModule);
  addModuleSwagger('track', TrackModule);
  addModuleSwagger('favs', FavsModule);

  await app.listen(PORT);

  function addModuleSwagger(
    path: string,
    module: unknown,
    title = '',
    description = '',
  ) {
    const config = new DocumentBuilder()
      .setTitle(
        title || `REST Service / ${path[0].toUpperCase() + path.slice(1)}`,
      )
      .setDescription(description || 'Home Library REST API endpoints')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, {
        include: [module as typeof Module],
      });
    SwaggerModule.setup(`${swaggerEndpoint}/${path}`, app, documentFactory);
  }
}
bootstrap();
