import React from 'react';
import { StyleSheet, View } from 'react-native';

const HorizontalDivider = () => {
  return <View style={styles.horizontalDivider} />;
};
export default HorizontalDivider;

const styles = StyleSheet.create({
  horizontalDivider: {
    backgroundColor: 'gray',
    height: 1,
    width: 250,
    marginVertical: 12,
  },
});
