import React from 'react';
import { useCryptr } from '@cryptr/cryptr-react-native';
import AuthenticatedView from './AuthenticatedView';
import UnauthenticatedView from './UnauthenticatedView';

const UnloadingView = () => {
  const { isAuthenticated } = useCryptr();
  return (
    <>{isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}</>
  );
};

export default UnloadingView;
