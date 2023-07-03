import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  GatewayButton,
  SsoGatewayButton,
  SsoSignInButton,
  useCryptr,
} from '@cryptr/cryptr-react-native';
import { IDP_ID } from '../../cryptrConfig.template';
import { styles } from '../styles';
import HorizontalDivider from './HorizontalDivider';

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
      <HorizontalDivider />
      {/* <SsoGatewayButton autoHide={false} text="Gateway" /> */}
      <GatewayButton text="Bare Gateway" />
      <GatewayButton domain="cryptr" text="Sign In With `cryptr`" />
      <GatewayButton
        email="thibaud@cryptr.co"
        text="Sign In With `thibaud@cryptr.co`"
      />
      <View>
        {/* <Pressable
          onPress={() => signinWithSSOGateway(IDP_ID)}
          style={styles.button}
        >
          <Text>Gateway on IDP</Text>
        </Pressable> */}
        {/* <SsoGatewayButton
          idpId={[IDP_ID, IDP_ID2]}
          text="Gateway with multiple IDPs"
        /> */}
      </View>
    </>
  );
};

export default UnauthenticatedView;
