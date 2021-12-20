import { OmitType, PickType } from '@nestjs/swagger';
import { EthProtocol } from '../../cryptum/interfaces/protocols.interface';
import { CreateCeloTransferTransactionDto, CreateTransferTransactionDto } from './create-transaction.dto';

export class MethodParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: MethodParameter[];
}
export class MethodAbi {
  constant: boolean;
  inputs: MethodParameter[];
  name: string;
  outputs: MethodParameter[];
  payable: boolean;
  stateMutability: string;
  type: string;
}

export class CallSmartContractDto extends PickType(OmitType(CreateTransferTransactionDto, ['privateKey']), []) {
  protocol: EthProtocol;
  from: string;
  contractAbi: MethodAbi[];
  method: string;
  params: string[] = [];
  contractAddress: string;
}

export class CreateSmartContractCallTransactionDto extends OmitType(CreateCeloTransferTransactionDto, [
  'tokenSymbol',
  'amount',
  'destination',
]) {
  protocol: EthProtocol;
  contractAbi: MethodAbi[];
  method: string;
  params: string[] = [];
}

export class CallSmartContractResponse {
  result: string | any[];
}

export class CreateSmartContractDeployTransactionDto extends OmitType(CreateCeloTransferTransactionDto, [
  'tokenSymbol',
  'amount',
  'destination',
  'contractAddress',
]) {
  protocol: EthProtocol;
  contractName: string;
  source: string;
  params: string[] = [];
}
