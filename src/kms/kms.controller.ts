import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { storeWallet } from '../kms/wallet';
import config from '../config';
import { CryptumService } from '../cryptum/cryptum.service';
import { GenerateWalletDto } from '../wallet/dto/generate-wallet.dto';
import { KmsWallet } from './dto/kms.dto';
import {
  KmsSetTrustlineTransactionDto,
  KmsNftBurnTransactionDto,
  KmsNftCreationTransactionDto,
  KmsNftMintTransactionDto,
  KmsNftTransferTransactionDto,
  KmsSmartContractDeployDto,
  KmsSmartContractTransactionDto,
  KmsTokenBurnTransactionDto,
  KmsTokenCreationTransactionDto,
  KmsTokenMintTransactionDto,
  KmsTokenTransferTransactionDto,
} from './dto/kms-transactions.dto';

@ApiTags('kms')
@Controller('kms')
export class KmsController {
  constructor(private cryptumService: CryptumService) {}

  @Post('/wallet')
  async generateWallet(@Body() generateWalletDto: GenerateWalletDto): Promise<KmsWallet> {
    const wallet = await this.cryptumService.generateWallet(generateWalletDto);
    if (!config.saveWallets) {
      throw new BadRequestException({ message: 'Could not save wallet. Enable flag first to run connector' });
    }
    const storedWallet = await storeWallet(wallet);
    delete storedWallet.wallet.privateKey;
    return { id: storedWallet.id, ...storedWallet.wallet };
  }

  @Post('token/trustline')
  setTrustlineTransaction(@Body() body: KmsSetTrustlineTransactionDto) {
    return this.cryptumService.sdk.kms.setTrustline(body);
  }
  @Post('token/transfer')
  tokenTransferTransaction(@Body() body: KmsTokenTransferTransactionDto) {
    return this.cryptumService.sdk.kms.transferTokenTransaction(body);
  }
  @Post('token/create')
  tokenCreationTransaction(@Body() body: KmsTokenCreationTransactionDto) {
    return this.cryptumService.sdk.kms.deployTokenTransaction(body);
  }
  @Post('token/mint')
  tokenMintTransaction(@Body() body: KmsTokenMintTransactionDto) {
    return this.cryptumService.sdk.kms.mintTokenTransaction(body);
  }
  @Post('token/burn')
  tokenBurnTransaction(@Body() body: KmsTokenBurnTransactionDto) {
    return this.cryptumService.sdk.kms.burnTokenTransaction(body);
  }
  @Post('nft/transfer')
  nftTransferTransaction(@Body() body: KmsNftTransferTransactionDto) {
    return this.cryptumService.sdk.kms.transferNftTransaction(body);
  }
  @Post('nft/create')
  nftCreationTransaction(@Body() body: KmsNftCreationTransactionDto) {
    return this.cryptumService.sdk.kms.deployNftTransaction(body);
  }
  @Post('nft/mint')
  nftMintTransaction(@Body() body: KmsNftMintTransactionDto) {
    return this.cryptumService.sdk.kms.mintNftTransaction(body);
  }
  @Post('nft/burn')
  nftBurnTransaction(@Body() body: KmsNftBurnTransactionDto) {
    return this.cryptumService.sdk.kms.burnNftTransaction(body);
  }
  @Post('contract/transaction')
  createSmartContractTransaction(@Body() body: KmsSmartContractTransactionDto) {
    return this.cryptumService.sdk.kms.createSmartContractTransaction(body);
  }
  @Post('contract/deploy')
  smartContractDeployTransaction(@Body() body: KmsSmartContractDeployDto) {
    return this.cryptumService.sdk.kms.deploySmartContractTransaction(body);
  }
}
