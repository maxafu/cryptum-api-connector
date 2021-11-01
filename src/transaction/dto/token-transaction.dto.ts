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
  address: string;
  changeAddress: string;
  tokenUid: string;
  mintAuthorityAddress?: string;
}

export class CreateHathorMeltTokenTransaction extends OmitType(CreateHathorTokenDeployTransaction, [
  'tokenName',
  'tokenSymbol',
  'mintAuthorityAddress',
]) {
  address: string;
  changeAddress: string;
  tokenUid: string;
  meltAuthorityAddress?: string;
}
