import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SignInButtonProps } from '../utils/types';
import useCryptr from '../session/useCryptr';
import { defaultStyles } from '../utils/defaultStyles';

const CryptrSignInButton = ({
  autoHide = true,
  buttonStyle,
  buttonTextStyle,
  children,
  errorCallback,
  successCallback,
  text,
}: SignInButtonProps) => {
  const { isAuthenticated, isLoading, signIn } = useCryptr();

  const textValue = (): string => {
    if (text) return text;
    return 'Sign in';
  };

  const handleClick = async () => {
    signIn(successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && isAuthenticated && autoHide) ||
    isLoading
  ) {
    return <View />;
  }

  return (
    <Pressable
      onPress={handleClick}
      style={buttonStyle || defaultStyles.button}
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

export default CryptrSignInButton;
