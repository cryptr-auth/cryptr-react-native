import React from 'react';
import type { CryptrButtonProps } from '../utils/types';
import { Pressable, Text, View } from 'react-native';
import useCryptr from '../session/useCryptr';
import { defaultStyles } from '../utils/defaultStyles';

const CryptrRefreshButton = ({
  text,
  buttonStyle,
  buttonTextStyle,
  children,
  successCallback,
  errorCallback,
  autoHide = true,
}: CryptrButtonProps): JSX.Element => {
  const { isAuthenticated, isLoading, refreshTokens } = useCryptr();
  const textValue = () => {
    return text || 'Refresh';
  };

  const handleClick = () => {
    refreshTokens(successCallback, errorCallback);
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

export default CryptrRefreshButton;
