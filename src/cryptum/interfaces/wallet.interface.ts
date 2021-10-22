import { Protocol } from './protocols.interface';

export interface Wallet {
  xpub?: string;
  privateKey: string;
  publicKey?: string;
  address?: string;
  protocol: Protocol;
  testnet: boolean;
}
