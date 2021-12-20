export class Wallet {
  id?: string;
  xpub?: string;
  privateKey: string;
  publicKey: string;
  address: string;
  protocol: string;
  testnet: boolean;
}
