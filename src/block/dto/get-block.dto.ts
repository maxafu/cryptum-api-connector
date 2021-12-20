import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';

export class Block {}

export class GetBlockDto {
  @ApiProperty()
  block: string;

  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  constructor(block: string, protocol: Protocol) {
    this.block = block;
    this.protocol = protocol;
  }
}
