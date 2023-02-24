import http from 'http';
import https from 'https';
import axios from 'axios';

export async function getAzureKeyVaultSecret(secretName: string): Promise<string> {
  const axiosInstance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
  try {
    const tenantId = process.env.AZURE_TENANT_ID || '';
    const clientId = process.env.AZURE_CLIENT_ID || '';
    const clientSecret = process.env.AZURE_CLIENT_SECRET || '';
    const body = `grant_type=client_credentials&scope=https://vault.azure.net/.default&client_id=${clientId}&client_secret=${clientSecret}`;
    const { data: authResponse } = await axiosInstance.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      body,
    );

    const azureToken = authResponse.access_token;

    const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
    const url = 'https://' + keyVaultName + '.vault.azure.net';

    const secretVersion = process.env.AZURE_SECRET_VERSION || '';
    const { data: secret } = await axiosInstance.get(`${url}/secrets/${secretName}/${secretVersion}?api-version=7.1`, {
      headers: {
        Authorization: `Bearer ${azureToken}`,
      },
    });
    return secret.value;
  } catch (e) {
    const err = (e && e.response && e.response.data) || e;
    throw err;
  }
}
