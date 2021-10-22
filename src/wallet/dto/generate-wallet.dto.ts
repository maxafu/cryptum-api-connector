import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';

interface Derivation {
  account?: number;
  change?: number;
  address?: number;
}

export class GenerateWalletDto {
  @IsEnum(Protocol)
  protocol: Protocol;

  @IsOptional()
  @IsString()
  mnemonic: string;

  @IsOptional()
  @IsBoolean()
  testnet: boolean;

  @IsOptional()
  @IsObject()
  derivation: Derivation;
}
