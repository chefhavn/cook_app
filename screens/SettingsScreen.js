import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false); // State to track loading

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Logged out', 'You have been logged out.');

      // Reset navigation state
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator while logging out
      ) : (
        <Button title="Logout" onPress={handleLogout} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
