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

export async function getManagedWalletFromPendingTransaction(transaction: WalletTransaction, secret: string) {
  const sdk = new CryptumSDK(config.cryptumConfig());
  if (transaction.walletId) {
    const walletPath = config.localPath();
    if (config.useLocalPath) {
      if (!existsSync(walletPath)) {
        throw new Error(`No such wallet id '${transaction.walletId}'`);
      }

      const data = readFileSync(walletPath, { encoding: 'utf8' });
      if (!data?.length) {
        throw new Error(`No such wallet id '${transaction.walletId}'`);
      }

      let wallet: Wallet;
      try {
        wallet = JSON.parse(AES.decrypt(data, secret).toString(enc.Utf8));
        if (!wallet[transaction.walletId]) {
          throw new Error(`No such wallet id '${transaction.walletId}'`);
        }
      } catch (e) {
        throw new Error(`Wrong secret`);
      }
      return await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: wallet[transaction.walletId].privateKey,
        protocol: transaction.protocol,
      });
    } else if (config.useDb) {
      const db = await getDbConnection();
      const encryptedWallet = await db.manager.findOne(CustodialWallet, { where: { id: transaction.walletId } });
      let wallet: Wallet;
      try {
        wallet = JSON.parse(AES.decrypt(encryptedWallet.wallet, secret).toString(enc.Utf8));
        if (!wallet) {
          throw new Error(`No such wallet id '${transaction.walletId}'`);
        }
      } catch (e) {
        throw new Error(`Wrong secret`);
      }
      return await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: wallet.privateKey,
        protocol: transaction.protocol,
      });
    }
  } else {
    return null;
  }
}

export async function storeWallet(wallet: Wallet) {
  const secret = config.secret;
  const id = uuid.v4();
  const entry = { [id]: wallet };

  if (config.useLocalPath) {
    const pathToWallet = config.localPath();
    if (!existsSync(pathToWallet)) {
      ensurePathExists(pathToWallet);
      writeFileSync(pathToWallet, AES.encrypt(JSON.stringify(entry), secret).toString());
    } else {
      const data = readFileSync(pathToWallet, { encoding: 'utf8' });
      let walletData = entry;
      if (data?.length > 0) {
        walletData = { ...walletData, ...JSON.parse(AES.decrypt(data, secret).toString(enc.Utf8)) };
      }
      writeFileSync(pathToWallet, AES.encrypt(JSON.stringify(walletData), secret).toString());
    }
  } else if (config.useDb) {
    const db = await getDbConnection();
    await db.manager.insert(CustodialWallet, {
      id,
      address: wallet.address || wallet.publicKey,
      wallet: AES.encrypt(JSON.stringify(wallet), secret).toString(),
      protocol: wallet.protocol,
    });
  }
  return { id, wallet };
}
