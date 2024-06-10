import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from '../styles';

const LoadingView = () => (
  <>
    <Text style={styles.textWhite}>Please wait</Text>
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#7c42bd" />
    </View>
  </>
);

export default LoadingView;
