import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Protocol } from 'src/cryptum/interfaces/protocols.interface';

export class Block {}

export class GetBlockDto {
  @ApiProperty()
  block: string | number;

  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  constructor(block: string | number, protocol: Protocol) {
    this.block = block;
    this.protocol = protocol;
  }
}
