import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { WalletController } from './wallet/wallet.controller';
import { CryptumService } from './cryptum/cryptum.service';
import { TransactionController } from './transaction/transaction.controller';
import { PricesController } from './prices/prices.controller';
import { BlockController } from './block/block.controller';
import { AuthMiddleware } from './auth.middleware';
import { KmsController } from './kms/kms.controller';

@Module({
  controllers: [
    AppController,
    WalletController,
    KmsController,
    TransactionController,
    PricesController,
    BlockController,
  ],
  providers: [CryptumService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'api/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
