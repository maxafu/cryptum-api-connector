import { Entity, PrimaryColumn, Generated, Column } from 'typeorm';

@Entity({
  name: 'wallet',
})
export class CustodialWallet {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  wallet: string;
}
