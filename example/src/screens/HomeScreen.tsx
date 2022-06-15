import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { useCryptr } from '@cryptr/cryptr-react-native';
import Toast from 'react-native-toast-message';
import LoadingView from '../components/LoadingView';
import UnloadingView from '../components/UnloadingView';
import { styles } from '../styles';

const HomeScreen = () => {
  const { isLoading, error, error_description } = useCryptr();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Text style={styles.title}>Cryptr auth sample</Text>
        {error && error_description && (
          <Text style={styles.error}>{error_description}</Text>
        )}
        <>{isLoading ? <LoadingView /> : <UnloadingView />}</>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

export default HomeScreen;
