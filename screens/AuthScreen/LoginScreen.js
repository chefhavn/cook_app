import React, { useState } from 'react';
import { View, Text, Alert, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomInput from '../../component/CustomInput/CustomInput';
import CustomButton from '../../component/CustomButton/CustomButton';
import { login, checkUserExistence } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../utils/Colors';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleLogin = async () => {
    
    // Check if the phone input field is empty
    if (!phone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty'); // Show an error message
      return; // Stop further execution
    }

    if(phone.trim().length != 10){
      Alert.alert('Number', 'Please Enter Correct Number');
      return;
    }
    

    if(!isChecked){
      Alert.alert('Error', "You've not agree the terms and condition"); // Show an error message
      return;
    }

    try {
      const response = await checkUserExistence(phone);
      console.log("Phone Number", response) 
      if(response.exist === 'No'){
        Alert.alert('Error', 'No User Found, Please Register to Continue');
        return
      }
    } catch (error) {
      throw new Error('Failed to store user data.');
    }

    try {
      const response = await login(phone);
      console.log("Phone Number", phone)
      // Check if login is successful (modify based on API response structure)
      if (response.success) {
        console.log('Login successful:', response.user);

        // Store login details (e.g., token, user info) in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.user));

        // Check if user data is successfully stored
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          console.log('User data stored successfully:', storedUser);

          // Alert.alert('Success', 'Login successful');
          setIsLoading(false);

          // Navigate to Home Screen
          navigation.navigate('HomeTabs');
        } else {
          throw new Error('Failed to store user data.');
        }
      } else {
        //   Alert.alert('Error', response.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Alert.alert('Error', error.message || 'Login failed');
      setIsLoading(false);
    }

    navigation.navigate('OTP', { email: '', phoneNumber: phone, loginWith2Email: false });

  };

  // Function to handle checkbox toggle
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={styles.container}>

      {/* Add Image here */}
      <Image
        source={require('../../assets/images/dummygallery.png')} // Replace with your correct image path
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.contentContainer}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subHeader}>Login to continue</Text>
        <CustomInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={handleCheckboxPress}
            style={styles.checkbox}
          >
            {isChecked && (
              <Image
                source={require('../../assets/images/checkbox.png')}  // Ensure the image path is correct
                style={styles.checkmarkImage}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I've read and agree with the{' '}
            <Text style={styles.linkText}>Terms and Conditions</Text> and the{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>
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


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%', // Adjust width as needed
    height: 350, // Adjust height as needed
    alignSelf: 'center',
    marginBottom: 40,
    objectFit: 'cover',

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,

  },
  subHeader: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align vertically as well
    marginTop: 8,
    marginBottom: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkImage: {
    width: '100%',  // Adjust size to fit the box
    height: '100%', // Adjust size to fit the box
  },
  termsText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    flexShrink: 1,
  },
  linkText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Underline the link text
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  registerLink: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
