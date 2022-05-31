import React from 'react';
import { Button, Text } from 'react-native';
import {
  LogOutButton,
  RefreshButton,
  SsoSignInButton,
  useCryptr,
} from '@cryptr/cryptr-react-native';
import { styles } from '../styles';
import HorizontalDivider from './HorizontalDivider';
import TokenView from './TokenView';
import { IDP_ID } from '../../cryptrConfig.template';

const AuthenticatedView = () => {
  const { accessToken, decoratedRequest, user } = useCryptr();

  const logOutCallback = (data: any) => {
    console.debug('logout result');
    console.debug(data);
  };

  const logOutErrorCallback = (error: any) => {
    console.debug('logout error');
    console.debug(error);
  };

  const refreshCallback = (data: any) => {
    console.debug('refresh result');
    console.debug(data);
  };

  const refreshErrorCallback = (error: any) => {
    console.debug('refresh error');
    console.debug(error);
  };

  const makeAPIRequest = () => {
    decoratedRequest('http://localhost:5000', {
      headers: { 'x-titi': 'toto' },
    })
      .then((data) => console.debug(data))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Text style={styles.textAuthenticated}>You're logged in</Text>
      <HorizontalDivider />
      {accessToken && <TokenView title="Access Token" value={accessToken} />}
      {user() && <TokenView title="User" value={JSON.stringify(user())} />}
      <HorizontalDivider />
      <SsoSignInButton idpId={IDP_ID} autoHide={false} />
      <LogOutButton
        successCallback={logOutCallback}
        errorCallback={logOutErrorCallback}
        buttonTextStyle={styles.textLogOut}
      />
      <RefreshButton
        successCallback={refreshCallback}
        errorCallback={refreshErrorCallback}
      />
      <Button title="API Request" onPress={makeAPIRequest} />
    </>
  );
};

export default AuthenticatedView;
