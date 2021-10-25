import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';
import { TransactionType } from './transaction.dto';

export class SendTransactionBodyDto {
  @ApiProperty()
  signedTx: string;

  @ApiProperty()
  @IsEnum(TransactionType)
  type: TransactionType;
}

export class SendTransactionDto {
  signedTx: string;
  type: TransactionType;
  protocol: Protocol;

  constructor(signedTx: string, type: TransactionType, protocol: Protocol) {
    this.signedTx = signedTx;
    this.type = type;
    this.protocol = protocol;
  }
}
