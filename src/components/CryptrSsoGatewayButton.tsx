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

type SsoGatewayProps = {
  autoHide?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  errorCallback?: (data: any) => any;
  idpId?: string | string[];
  successCallback?: (data: any) => any;
  text?: string;
  children?: JSX.Element;
};

const CryptrSsoGatewayButton = ({
  buttonStyle,
  buttonTextStyle,
  children,
  errorCallback,
  idpId,
  successCallback,
  text,
  autoHide = true,
}: SsoGatewayProps): JSX.Element => {
  const { config, isAuthenticated, isLoading, signinWithSSOGateway } =
    useCryptr();
  const textValue = (): string => {
    if (text) {
      return text;
    }
    return config().default_locale && config().default_locale === Locale.EN
      ? 'Sign in with SSO'
      : 'Se connecter en SSO';
  };

  const gatewayClick = () => {
    signinWithSSOGateway(idpId, successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable
      style={buttonStyle || defaultStyles.button}
      onPress={gatewayClick}
    >
      {children ? (
        children
      ) : (
        <>
          {textValue() && (
            <Text style={buttonTextStyle || defaultStyles.buttonText}>
              {textValue()}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export default CryptrSsoGatewayButton;
