import React from 'react';
import { Alert, Platform, Text, ToastAndroid } from 'react-native';
import { styles } from '../styles';
import HorizontalDivider from './HorizontalDivider';
import useCryptr from '../../../src/session/useCryptr';
import { LogOutButton, RefreshButton } from '../../../src/components';
import TokenView from './TokenView';

const AuthenticatedView = () => {
  const { accessToken, user } = useCryptr();

  const displayMessage = (
    title: string,
    message: any,
    duration: number = ToastAndroid.SHORT
  ) => {
    console.debug(title, message);
    const messageToDisplay =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    if (Platform.OS === 'android') {
      ToastAndroid.show(String(messageToDisplay), duration);
    } else {
      Alert.alert(String(messageToDisplay));
    }
  };

  const logOutCallback = (data: any) => {
    displayMessage('logOutCallback', data);
  };

  const logOutErrorCallback = (error: any) => {
    displayMessage('logOutErrorCallback', error, ToastAndroid.LONG);
  };

  const refreshCallback = (data: any) => {
    displayMessage('refreshCallback', data);
  };

  const refreshErrorCallback = (error: any) => {
    displayMessage('refreshErrorCallback', error, ToastAndroid.LONG);
  };

  return (
    <>
      <Text style={styles.textAuthenticated}>You're logged in</Text>
      <HorizontalDivider />
      {user() && (
        <>
          <TokenView title={user()!.org} value={`Issued at ${user()!.iat}`} />
          <TokenView title={'Env'} value={user()!.env || '?'} />
          <TokenView
            title={'Identities'}
            value={JSON.stringify(user()?.identities, null, 2)}
          />
        </>
      )}
      {accessToken && <TokenView title="Access token" value={accessToken} />}
      {user() && (
        <TokenView title="User" value={JSON.stringify(user(), null, 2)} />
      )}
      <HorizontalDivider />
      <LogOutButton
        successCallback={logOutCallback}
        errorCallback={logOutErrorCallback}
      />
      <RefreshButton
        successCallback={refreshCallback}
        errorCallback={refreshErrorCallback}
      />
      <HorizontalDivider />
    </>
  );
};

export default AuthenticatedView;
