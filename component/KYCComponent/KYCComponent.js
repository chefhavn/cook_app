import React, {useState, useEffect} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KYCComponent = ({navigation}) => {
  const [kycStatus, setKycStatus] = useState("");

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          console.log(parsedUser)
          setKycStatus(parsedUser?.kyc_status);
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      }
    };

    fetchKYCStatus();
  }, []);

  const handleCompleteKYC = () => {
    // Navigate to the KYC completion screen or handle KYC process
    Alert.alert('KYC', 'Navigating to Complete KYC Screen...');
    navigation.navigate('KYCVerification');
  };

  if (kycStatus === 'Pending') {
    return (
      <View style={styles.container}>
        <Text style={styles.kycText}>Your KYC status is pending.</Text>
        <Button title="Complete KYC" onPress={handleCompleteKYC} />
      </View>
    );
  }

  // If KYC is not pending, do not render anything (or return null if not rendering anything)
  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  kycText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default KYCComponent;
