import config from '../config';
import { createConnection, Connection, getConnection } from 'typeorm';
import { CustodialWallet } from './models';

export async function connect() {
  const url = config.dbUrl();
  const type = url.split(':', 1)[0];
  return createConnection({
    url,
    type,
    entities: [CustodialWallet],
    synchronize: true,
  } as any);
}

export async function getDbConnection(): Promise<Connection> {
  let connection: Connection;
  try {
    connection = getConnection();
  } catch (e) {
    if (e.message.indexOf('not found') < 0) {
      throw e;
    }
  }
  if (!connection || !connection.isConnected) {
    connection = await connect();
  }
  return connection;
}
