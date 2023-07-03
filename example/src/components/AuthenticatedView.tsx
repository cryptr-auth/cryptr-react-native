import React from 'react';
import { Button, Text } from 'react-native';
import {
  LogOutButton,
  RefreshButton,
  useCryptr,
} from '@cryptr/cryptr-react-native';
import { styles } from '../styles';
import HorizontalDivider from './HorizontalDivider';
import TokenView from './TokenView';

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
      {user() && (
        <>
          <TokenView title={user()!.tnt} value={`Issued at ${user()!.iat}`} />
          <TokenView title={'SCI'} value={user()!.sci || '?'} />
          <TokenView title={'IPS'} value={user()!.ips || '?'} />
        </>
      )}
      {accessToken && <TokenView title="Access Token" value={accessToken} />}
      {user() && <TokenView title="User" value={JSON.stringify(user())} />}
      <HorizontalDivider />
      <LogOutButton
        successCallback={logOutCallback}
        errorCallback={logOutErrorCallback}
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
