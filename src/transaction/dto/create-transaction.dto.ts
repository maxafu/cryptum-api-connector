import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Protocol, TrustlineProtocol } from '../../cryptum/interfaces/protocols.interface';

export class EthFee {
  gas: number;
  gasPrice: string;
}

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
  @IsNotEmpty()
  assetSymbol: string;

  @ApiProperty({
    description: 'Issuer account of the asset symbol',
  })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({
    description: 'Amount limit this account is allowed to hold for this asset',
  })
  @IsNumberString()
  limit: string;

  @ApiProperty({
    description: 'Memo string',
  })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty()
  fee?: string;
}

export class CreateTransferTransactionDto extends CreateTransactionDto {
  protocol: Protocol;
}

export class CreateStellarTransferTransactionDto extends OmitType(CreateTransferTransactionDto, ['protocol']) {
  @ApiProperty()
  assetSymbol: string;

  @ApiProperty()
  issuer?: string;

  @ApiProperty({
    description: 'Indicate if this transfer will be used to create an account',
  })
  createAccount?: boolean;

  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  memo?: string;

  @ApiProperty()
  fee?: string;
}

export class CreateRippleTransferTransactionDto extends OmitType(CreateTransferTransactionDto, ['protocol']) {
  @ApiProperty()
  assetSymbol: string;

  @ApiProperty()
  issuer?: string;

  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  memo?: string;

  @ApiProperty()
  fee?: string;
}

export class CreateEthereumTransferTransactionDto extends OmitType(CreateTransferTransactionDto, ['protocol']) {
  @ApiProperty()
  tokenSymbol?: string;

  @ApiProperty()
  contractAddress?: string;

  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  fee?: EthFee;
}

export class CreateCeloTransferTransactionDto extends CreateEthereumTransferTransactionDto {
  @ApiProperty()
  feeCurrency?: string;
}

export class Output {
  address: string;
  amount: string;
  token: string;
}
export class HathorOutput extends Output {
  token: string;
}
export class CardanoOutput extends OmitType(Output, ['token']) {
  token: { policyId: string; symbol: string };
}
export class Input {
  txHash: string;
  index: number;
  privateKey: string;
}

export class CreateHathorTransferTransactionDto extends OmitType(CreateTransferTransactionDto, [
  'protocol',
  'privateKey',
]) {
  @ApiProperty()
  privateKey?: string;

  @ApiProperty()
  inputs?: Input[];

  @ApiProperty()
  outputs: HathorOutput[];
}

export class CreateBitcoinTransferTransactionDto extends OmitType(CreateTransferTransactionDto, [
  'protocol',
  'privateKey',
]) {
  @ApiProperty()
  privateKey?: string;

  @ApiProperty()
  inputs?: Input[];

  @ApiProperty()
  outputs: Output[];
}

export class CreateCardanoTransferTransactionDto extends OmitType(CreateBitcoinTransferTransactionDto, ['outputs']) {
  @ApiProperty()
  outputs: CardanoOutput[];
}
