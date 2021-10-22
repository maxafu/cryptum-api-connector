import { Body, Controller, Post } from '@nestjs/common';
import { CryptumService } from 'src/cryptum/cryptum.service';
import { GenerateWalletDto } from './dto/generate-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private cryptumService: CryptumService) {}

  @Post()
  generateWallet(@Body() generateWalletDto: GenerateWalletDto) {
    return this.cryptumService.generateWallet(generateWalletDto);
  }
}
