import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptumSdk from 'cryptum-sdk';
import { GetTransactionByHashDto } from 'src/transaction/dto/get-transaction.dto';
import { GetUtxosDto } from 'src/transaction/dto/get-utxo.dto';
import { Transaction, UTXO } from 'src/transaction/dto/transaction.dto';
import { GetWalletInfoDto } from 'src/wallet/dto/get-wallet-info.dto';
import { WalletInfo } from 'src/wallet/dto/wallet-info.dto';
import { Wallet } from 'src/wallet/dto/wallet.dto';
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
}
