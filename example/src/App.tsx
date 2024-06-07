import * as React from 'react';
import { CryptrProvider } from '@cryptr/cryptr-react-native';
import type { CryptrConfig } from '../../src/utils/interfaces';
import HomeScreen from './screens/HomeScreen';

const config: CryptrConfig = {
  accountDomain: 'account-domain',
  clientId: 'client-id',
  cryptrServiceUrl: 'https://cryptr-service.ul',
  audience: 'cryptr://2024-app',
  defaultRedirectUri: 'cryptr://2024-app',
  dedicatedServer: true,
  noPopupNoCookie: true,
  defaultLocale: 'en',
};

export default function App() {
  return (
    <CryptrProvider {...config}>
      <HomeScreen />
    </CryptrProvider>
  );
}
