import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';

export class GetTransactionByHashDto {
  @ApiProperty()
  hash: string;

  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  constructor(hash: string, protocol: Protocol) {
    this.hash = hash;
    this.protocol = protocol;
  }
}
