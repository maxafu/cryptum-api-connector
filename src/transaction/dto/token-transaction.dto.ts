import { OmitType } from '@nestjs/swagger';
import { CreateSmartContractDeployTransactionDto } from './smartcontract-transaction.dto';
import { EthTokenType } from './transaction.dto';

export class CreateEthTokenDeployTransactionDto extends OmitType(CreateSmartContractDeployTransactionDto, [
  'source',
  'contractName',
]) {
  tokenType: EthTokenType;
  params: string[] = [];
}

export class CreateHathorTokenDeployTransaction extends OmitType(CreateEthTokenDeployTransactionDto, [
  'fee',
  'feeCurrency',
  'params',
  'tokenType',
  'protocol',
]) {
  address: string;
  tokenName: string;
  tokenSymbol: string;
  amount: string;
  mintAuthorityAddress?: string;
  meltAuthorityAddress?: string;
}

export class CreateHathorMintTokenTransaction extends OmitType(CreateHathorTokenDeployTransaction, [
  'tokenName',
  'tokenSymbol',
  'meltAuthorityAddress',
]) {
  changeAddress: string;
  tokenUid: string;
  mintAuthorityAddress?: string;
}

export class CreateHathorMeltTokenTransaction extends OmitType(CreateHathorTokenDeployTransaction, [
  'tokenName',
  'tokenSymbol',
  'mintAuthorityAddress',
]) {
  changeAddress: string;
  tokenUid: string;
  meltAuthorityAddress?: string;
}

export class CreateSolanaTokenDeployTransaction extends OmitType(CreateEthTokenDeployTransactionDto, [
  'fee',
  'feeCurrency',
  'params',
  'tokenType',
  'protocol',
]) {
  tokenName: string;
  tokenSymbol: string;
  amount: string;
  fixedSupply: boolean;
  decimals: number;
}

export class CreateSolanaTokenMintTransaction extends OmitType(CreateEthTokenDeployTransactionDto, [
  'fee',
  'feeCurrency',
  'params',
  'tokenType',
  'protocol',
]) {
    destination: string;
    token: string;
    amount: string | number;
}

export class CreateSolanaTokenBurnTransaction extends OmitType(CreateEthTokenDeployTransactionDto, [
  'fee',
  'feeCurrency',
  'params',
  'tokenType',
  'protocol',
]) {
    token: string;
    amount: string | number;
}