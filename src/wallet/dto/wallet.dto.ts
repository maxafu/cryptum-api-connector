import { Protocol } from 'src/cryptum/interfaces/protocols.interface';

export class Wallet {
  xpub?: string;
  privateKey: string;
  publicKey?: string;
  address?: string;
  protocol: Protocol;
  testnet: boolean;
}
