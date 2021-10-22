import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';

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
  derivation: {
    account: number;
    change: number;
    address: number;
  };
}
