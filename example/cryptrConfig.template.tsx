import { CryptrConfig, Region } from '@cryptr/cryptr-react-native';

export const cryptrConfig: CryptrConfig = {
  tenant_domain: 'your-domain',
  client_id: 'CLIENT_ID',
  audience: 'cryptr://your-app',
  default_redirect_uri: 'cryptr://your-app',
  region: Region.EU,
  cryptr_base_url: 'YOUR_CRYPTR_SERVER_URL',
};

export const IDP_ID = 'YOUR_IDP_ID';
