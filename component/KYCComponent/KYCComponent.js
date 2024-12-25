import React, { useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../utils/Colors';

// const Colors = {
//   PRIMARY: '#4CAF50', // Define your primary color here
//   TEXT: '#333',
//   BACKGROUND: '#f9f9f9',
//   BUTTON_TEXT: '#fff',
// };

const KYCComponent = ({ navigation }) => {
  const [kycStatus, setKycStatus] = useState("");

  const fetchKYCStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        console.log(parsedUser);
        setKycStatus(parsedUser?.kyc_status);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKYCStatus();
    }, [])
  );

  const handleCompleteKYC = () => {
    Alert.alert('KYC', 'Navigating to Complete KYC Screen...');
    navigation.navigate('KYCVerification');
  };

  if (kycStatus === 'Pending') {
    return (
      <View style={styles.container}>
        <Text style={styles.kycText}>Your KYC status is pending.</Text>
        <TouchableOpacity style={styles.button} onPress={handleCompleteKYC}>
          <Text style={styles.buttonText}>Complete KYC</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  kycText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.TEXT,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.BUTTON_TEXT,
    fontWeight: 'bold',
  },
});

export default KYCComponent;
