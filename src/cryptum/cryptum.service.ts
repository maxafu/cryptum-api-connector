import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptumSdk from 'cryptum-sdk';
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
}
