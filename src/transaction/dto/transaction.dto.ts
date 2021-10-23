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
