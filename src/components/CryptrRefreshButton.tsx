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

type RefreshProps = {
  text?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  successCallback?: (data: any) => any;
  errorCallback?: (error: any) => any;
  autoHide?: boolean;
  children?: JSX.Element;
};

const CryptrRefreshButton = ({
  text,
  buttonStyle,
  buttonTextStyle,
  children,
  successCallback,
  errorCallback,
  autoHide = true,
}: RefreshProps): JSX.Element => {
  const { config, isAuthenticated, isLoading, refreshTokens } = useCryptr();

  const ssoSignInText = (): string => {
    if (text) {
      return text;
    }
    return config().default_locale && config().default_locale === Locale.EN
      ? 'Refresh'
      : 'Rafraîchir';
  };

  const refresh = () => {
    refreshTokens(successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && !isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable style={buttonStyle || defaultStyles.button} onPress={refresh}>
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

export default CryptrRefreshButton;
