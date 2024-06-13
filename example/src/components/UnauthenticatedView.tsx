import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles';
import { GatewaySignInButton, useCryptr } from '@cryptr/cryptr-react-native';
import HorizontalDivider from './HorizontalDivider';

const UnauthenticatedView = () => {
  const { signIn } = useCryptr();

  const domain = 'decathlon';
  const email = 'thibaud@misapret.com';

  return (
    <>
      <View>
        <Pressable onPress={() => signIn()} style={styles.button}>
          <Text>Gateway</Text>
        </Pressable>
      </View>
      <HorizontalDivider />
      <GatewaySignInButton domain={domain} text={`Sign in with '${domain}'`} />
      <GatewaySignInButton email={email} text={`Sign in with '${email}'`} />
    </>
  );
};

export default UnauthenticatedView;
