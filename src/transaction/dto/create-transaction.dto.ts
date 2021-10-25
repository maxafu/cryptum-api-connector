import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import {
  Protocol,
  TrustlineProtocol,
} from '../../cryptum/interfaces/protocols.interface';

export class CreateTransactionDto {
  @ApiProperty()
  privateKey: string;
}

export class CreateTrustlineTransactionDto extends CreateTransactionDto {
  @ApiProperty()
  @IsEnum(TrustlineProtocol)
  protocol: TrustlineProtocol;

  @ApiProperty({
    description: 'Asset symbol',
  })
  @IsString()
  assetSymbol: string;

  @ApiProperty({
    description: 'Issuer account of the asset symbol',
  })
  @IsString()
  issuer: string;

  @ApiProperty({
    description: 'Amount limit this account is allowed to hold for this asset',
  })
  @IsNumberString({ no_symbols: true })
  limit: string;

  @ApiProperty({
    description: 'Memo string',
  })
  @IsOptional()
  @IsString()
  memo?: string;
}

export class CreateTransferTransactionDto extends CreateTransactionDto {
  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiProperty()
  assetSymbol: string;

  @ApiProperty()
  issuer: string;

  @ApiProperty()
  limit: string;

  @ApiProperty()
  memo?: string;
}
