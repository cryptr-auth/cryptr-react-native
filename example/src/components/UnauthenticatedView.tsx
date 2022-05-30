import React from 'react';
import { StyleSheet } from 'react-native';
import { SsoSignInButton } from '@cryptr/cryptr-react-native';
import { IDP_ID } from '../../cryptrConfig.template';

export const unauthStyles = StyleSheet.create({
  ssoBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ssoBtnIcon: {
    height: 20,
    width: 20,
  },
  simpleBtn: {
    padding: 0,
  },
});

const UnauthenticatedView = () => {
  return (
    <>
      <SsoSignInButton idpId={IDP_ID} />
    </>
  );
};

export default UnauthenticatedView;
