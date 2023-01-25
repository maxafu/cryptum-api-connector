import { Entity, PrimaryColumn, Generated, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({
  name: 'wallets',
})
export class CustodialWallet {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'text', nullable: false })
  wallet: string;

  @CreateDateColumn()
  createdAt: Date;
}
