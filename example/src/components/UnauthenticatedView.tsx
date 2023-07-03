import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GatewayButton, useCryptr } from '@cryptr/cryptr-react-native';
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
  const { signInWithDomain } = useCryptr();
  return (
    <>
      <View>
        <Pressable onPress={() => signInWithDomain()} style={styles.button}>
          <Text>Bare Gateway</Text>
        </Pressable>
      </View>
      <HorizontalDivider />
      <GatewayButton domain="cryptr" text="Sign In With `cryptr`" />
      <GatewayButton
        email="thibaud@cryptr.co"
        text="Sign In With `thibaud@cryptr.co`"
      />
    </>
  );
};

export default UnauthenticatedView;
