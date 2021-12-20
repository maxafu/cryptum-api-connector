import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WalletController } from './wallet/wallet.controller';
import { CryptumService } from './cryptum/cryptum.service';
import { TransactionController } from './transaction/transaction.controller';
import { PricesController } from './prices/prices.controller';
import { BlockController } from './block/block.controller';

@Module({
  controllers: [AppController, WalletController, TransactionController, PricesController, BlockController],
  providers: [CryptumService],
})
export class AppModule {}
