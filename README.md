# Home Library Service

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
