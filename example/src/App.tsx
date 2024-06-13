import * as React from 'react';
import { CryptrProvider } from '@cryptr/cryptr-react-native';
import type { CryptrConfig } from '../../src/utils/interfaces';
import HomeScreen from './screens/HomeScreen';
import {
  REACT_APP_CRYPTR_ACCOUNT_DOMAIN,
  REACT_APP_CRYPTR_CLIENT_ID,
  REACT_APP_CRYPTR_SERVICE_URL,
  REACT_APP_CRYPTR_AUDIENCE,
  REACT_APP_CRYPTR_DEFAULT_REDIRECT_URI,
  REACT_APP_CRYPTR_DEDICATED_SERVER,
  REACT_APP_CRYPTR_NO_POPUP_NO_COOKIE,
  REACT_APP_CRYPTR_DEFAULT_LOCALE,
} from '@env';

const cryptrConfig: CryptrConfig = {
  accountDomain: REACT_APP_CRYPTR_ACCOUNT_DOMAIN,
  clientId: REACT_APP_CRYPTR_CLIENT_ID,
  cryptrServiceUrl: REACT_APP_CRYPTR_SERVICE_URL,
  audience: REACT_APP_CRYPTR_AUDIENCE,
  defaultRedirectUri: REACT_APP_CRYPTR_DEFAULT_REDIRECT_URI,
  dedicatedServer: REACT_APP_CRYPTR_DEDICATED_SERVER === 'true',
  noPopupNoCookie: REACT_APP_CRYPTR_NO_POPUP_NO_COOKIE === 'true',
  defaultLocale: REACT_APP_CRYPTR_DEFAULT_LOCALE,
};

export default function App() {
  return (
    <CryptrProvider {...cryptrConfig}>
      <HomeScreen />
    </CryptrProvider>
  );
}
