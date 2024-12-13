import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomInput from '../../component/CustomInput/CustomInput';
import CustomButton from '../../component/CustomButton/CustomButton';
import { login } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login(phone);

      // Check if login is successful (modify based on API response structure)
      if (response.success) {
        console.log('Login successful:', response.user);

        // Store login details (e.g., token, user info) in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.user));

        // Check if user data is successfully stored
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          console.log('User data stored successfully:', storedUser);

          Alert.alert('Success', 'Login successful');
          setIsLoading(false);

          // Navigate to Home Screen
          navigation.navigate('HomeTabs');
        } else {
          throw new Error('Failed to store user data.');
        }
      } else {
        Alert.alert('Error', response.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Login to continue</Text>
      <CustomInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <CustomButton title="Login" onPress={handleLogin} isLoading={isLoading} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.registerText}>
        Not registered?{' '}
        <Text
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
        >
          Register Here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  registerLink: {
    color: '#4688F1',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
