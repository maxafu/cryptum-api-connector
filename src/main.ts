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
import { getAzureKeyVaultSecret } from './kms/azure';
import { getAWSSecret } from './kms/aws';

async function bootstrap() {
  const { flags } = meow(
    `
      Usage
          $ cryptum-api-connector [options]

      Options
        --saveWallets                     Indicates if it will save generated wallets to a file or database.
        --useLocalPath                    Indicates if it will use a file to store wallets.
        --useDb                           Indicates if it will use database instance to store wallets.
        --aws                             Using AWS (https://aws.amazon.com/secrets-manager/) as a secure storage of the secret which unlocks the wallet file.
        --azure                           Using Azure Vault (https://azure.microsoft.com/en-us/services/key-vault/) as a secure storage of the secret which unlocks the wallet file.
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
      },
    },
  );

  if (flags.saveWallets) {
    config.saveWallets = true;
    let secret = '';
    console.log('- Saving wallets in KMS mode');
    if (flags.azure) {
      config.useAzure = true;
      secret = await getAzureKeyVaultSecret(config.azure().secretName);
      if (!secret) {
        console.error('Azure Key Vault secret does not exists.');
        return;
      }
      console.log('- Using Azure Key Vault to get secret');
    } else if (flags.aws) {
      config.useAWS = true;
      secret = await getAWSSecret(config.aws().secretName);
      if (!secret) {
        console.error('AWS secret does not exists.');
        return;
      }
      console.log('- Using AWS Secrets Manager to get secret');
    } else {
      secret = config.localSecret();
      console.log('- Using local secret');
    }
    config.secret = secret;
  }
  if (flags.useLocalPath) {
    config.useLocalPath = true;
    console.log('- Using local path to save wallets');
  } else if (flags.useDb) {
    config.useDb = true;
    await db.connect();
    console.log('- Using database to save wallets');
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

  const swaggerConfig = new DocumentBuilder().setTitle('Cryptum API connector').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = config.port();
  await app.listen(port, '0.0.0.0');
}
bootstrap();
