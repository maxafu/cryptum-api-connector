import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { Protocol } from 'cryptum-sdk/dist/src/services/blockchain/constants';
import { TrustlineProtocol } from 'src/cryptum/interfaces/protocols.interface';
import { EthFee } from 'src/transaction/dto/create-transaction.dto';

export class KmsCreateTransactionDto {
  @ApiProperty()
  walletId: string;
}

export class KmsSetTrustlineTransactionDto extends KmsCreateTransactionDto {
  @ApiProperty()
  @IsEnum(TrustlineProtocol)
  protocol: TrustlineProtocol;

  @ApiProperty({
    description: 'Asset symbol',
  })
  @IsString()
  @IsNotEmpty()
  symbol: string;

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
}

export class KmsCreateTransferTransactionDto extends KmsCreateTransactionDto {
  protocol: Protocol;
}

export class KmsTokenTransferTransactionDto extends KmsCreateTransferTransactionDto {
  @ApiProperty()
  token: string;

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
  destination?: string;

  @ApiProperty()
  destinations?: any[];

  @ApiProperty()
  memo?: string;
  @ApiProperty()
  feeCurrency?: string;
}
export class KmsNftTransferTransactionDto extends OmitType(KmsTokenTransferTransactionDto, [
  'memo',
  'createAccount',
  'issuer',
  'destination',
  'destinations',
]) {
  @ApiProperty()
  destination: string;
  @ApiProperty()
  tokenId?: string;
  @ApiProperty()
  feeCurrency?: string;
}

export class SolanaCreator {
  address: string;
  share: number;
  verified: boolean;
}

export class KmsTokenCreationTransactionDto extends KmsCreateTransferTransactionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  mintAuthorityAddress?: string;
  @ApiProperty()
  meltAuthorityAddress?: string;
  @ApiProperty()
  feeCurrency?: string;
}

export class KmsNftCreationTransactionDto extends KmsTokenCreationTransactionDto {
  @ApiProperty()
  uri?: string;
  @ApiProperty()
  type: 'ERC721' | 'ERC1155';
  @ApiProperty()
  creators?: SolanaCreator[];
  @ApiProperty()
  royaltiesFee?: number;
  @ApiProperty()
  collection?: string;
}

export class KmsTokenMintTransactionDto extends OmitType(KmsTokenTransferTransactionDto, [
  'memo',
  'createAccount',
  'issuer',
  'destination',
  'destinations',
]) {
  @ApiProperty()
  destination: string;

  @ApiProperty()
  mintAuthorityAddress?: string;
  @ApiProperty()
  feeCurrency?: string;
}
export class KmsNftMintTransactionDto extends KmsTokenMintTransactionDto {
  @ApiProperty()
  tokenId?: string;
  @ApiProperty()
  uri?: string;

  @ApiProperty()
  mintAuthorityAddress?: string;
  @ApiProperty()
  feeCurrency?: string;
}
export class KmsTokenBurnTransactionDto extends OmitType(KmsTokenTransferTransactionDto, [
  'memo',
  'createAccount',
  'issuer',
  'destination',
  'destinations',
]) {
  @ApiProperty()
  destination: string;

  @ApiProperty()
  meltAuthorityAddress?: string;
  @ApiProperty()
  feeCurrency?: string;
}
export class KmsNftBurnTransactionDto extends KmsTokenMintTransactionDto {
  @ApiProperty()
  tokenId?: string;

  @ApiProperty()
  meltAuthorityAddress?: string;
  @ApiProperty()
  feeCurrency?: string;
}

export class KmsSmartContractTransactionDto extends KmsCreateTransferTransactionDto {
  contractAddress: string;
  contractAbi: any[];
  method: string;
  params: any[];
  fee?: EthFee;
  feeCurrency?: string;
}

export class KmsSmartContractDeployDto extends KmsCreateTransferTransactionDto {
  contractName: string;
  params: any[];
  source: string;
  fee?: EthFee;
  feeCurrency?: string;
}
