import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../utils/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    navigation.navigate('KYCVerification');
  };

  if (kycStatus === 'Pending') {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Image style={styles.icon}  source={require("../../assets/images/v_user.png")} />
          <Text style={styles.kycTitle}>Identity Verification Required</Text>
          <Text style={styles.kycText}>
            Complete your chef verification to start receiving and accepting customer orders.
          </Text>

                    
          <TouchableOpacity style={styles.button} onPress={handleCompleteKYC}>
            <Text style={styles.buttonText}>Complete Chef Verification</Text>
            {/* <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} /> */}
          <Image style={styles.icon_v}  source={require("../../assets/images/forword.png")} />
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Verification helps customers trust your services and allows you to access all booking features.
            </Text>
          </View>

        </View>
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
  cardContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  icon: {
    marginBottom: 10,
    height: 70,
    width: 70
  },
  icon_v: {
    height: 25,
    width: 25
  },
  kycTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.TEXT,
  },
  kycText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.TEXT,
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'column',
    backgroundColor: '#F5F7FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.TEXT,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default KYCComponent;