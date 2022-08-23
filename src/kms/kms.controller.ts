import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { storeWallet } from '../kms/wallet';
import config from '../config';
import { CryptumService } from '../cryptum/cryptum.service';
import { KmsWallet } from '../wallet/dto/wallet.dto';
import { GenerateWalletDto } from '../wallet/dto/generate-wallet.dto';

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
}
