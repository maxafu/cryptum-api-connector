# Cryptum API Connector

API service to facilitate integration with Cryptum SDK and blockchain APIs.

## Technologies

- [Nest framework](https://github.com/nestjs/nest)
- [Node.js v14](https://nodejs.org)
- [Cryptum SDK](https://github.com/blockforce-official/cryptum-sdk)

## Configuration

There are a few environment variables you need to configure first and those are placed in `.env-sample` file.

- `CRYPTUM_ENVIRONMENT` - possible values are: `testnet` or `mainnet`.
- `CRYPTUM_API_KEY` - Cryptum API key that you should create in Cryptum Dashboard.
- `AUTH_API_KEY` - A chosen api key for intern authorization, if you don't provide it, your instance wont use authorization.

## Running

After configuration you need to install all dependencies using `npm` or `yarn`.

```bash
npm install
```

Run the command

```bash
# watch mode
npm run dev

# production mode
npm run build && npm run start
```

It's possible to run on docker.

```bash
docker-compose up -d
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

<br>

## Contributing

Contributions are what make the open source community an incredible place to learn, inspire and create. Any contribution you make will be **much appreciated**.

1. Make a project Fork
2. Create a Branch for your feature (`git checkout -b feature/amazing-feature`)
3. Insert your changes (`git add .`)
4. Make a commit with your changes (`git commit -m 'feat(<folder-name>): Inserting a Amazing Feature !`)
5. Push the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### What does my PR need to be accepted ? 🤔

In order for us to accept your PR, you need to adhere to the following standards.

1. Create using the code pattern currently used.
2. Test your update and show artifacts in PR.

It's all 🤷🏻‍♂️

## License

Distributed under the MIT license. See `LICENSE` for more information.

## Contact

Blockforce - [SITE](https://blockforce.in/) - **HELLO@BLOCKFORCE.IN**
