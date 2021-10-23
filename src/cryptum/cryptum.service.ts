import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptumSdk from 'cryptum-sdk';
import { Block, GetBlockDto } from '../block/dto/get-block.dto';
import { Prices } from '../prices/dto/get-prices.dto';
import { GetTransactionByHashDto } from '../transaction/dto/get-transaction.dto';
import { GetUtxosDto } from '../transaction/dto/get-utxo.dto';
import { SendTransactionDto } from '../transaction/dto/send-transaction.dto';
import {
  Transaction,
  TransactionResponse,
  UTXO,
} from '../transaction/dto/transaction.dto';
import { GetWalletInfoDto } from '../wallet/dto/get-wallet-info.dto';
import { WalletInfo } from '../wallet/dto/wallet-info.dto';
import { Wallet } from '../wallet/dto/wallet.dto';
import { GenerateWalletDto } from '../wallet/dto/generate-wallet.dto';

@Injectable()
export class CryptumService {
  private sdk: CryptumSdk;

  constructor(private configService: ConfigService) {
    this.sdk = new CryptumSdk(this.configService.get<any>('cryptumConfig'));
  }
  generateRandomMnemonic(strength?: number): string {
    return this.sdk.getWalletController().generateRandomMnemonic(strength);
  }
  async generateWallet(input: GenerateWalletDto): Promise<Wallet> {
    return this.sdk.getWalletController().generateWallet(input);
  }
  async getWalletInfo(input: GetWalletInfoDto): Promise<WalletInfo> {
    return this.sdk.getWalletController().getWalletInfo(input);
  }
  async getTransactionByHash(
    input: GetTransactionByHashDto,
  ): Promise<Transaction> {
    return this.sdk.getTransactionController().getTransactionByHash(input);
  }
  async getUtxos(input: GetUtxosDto): Promise<UTXO[]> {
    return this.sdk.getTransactionController().getUTXOs(input);
  }
  async getBlock(input: GetBlockDto): Promise<Block> {
    return this.sdk.getTransactionController().getBlock(input);
  }
  async sendTransaction(
    input: SendTransactionDto,
  ): Promise<TransactionResponse> {
    return this.sdk.getTransactionController().sendTransaction(input);
  }
  async getPrices(asset: string): Promise<Prices> {
    return this.sdk.getPricesController().getPrices(asset);
  }
}
