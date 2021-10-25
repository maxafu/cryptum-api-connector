import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CryptumService } from '../cryptum/cryptum.service';
import { GenerateWalletDto } from './dto/generate-wallet.dto';
import {
  GetWalletInfoDto,
  GetWalletInfoQueryStringDto,
} from './dto/get-wallet-info.dto';
import { WalletInfo } from './dto/wallet-info.dto';
import { Wallet } from './dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private cryptumService: CryptumService) {}

  @Post()
  generateWallet(
    @Body() generateWalletDto: GenerateWalletDto,
  ): Promise<Wallet> {
    return this.cryptumService.generateWallet(generateWalletDto);
  }
  @Post('mnemonic')
  generateRandomMnemonic(): { mnemonic: string } {
    const mnemonic = this.cryptumService.generateRandomMnemonic();
    return { mnemonic };
  }
  @Get(':address/info')
  @ApiResponse({ type: WalletInfo })
  getWalletInfo(
    @Param('address') address: string,
    @Query() queryString: GetWalletInfoQueryStringDto,
  ): Promise<WalletInfo> {
    const { protocol, tokenAddresses } = queryString;
    return this.cryptumService.getWalletInfo(
      new GetWalletInfoDto(address, protocol, tokenAddresses),
    );
  }
}
