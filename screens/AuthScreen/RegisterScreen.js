import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomInput from '../../component/CustomInput/CustomInput';
import CustomButton from '../../component/CustomButton/CustomButton';
import { register } from '../../services/api'; // Import register API method
import Colors from '../../utils/Colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox toggle
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // Returns true if email is valid, false otherwise
  };

  // const handleRegister = async () => {
  //   if(!name){
  //     Alert.alert('Name Required', 'Please Enter Name');
  //     return;
  //   }

  //   if(!email){
  //     Alert.alert('Email Required', 'Please Enter Email');
  //     return;
  //   }

  //   if(!password){
  //     Alert.alert('Password Required', 'Please Enter Password');
  //     return;
  //   }

  //   if(!phone){
  //     Alert.alert('Number Required', 'Please Enter Number');
  //     return;
  //   }

  //   if(!validateEmail(email)){
  //     Alert.alert('Email', 'Please Enter Correct Email');
  //     return;
  //   }

  //   if(phone.trim().length != 10){
  //     Alert.alert('Number', 'Please Enter Correct Number');
  //     return;
  //   }

  //   if(!isChecked){
  //     Alert.alert('Terms & Condition', "You have not agreed terms & condition");
  //     return;
  //   }


  //   setIsLoading(true);
  //   try {
  //     const response = await register({ name, email, password, phone, role: 'Vendor' });
  //     console.log('Registration successful:', response);
  //     Alert.alert('Success', 'Registration successful');
  //     setIsLoading(false);
  //     navigation.navigate('Login');
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     Alert.alert('Error', error.message || 'Registration failed');
  //     setIsLoading(false);
  //   }
  // };

  const handleRegister = async () => {
    if (!name || !email || !password || !phone || phone.trim().length !== 10 || !isChecked) {
      Alert.alert('Validation Error', 'Please fill out all fields correctly.');
      return;
    }
  
    setIsLoading(true);
    try {
      navigation.navigate('OTP', { name, email, password, phoneNumber: phone, isRegister: true, loginWithEmail: true });
      setIsLoading(false);
    } catch (error) {
      console.error('Navigation to OTP failed:', error);
      Alert.alert('Error', 'Failed to navigate to OTP screen.');
      setIsLoading(false);
    }
  };
  
  
  const handleNameChange = (text) => {
    setName(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <Text style={styles.subHeader}>Register to get started</Text>
      <CustomInput
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
      />
      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
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
      <CustomButton title="Register" onPress={handleRegister} isLoading={isLoading} />
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Login Here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginTop: 50,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 30,
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align vertically as well
    marginTop: 10,
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
  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  loginText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
  },
  loginLink: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
