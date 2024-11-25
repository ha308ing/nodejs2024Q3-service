# Home Library Service

## Local logs

- start a container:

  `npm run docker:local`

  so now we have from in docker:

  - a service running at 4000 port
  - postgres at 5432 port

  if to run tests now, the service from the container will be used and logs will be saved in docker volume _[how to check logs in docker volume](#docker-containers-logs)_

  to use postgres from the container for local service (started not in container), we should update **PORT** and **DATABASE_URL** (because they are taken by containers)

- update **.env** when the container is running (uncomment, I guess last specified values are used):

  ```
  PORT=4001
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home-library"
  ```

  also note **LOG_LEVEL** and **LOG_LIMIT_KB** variables

- start a service

  - `npm i` - _install dependencies_
  - `npm start` or `npm run start:dev` - _start the service_

  service logs should appear in local `logs` dir

- run tests and check logs dir, new logs should be added

  - `npm test` - default tests
  - `npm run test:auth` - authorization tests
  - `npm run test:refresh` - refresh token tests

_To stop containers, run `npm run docker:local-down` (variables should be the same as at the container start)_

## Docker containers logs

- start containers:

  `npm run docker:local`

- get container's volume, should be named `ha308ing_rest`, find out with `docker volume ls`

- locate volume **Mountpoint**:

  `docker volume inspect ha308ing_rest`

  should be like `/var/lib/volumes/ha308ing_rest/_data`

- access the logs in `/var/lib/docker/volumes/ha308ing_rest/_data`

  on windows these files are accessible from Docker Desktop program, or from specific wsl distro (find out with `wsl -l -v`):

  - `wsl sudo ls -al /var/lib/docker/volumes/ha308ing_rest/_data`
  - `wsl -d docker-desktop sudo ls -al /var/lib/docker/volumes/ha308ing_rest/_data`

  ![docker logs screenshot](https://i.postimg.cc/RVTHQ6C6/image.png)

## How to run containers

**Images from docker hub**

- `docker compose up`
- or `npm run docker:start`

**Local images**

- `docker compose -f docker-compose.local.yml`
- or `npm run docker:local`

**Watch mode**

`npm run docker:watch`

By default REST service runs at **4000** port (to change, update `PORT` in `.env` file)

**Run tests**:

`npm test` (_check out swagger at `localhost:4000/doc`_)

**To stop containers**:

`npm run docker:stop` (_could fail, check ids with `docker ps`_)

**To scan image vulnerabilites**:

`npm run docker:scan`

## How to test

- Install dependencies

  `npm i`

- _(Optionally)_ Set `PORT` variable in `.env`, default value is **4000**

- Start the server

  **dev**:

  - `npm start`

  **prod**:

  - Clean current build

    `npm run prebuild`

  - Run the build

    `npm run build`

  - Start the build

    `npm run start:prod`

- Run tests

  `npm test`

- Check out API Swagger at `localhost:4000/doc`

- To check with linter

  `npm run lint`
