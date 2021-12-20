import { AES, enc } from 'crypto-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as uuid from 'uuid';
import CryptumSDK from 'cryptum-sdk';
import { Wallet, WalletTransaction } from 'cryptum-sdk/dist/src/features/wallet/entity';
import config from '../config';
import { dirname } from 'path';
import { getDbConnection } from '../db';
import { CustodialWallet } from '../db/models';

const ensurePathExists = (path: string) => {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

export async function getManagedWalletFromPendingTransaction(transaction: WalletTransaction, password: string) {
  const sdk = new CryptumSDK(config.cryptumConfig());
  if (transaction.inputs && transaction.inputs.length > 0) {
    // TODO
    return [new Wallet({ address: '', protocol: transaction.protocol, publicKey: '', privateKey: '', testnet: true })];
  } else if (transaction.walletId) {
    const walletPath = config.localPath();
    if (config.useLocalPath) {
      if (!existsSync(walletPath)) {
        throw new Error(`No such wallet id '${transaction.walletId}'`);
      }
    }
    const data = readFileSync(walletPath, { encoding: 'utf8' });
    if (!data?.length) {
      throw new Error(`No such wallet id '${transaction.walletId}'`);
    }
    let wallet;
    try {
      wallet = JSON.parse(AES.decrypt(data, password).toString(enc.Utf8));
      if (!wallet[transaction.walletId]) {
        throw new Error(`No such wallet id '${transaction.walletId}'`);
      }
    } catch (e) {
      throw new Error(`Wrong password`);
    }
    return await sdk.getWalletController().generateWalletFromPrivateKey({
      privateKey: wallet[transaction.walletId].privateKey,
      protocol: transaction.protocol,
    });
  } else {
    return null;
  }
}

export async function storeWallet(wallet: Wallet) {
  const password = config.password;
  const id = uuid.v4();
  const entry = { [id]: wallet };

  if (config.useLocalPath) {
    const pathToWallet = config.localPath();
    if (!existsSync(pathToWallet)) {
      ensurePathExists(pathToWallet);
      writeFileSync(pathToWallet, AES.encrypt(JSON.stringify(entry), password).toString());
    } else {
      const data = readFileSync(pathToWallet, { encoding: 'utf8' });
      let walletData = entry;
      if (data?.length > 0) {
        walletData = { ...walletData, ...JSON.parse(AES.decrypt(data, password).toString(enc.Utf8)) };
      }
      writeFileSync(pathToWallet, AES.encrypt(JSON.stringify(walletData), password).toString());
    }
  }
  if (config.useDb) {
    const db = await getDbConnection();
    await db.manager.insert(CustodialWallet, { id, wallet: AES.encrypt(JSON.stringify(wallet), password).toString() });
  }
  return { id, wallet };
}
