import { Body, Controller, Post } from '@nestjs/common';
import { CryptumService } from 'src/cryptum/cryptum.service';
import { IGenerateWalletDTO } from './wallet.dtos';

@Controller('wallet')
export class WalletController {
  constructor(private cryptumService: CryptumService) {}

  @Post()
  generateWallet(@Body() generateWalletDto: IGenerateWalletDTO) {
    return this.cryptumService.generateWallet(generateWalletDto);
  }
}
