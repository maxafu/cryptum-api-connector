import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.ENV ?? '.env',
});

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import meow from 'meow';
import config from './config';
import { AppModule } from './app.module';
import * as db from './db';
import { CryptumExceptionFilter } from './filters/cryptum-exception.filter';
import { getAzureKeyVaultSecret } from './kms/azure';
import { getAWSSecret } from './kms/aws';

async function bootstrap() {
  const { flags } = meow(
    `
      Usage
          $ cryptum-api-connector [options]
  
      Options
        --saveWallets                     Indicates if it will save generated wallets to a file or database.
        --useLocalPath                    Indicates if it will use custom path to wallet store file.
        --useDb                           Indicates if it will use database instance to store wallets.
        --interval                        Period in seconds to check for new transactions to sign, defaults to 5 seconds. Daemon mode only.
        --aws                             Using AWS (https://aws.amazon.com/secrets-manager/) as a secure storage of the password which unlocks the wallet file.
        --azure                           Using Azure Vault (https://azure.microsoft.com/en-us/services/key-vault/) as a secure storage of the password which unlocks the wallet file.
  `,
    {
      flags: {
        saveWallets: {
          type: 'boolean',
        },
        useLocalPath: {
          type: 'boolean',
        },
        useDb: {
          type: 'boolean',
        },
        aws: {
          type: 'boolean',
        },
        azure: {
          type: 'boolean',
        },
        interval: {
          type: 'number',
          default: 5,
        },
      },
    },
  );
  if (flags.saveWallets) {
    config.saveWallets = true;
    let password = '';
    if (flags.azure) {
      config.useAzure = true;
      const password = await getAzureKeyVaultSecret(config.azure().secretName);
      if (!password) {
        console.error('Azure Key Vault secret does not exists.');
        return;
      }
    } else if (flags.aws) {
      config.useAWS = true;
      const password = await getAWSSecret(config.aws().secretId);
      if (!password) {
        console.error('AWS secret does not exists.');
        return;
      }
    } else {
      password = config.localPassword();
    }
    config.password = password;
  }
  if (flags.useLocalPath) {
    config.useLocalPath = true;
  }
  if (flags.useDb) {
    config.useDb = true;
    await db.connect();
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new CryptumExceptionFilter());

  const swaggerConfig = new DocumentBuilder().setTitle('Cryptum API connector').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = config.port();
  await app.listen(port, '0.0.0.0');
}
bootstrap();
