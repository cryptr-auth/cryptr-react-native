import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface TokenViewProps {
  title: string;
  value: string;
}

const TokenView = ({ title, value }: TokenViewProps) => {
  return (
    <View style={styles.tokenViewWrapper}>
      <Text style={styles.tokenViewTitle}>{title}</Text>
      <Text style={styles.tokenViewBody}>{value}</Text>
    </View>
  );
};

export default TokenView;
