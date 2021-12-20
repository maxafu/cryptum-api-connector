import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export async function getAWSSecret(secretId: string): Promise<string> {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_ID || '',
      secretAccessKey: process.env.AWS_SECRET_KEY || '',
    },
  });
  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });
  const data = await client.send(command);
  return data.SecretString || '';
}
