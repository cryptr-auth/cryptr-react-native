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

type SsoSignInProps = {
  idpId: string;
  text?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  autoHide?: boolean;
  successCallback?: (data: any) => any;
  children?: JSX.Element;
};

const CryptrSsoSignInButton = ({
  idpId,
  text,
  buttonStyle,
  buttonTextStyle,
  children,
  successCallback,
  autoHide = true,
}: SsoSignInProps): JSX.Element => {
  if (idpId === '') {
    throw new Error("Please provide non blank value for 'idpId'");
  }
  const { config, isAuthenticated, isLoading, signinWithSSO } = useCryptr();

  const ssoSignInText = (): string => {
    if (text) {
      return text;
    }
    return config().default_locale && config().default_locale === Locale.EN
      ? 'Sign in with SSO'
      : 'Se connecter en SSO';
  };

  const ssoClick = () => {
    signinWithSSO(idpId, successCallback);
  };

  if (
    (isAuthenticated !== undefined && isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable style={buttonStyle || defaultStyles.button} onPress={ssoClick}>
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

export default CryptrSsoSignInButton;
