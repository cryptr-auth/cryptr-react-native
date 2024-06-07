import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SignInButtonProps } from '../utils/types';
import { checkDomainValue, checkEmailValue } from '../utils/helpers';
import useCryptr from '../session/useCryptr';
import { defaultStyles } from '../utils/defaultStyles';

const CryptrSignInButton = ({
  autoHide = true,
  buttonStyle,
  buttonTextStyle,
  children,
  domain,
  email,
  errorCallback,
  successCallback,
  text,
}: SignInButtonProps) => {
  const { isAuthenticated, isLoading, signInWithEmail, signInWithDomain } =
    useCryptr();
  email !== undefined ? checkEmailValue(email) : checkDomainValue(domain);

  const textValue = (): string => {
    if (text) return text;
    return 'Sign in';
  };

  const handleClick = () => {
    email !== undefined
      ? signInWithEmail(email, successCallback, errorCallback)
      : signInWithDomain(domain!, successCallback, errorCallback);
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
