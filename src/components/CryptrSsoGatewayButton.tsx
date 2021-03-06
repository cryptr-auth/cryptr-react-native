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

const checkIdpValue = (idpvalue: string) => {
  if (idpvalue.trim() === '') {
    throw new Error('Please provide non blank string(s) for idpId');
  }
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

  if (idpId !== undefined) {
    if (typeof idpId === 'string') {
      checkIdpValue(idpId);
    } else if (idpId.length === 0) {
      throw new Error('Please provide non blank string(s) for idpId');
    } else {
      idpId.forEach((id) => checkIdpValue(id));
    }
  }

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
