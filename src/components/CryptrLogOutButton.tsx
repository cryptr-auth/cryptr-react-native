import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { defaultStyles } from '../utils/defaultStypes';
import useCryptr from '../useCryptr';
import { Locale } from '../utils/enums';

type LogOutProps = {
  text?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  autoHide?: boolean;
  children?: JSX.Element;
  successCallback?: (data: any) => any;
  errorCallback?: (error: any) => any;
};

const CryptrLogOutButton = ({
  text,
  buttonStyle,
  buttonTextStyle,
  children,
  successCallback,
  errorCallback,
  autoHide = true,
}: LogOutProps): JSX.Element => {
  const { config, isAuthenticated, isLoading, logOut } = useCryptr();

  const ssoSignInText = (): string => {
    if (text) {
      return text;
    }
    return config().default_locale && config().default_locale === Locale.EN
      ? 'Log out'
      : 'Déconnexion';
  };

  const signOut = () => {
    logOut(successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && !isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable style={buttonStyle || defaultStyles.button} onPress={signOut}>
      {children ? (
        children
      ) : (
        <>
          {ssoSignInText() && (
            <Text style={buttonTextStyle || defaultStyles.buttonText}>
              {ssoSignInText()}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export default CryptrLogOutButton;
