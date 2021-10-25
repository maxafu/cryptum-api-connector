import { Controller, Get, Param } from '@nestjs/common';
import { CryptumService } from '../cryptum/cryptum.service';

@Controller('prices')
export class PricesController {
  constructor(private cryptumService: CryptumService) {}

  @Get(':asset')
  getPrices(@Param('asset') asset: string) {
    return this.cryptumService.getPrices(asset);
  }
}
