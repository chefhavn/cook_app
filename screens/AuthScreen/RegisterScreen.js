import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import CustomInput from '../../component/CustomInput/CustomInput'; 
import CustomButton from '../../component/CustomButton/CustomButton';
import { register } from '../../services/api'; // Import register API method

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await register({ name, email, password, phone, role: 'Vendor' });
      console.log('Registration successful:', response);

      Alert.alert('Success', 'Registration successful');
      setIsLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <Text style={styles.subHeader}>Register to get started</Text>
      <CustomInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
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
      <CustomButton title="Register" onPress={handleRegister} isLoading={isLoading} />
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          Login Here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      },
      header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
      },
      subHeader: {
        fontSize: 16,
        color: '#777777',
        marginBottom: 40,
        textAlign: 'center',
      },
      input: {
        marginBottom: 20,
      },
      button: {
        backgroundColor: '#2ecc71',
      },
      loginText: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
      },
      loginLink: {
        color: '#2ecc71',
        fontWeight: 'bold',
      },
});

export default RegisterScreen;
