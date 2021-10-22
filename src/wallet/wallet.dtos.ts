import { Protocol } from '../cryptum/interfaces/cryptum.interface';

export interface IWalletDTO {
  xpub?: string;
  privateKey: string;
  publicKey?: string;
  address?: string;
  protocol: Protocol;
  testnet: boolean;
}

export interface IGenerateWalletDTO {
  protocol: Protocol;
  mnemonic?: string;
  testnet?: boolean;
  derivation?: {
    account: number;
    change: number;
    address: number;
  };
}
