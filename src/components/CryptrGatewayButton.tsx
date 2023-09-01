import React from 'react';
import { Locale, useCryptr } from '..';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { defaultStyles } from '../utils/defaultStypes';
import { checkDomainValue, checkEmailValue } from '../utils/helpers';

type GatewayProps = {
  domain?: string;
  email?: string;
  autoHide?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  text?: string;
  children?: JSX.Element;
  successCallback?: (data: any) => any;
  errorCallback?: (data: any) => any;
};

const CryptrGatewayButton = ({
  domain,
  email,
  autoHide,
  buttonTextStyle,
  children,
  text,
  successCallback,
  errorCallback,
}: GatewayProps): JSX.Element => {
  const {
    config,
    isAuthenticated,
    isLoading,
    signInWithDomain,
    signInWithEmail,
  } = useCryptr();

  if (email !== undefined) checkEmailValue(email);
  checkDomainValue(domain);

  const textValue = (): string => {
    if (text) {
      return text;
    }
    return config().default_locale && config().default_locale === Locale.EN
      ? 'Sign in'
      : 'Se connecter';
  };

  const gatewayClick = () => {
    if (email !== undefined && checkEmailValue(email)) {
      signInWithEmail(email, successCallback, errorCallback);
      return;
    }
    signInWithDomain(domain, successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable
      style={buttonTextStyle || defaultStyles.button}
      onPress={gatewayClick}
    >
      {children ? (
        children
      ) : (
        <>
          {textValue() !== '' && (
            <Text style={buttonTextStyle || defaultStyles.buttonText}>
              {textValue()}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export default CryptrGatewayButton;
