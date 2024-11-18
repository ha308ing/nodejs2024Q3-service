# Home Library Service

## How to run containers

**Images from docker hub**

`docker compose -f docker-compose.yml`

**Local images**

`docker compose -f docker-compose.local.yml`

By default REST service runs at **4000** port (to change, update `PORT` in `.env` file)

Open `localhost:4000/doc` for Swagger, or

try requests to `localhost:4000`, like `curl localhost:4000/user`

## How to test

- Install dependencies

  `npm i`

- _(Optionally)_  Set `PORT` variable in `.env`, default value is **4000**

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
