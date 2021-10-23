import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';

export class GetUtxosDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  constructor(address: string, protocol: Protocol) {
    this.address = address;
    this.protocol = protocol;
  }
}
