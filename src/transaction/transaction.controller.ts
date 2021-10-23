import { Controller, Get, Param, Query } from '@nestjs/common';
import { CryptumService } from 'src/cryptum/cryptum.service';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';
import { GetTransactionByHashDto } from './dto/get-transaction.dto';
import { GetUtxosDto } from './dto/get-utxo.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private cryptumService: CryptumService) {}

  @Get(':hash')
  getTransactionByHash(
    @Param('hash') hash: string,
    @Query('protocol') protocol: Protocol,
  ) {
    return this.cryptumService.getTransactionByHash(
      new GetTransactionByHashDto(hash, protocol),
    );
  }
  @Get('utxo/:address')
  getUtxo(
    @Param('address') address: string,
    @Query('protocol') protocol: Protocol,
  ) {
    return this.cryptumService.getUtxos(new GetUtxosDto(address, protocol));
  }
}
