import React, { useState } from 'react';
import { View, Text, Alert, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
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
      Alert.alert('Error', "You've not agreed to the terms and conditions"); // Show an error message
      return;
    }

    try {
      const response = await checkUserExistence(phone);
      console.log("Phone Number", response); 
      if(response.exist === 'No'){
        Alert.alert('Error', 'No User Found, Please Register to Continue');
        return;
      }
    } catch (error) {
      throw new Error('Failed to store user data.');
    }

    navigation.navigate('OTP', { email: '', phoneNumber: phone, loginWith2Email: false });
  };

  // Function to handle checkbox toggle
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentContainer}>

          {/* Add Image here */}
          <Image
            source={require('../../assets/images/dummygallery.png')} // Replace with your correct image path
            style={styles.image}
            resizeMode="contain"
          />

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
              <TouchableOpacity onPress={() => handleLinkPress('https://chefhavn.com/terms&condition')}>
                <Text style={styles.linkText}>Terms and Conditions</Text>
              </TouchableOpacity>
              {' '}and the{' '}
              <TouchableOpacity onPress={() => handleLinkPress('https://chefhavn.com/privacy&policy')}>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>.
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    color: Colors.BLACK
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
    textDecorationLine: 'underline',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.BLACK
  },
  registerLink: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
