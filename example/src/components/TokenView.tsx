import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface TokenProps {
  title: string;
  value: string;
}

const TokenView = (props: TokenProps) => {
  const { title, value } = props;

  return (
    <View style={styles.tokenViewWrapper}>
      <Text style={styles.tokenViewTitle}>{title}</Text>
      <Text style={styles.tokenViewBody}>{value}</Text>
    </View>
  );
};

export default TokenView;
