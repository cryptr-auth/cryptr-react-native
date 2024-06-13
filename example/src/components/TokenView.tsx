import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from '../styles';

interface TokenViewProps {
  title: string;
  value: string;
}

const TokenView = ({ title, value }: TokenViewProps) => (
  <Pressable
    style={styles.tokenViewWrapper}
    onLongPress={() => console.debug(title, value)}
  >
    <Text style={styles.tokenViewTitle}>{title}</Text>
    <Text style={styles.tokenViewBody}>{value}</Text>
  </Pressable>
);

export default TokenView;
