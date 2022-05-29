import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HorizontalDivider from '../components/HorizontalDivider';

const PrivateScreen = () => {
  return (
    <View>
      <View style={styles.privateRoot}>
        <View>
          <Text style={styles.title}>
            This is a private Screen ony available when 'isAuthenticated'
          </Text>
          <HorizontalDivider />
          <View>
            <Text>Below will display user data</Text>
          </View>
          <HorizontalDivider />
          <View>
            <Text>Here will display listview from API request data</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  privateRoot: {
    padding: 4,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

export default PrivateScreen;
