import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { CryptrButtonProps } from '../utils/types';
import { defaultStyles } from '../utils/defaultStyles';
import useCryptr from '../session/useCryptr';

const CryptrLogOutButton = ({
  autoHide = true,
  buttonStyle,
  buttonTextStyle,
  children,
  errorCallback,
  successCallback,
  text,
}: CryptrButtonProps): JSX.Element => {
  const { isAuthenticated, isLoading, logOut } = useCryptr();

  const textValue = (): string => {
    if (text) return text;
    return 'Log out';
  };

  const handleClick = async () => {
    logOut(successCallback, errorCallback);
  };

  if (
    (isAuthenticated !== undefined && !isAuthenticated && autoHide) ||
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

export default CryptrLogOutButton;
