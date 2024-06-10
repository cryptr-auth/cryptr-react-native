import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import useCryptr from '../../../src/session/useCryptr';
import { styles } from '../styles';
import LoadingView from '../components/LoadingView';
import UnloadingView from '../components/UnloadingView';

const HomeScreen = () => {
  const { error, error_description: errorDescription, isLoading } = useCryptr();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Text style={styles.title}>Cryptr React Native 2024</Text>
        {error && errorDescription && (
          <Text style={styles.error}>{errorDescription}</Text>
        )}
        {isLoading ? <LoadingView /> : <UnloadingView />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
