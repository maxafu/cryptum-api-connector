export class TransactionResponse {
  hash: string;
}

export class Transaction {}

export class UTXO {
  index: number;
  txHash: string;
  value: number;
  height?: number;
  address?: string;
}

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  CALL_CONTRACT_METHOD = 'CALL_CONTRACT_METHOD',
  DEPLOY_CONTRACT = 'DEPLOY_CONTRACT',
  DEPLOY_ERC20 = 'DEPLOY_ERC20',
  DEPLOY_ERC721 = 'DEPLOY_ERC721',
  DEPLOY_ERC1155 = 'DEPLOY_ERC1155',
  CHANGE_TRUST = 'CHANGE_TRUST',
  HATHOR_TOKEN_CREATION = 'HATHOR_TOKEN_CREATION',
  HATHOR_TOKEN_MINT = 'HATHOR_TOKEN_MINT',
  HATHOR_TOKEN_MELT = 'HATHOR_TOKEN_MELT',
}
