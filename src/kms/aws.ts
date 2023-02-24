import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import config from '../config';

export async function getAWSSecret(secretName: string): Promise<string> {
  const { region, accessId, secretKey } = config.aws();
  const client = new SecretsManagerClient({
    region,
    credentials: {
      accessKeyId: accessId,
      secretAccessKey: secretKey,
    },
  });
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });
  const data = await client.send(command);
  let secret = '';
  if ('SecretString' in data) {
    secret = data.SecretString;
  } else {
    secret = Buffer.from(data.SecretBinary).toString('ascii');
  }
  return secret;
}
