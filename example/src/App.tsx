import * as React from 'react';
import { CryptrProvider } from '@cryptr/cryptr-react-native';

import HomeScreen from './screens/HomeScreen';
import cryptrConfig from '../cryptrConfig.template';

export default function App() {
  return (
    <CryptrProvider {...cryptrConfig}>
      <HomeScreen />
    </CryptrProvider>
  );
}
