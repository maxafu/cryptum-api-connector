import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CryptumService } from '../cryptum/cryptum.service';
import { Protocol } from '../cryptum/interfaces/protocols.interface';
import { CreateTrustlineTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionByHashDto } from './dto/get-transaction.dto';
import { GetUtxosDto } from './dto/get-utxo.dto';
import { SendTransactionDto } from './dto/send-transaction.dto';

@ApiTags('transaction')
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
  @Post('broadcast')
  sendTransaction(@Body() body: SendTransactionDto) {
    const { signedTx, type, protocol } = body;
    return this.cryptumService.sendTransaction(
      new SendTransactionDto(signedTx, type, protocol),
    );
  }
  @Post('trustline')
  createTransaction(@Body() body: CreateTrustlineTransactionDto) {
    return this.cryptumService.createTrustlineTransaction(body);
  }
}
