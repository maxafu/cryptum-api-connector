import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CryptumService } from 'src/cryptum/cryptum.service';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';
import { GetTransactionByHashDto } from './dto/get-transaction.dto';
import { GetUtxosDto } from './dto/get-utxo.dto';
import {
  SendTransactionBodyDto,
  SendTransactionDto,
} from './dto/send-transaction.dto';

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
  @Post()
  sendTransaction(
    @Query('protocol') protocol: Protocol,
    @Body() body: SendTransactionBodyDto,
  ) {
    const { signedTx, type } = body;
    return this.cryptumService.sendTransaction(
      new SendTransactionDto(signedTx, type, protocol),
    );
  }
}
