import { ApiProperty } from '@nestjs/swagger';

interface Balance {
  asset: string;
  amount: string;
  issuer?: string;
  uid?: string;
  name?: string;
  symbol?: string;
  address?: string;
  decimals?: string;
}

export class WalletInfo {
  @ApiProperty()
  link: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  balances: Balance[];

  @ApiProperty()
  nonce?: number;

  @ApiProperty()
  sequence?: string | number;

  @ApiProperty()
  ledgerCurrentIndex?: number;
}
