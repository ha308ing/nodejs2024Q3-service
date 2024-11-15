-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "year" INTEGER NOT NULL,
    "artistId" TEXT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favs" (
    "id" INTEGER NOT NULL DEFAULT 0,
    "favs_artists_id" TEXT NOT NULL,
    "favs_albums_id" TEXT NOT NULL,
    "favs_tracks_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "favs_artists" (
    "id" TEXT NOT NULL DEFAULT '0',
    "artistsIds" TEXT[],

    CONSTRAINT "favs_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favs_albums" (
    "id" TEXT NOT NULL DEFAULT '0',
    "albumsIds" TEXT[],

    CONSTRAINT "favs_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favs_tracks" (
    "id" TEXT NOT NULL DEFAULT '0',
    "tracksIds" TEXT[],

    CONSTRAINT "favs_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_id_key" ON "artists"("id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_id_key" ON "albums"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_id_key" ON "tracks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "favs_favs_artists_id_key" ON "favs"("favs_artists_id");

-- CreateIndex
CREATE UNIQUE INDEX "favs_favs_albums_id_key" ON "favs"("favs_albums_id");

-- CreateIndex
CREATE UNIQUE INDEX "favs_favs_tracks_id_key" ON "favs"("favs_tracks_id");

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favs" ADD CONSTRAINT "favs_favs_artists_id_fkey" FOREIGN KEY ("favs_artists_id") REFERENCES "favs_artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favs" ADD CONSTRAINT "favs_favs_albums_id_fkey" FOREIGN KEY ("favs_albums_id") REFERENCES "favs_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favs" ADD CONSTRAINT "favs_favs_tracks_id_fkey" FOREIGN KEY ("favs_tracks_id") REFERENCES "favs_tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
