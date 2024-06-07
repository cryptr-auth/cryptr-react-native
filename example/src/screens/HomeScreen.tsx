import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import useCryptr from '../../../src/session/useCryptr';
import { styles } from '../styles';
import {
  LogOutButton,
  RefreshButton,
  SignInButton,
} from '../../../src/components';
import HorizontalDivider from '../components/HorizontalDivider';

const HomeScreen = () => {
  const {
    error,
    user,
    isLoading,
    isAuthenticated,
    signInWithDomain,
    signInWithEmail,
  } = useCryptr();

  const displayMessage = (
    message: any,
    duration: number = ToastAndroid.SHORT
  ) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(String(message), duration);
    } else {
      Alert.alert(String(message));
    }
  };

  const successCallback = (data: any) => {
    displayMessage(data);
  };

  const errorCallback = (errorMessage: any) => {
    displayMessage(errorMessage, ToastAndroid.LONG);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Text style={styles.title}>Cryptr React Native 2024</Text>
        <View>
          <SignInButton
            successCallback={successCallback}
            errorCallback={errorCallback}
            autoHide={false}
          />
          <LogOutButton
            successCallback={successCallback}
            errorCallback={errorCallback}
          />
          <RefreshButton
            successCallback={successCallback}
            errorCallback={errorCallback}
          />
          {isLoading && (
            <Text style={localeStyles.loadingText}>IS LOADING...</Text>
          )}
          {isAuthenticated && (
            <Text style={localeStyles.loadingText}>IS Authenticated</Text>
          )}
          {!isLoading && isAuthenticated && user() && (
            <Text style={localeStyles.authenticatedText}>
              IS Authenticated 🎉, bonjour {user()?.email}
            </Text>
          )}
          <>
            <HorizontalDivider />
            <Pressable
              onPress={() => signInWithDomain('decathlon')}
              style={styles.button}
            >
              <Text>Domain</Text>
            </Pressable>
            <Pressable
              onPress={() => signInWithEmail('thibaud@misapret.com')}
              style={styles.button}
            >
              <Text>Email</Text>
            </Pressable>
            <HorizontalDivider />
          </>
          {!isLoading && !isAuthenticated && (
            <>
              <Text style={localeStyles.unauthenticatedText}>
                IS NOT Authenticated 🥲, please login
              </Text>
            </>
          )}
          {error && (
            <>
              <Text style={localeStyles.unauthenticatedText}>ERROR</Text>
              <Text style={localeStyles.unauthenticatedText}>{error}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const localeStyles = StyleSheet.create({
  authenticatedText: {
    color: 'white',
  },
  unauthenticatedText: {
    color: 'red',
    backgroundColor: 'white',
    textAlign: 'center',
    padding: 4,
  },
  loadingText: {
    textAlign: 'center',
    color: 'orange',
  },
});

export default HomeScreen;
