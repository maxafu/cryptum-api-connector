import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletController } from './wallet/wallet.controller';
import { CryptumService } from './cryptum/cryptum.service';
import { TransactionController } from './transaction/transaction.controller';
import config from './config';

const { ENV } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ?? '.env',
      load: [config],
    }),
  ],
  controllers: [AppController, WalletController, TransactionController],
  providers: [AppService, CryptumService],
})
export class AppModule {}
