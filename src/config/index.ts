import { Config } from 'cryptum-sdk';

export default {
  port: () => parseInt(process.env.PORT, 10) || 8000,
  cryptumConfig: (): Config => ({
    environment: process.env.NODE_ENV || 'development',
    apiKey: process.env.CRYPTUM_API_KEY,
  }),
  localPath: () => process.env.LOCAL_PATH,
  localPassword: () => process.env.LOCAL_PASSWORD,
  dbUrl: () => process.env.DB_URL,
  azure: () => ({
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    keyVaultName: process.env.AZURE_KEY_VAULT_NAME,
    secretName: process.env.AZURE_SECRET_NAME,
    secretVersion: process.env.AZURE_SECRET_VERSION,
  }),
  aws: () => ({
    region: process.env.AWS_REGION,
    accessId: process.env.AWS_ACCESS_ID,
    secretKey: process.env.AWS_SECRET_KEY,
    secretId: process.env.AWS_SECRET_ID,
  }),
  password: '',
  saveWallets: false,
  useLocalPath: false,
  useDb: false,
  useAzure: false,
  useAWS: false,
};
