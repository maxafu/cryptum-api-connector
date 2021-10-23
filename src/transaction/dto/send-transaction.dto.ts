import { ApiProperty } from '@nestjs/swagger';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';

export class SendTransactionBodyDto {
  @ApiProperty()
  signedTx: string;

  @ApiProperty()
  type: string;
}

export class SendTransactionDto {
  signedTx: string;
  type: string;
  protocol: Protocol;

  constructor(signedTx: string, type: string, protocol: Protocol) {
    this.signedTx = signedTx;
    this.type = type;
    this.protocol = protocol;
  }
}
