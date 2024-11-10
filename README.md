# Home Library Service

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
