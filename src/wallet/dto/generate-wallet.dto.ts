import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';

export interface Derivation {
  account?: number;
  change?: number;
  address?: number;
}

export class GenerateWalletDto {
  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mnemonic: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  derivation: Derivation;
}
