import React, { useState, useRef, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../../utils/Colors';
import { sendOtp, login, register , sendLoginEmail, sendRegisterEmail } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPSkeleton from '../Skeletons/OTPSkeleton';

const OTPScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [resendTimer, setResendTimer] = useState(30); // Set initial timer to 30 seconds
  const [resendDisabled, setResendDisabled] = useState(true); // Initially disabled
  const inputRefs = useRef([]);
  const [selectedInput, setSelectedInput] = useState(null);
  const { email, phoneNumber, loginWithEmail } = route.params;
  const [sentOtp, setSentOtp] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);


  // Fetch OTP on mount
  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const response = await sendOtp(email, phoneNumber, loginWithEmail);
        console.log("Response",response)
        // setSentOtp(response.otp);
        setSentOtp(1234);

        setTimeout(() => {
          setLoading(false);
        }, 1500)

      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to send OTP. Please try again.',
        });
        setTimeout(() => {
          setLoading(false);
        }, 1500)
      }
    };
    fetchOtp();
  }, [email, phoneNumber, loginWithEmail]);

  // Resend timer countdown
  useEffect(() => {
    if (resendDisabled && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear interval on unmount
    }
    if (resendTimer === 0) {
      setResendDisabled(false); // Enable resend button when timer hits 0
    }
  }, [resendDisabled, resendTimer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP verification
  const getDeviceName = () => {
    return Platform.OS === 'ios' ? 'iOS Device' : 'Android Device';
  };
  
  const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown IP';
    }
  };
  
  const handleOtpVerification = async () => {
    const enteredOtp = otp.join('');
    setLoading(true);
  
    try {
      if (route.params.isRegister) {
        // Handle Registration
        const { name, email, password, phone } = route.params;
        const response = await register({ name, email, password, phone, role: 'Vendor' });
  
        if (response.success) {
          console.log('Registration successful:', response.user);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
  
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            console.log('User data stored successfully:', storedUser);
  
            // Get device name and IP address
            const deviceName = getDeviceName();
            const ipAddress = await getIpAddress();
  
            if (email) {
              try {
                await sendRegisterEmail(email, name, ipAddress, deviceName);
                console.log('Login notification email sent for registration');
              } catch (emailError) {
                console.error('Error sending login notification email:', emailError);
              }
            }
  
            setLoading(false);
            navigation.navigate('HomeTabs');
          } else {
            throw new Error('Failed to store user data.');
          }
        } else {
          Alert.alert('Error', response.message || 'Registration failed');
          setLoading(false);
        }
      } else {
        // Handle Login
        const { phoneNumber } = route.params;
        const response = await login(phoneNumber);
  
        if (response.success) {
          console.log('Login successful:', response.user);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
  
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            console.log('User data stored successfully:', storedUser);
  
            // Get device name and IP address
            const deviceName = getDeviceName();
            const ipAddress = await getIpAddress();
  
            if (response.user.email) {
              try {
                await sendLoginEmail(response.user.email, ipAddress, deviceName);
                console.log('Login notification email sent for login');
              } catch (emailError) {
                console.error('Error sending login notification email:', emailError);
              }
            }
  
            setLoading(false);
            navigation.navigate('HomeTabs');
          } else {
            throw new Error('Failed to store user data.');
          }
        } else {
          Alert.alert('Error', response.message || 'Login failed');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Operation failed');
      setLoading(false);
    }
  };
  

  // Handle resend OTP
  const handleResendCode = async () => {
    try {
      const response = await sendOtp(email, phoneNumber, loginWithEmail);
      setSentOtp(response.otp);
      Toast.show({
        type: 'success',
        text1: 'Code Sent',
        text2: `A new code has been sent to your ${loginWithEmail ? 'Email' : 'Phone Number'
          }`,
      });

      // Reset the timer and disable the resend button for 30 seconds
      setResendDisabled(true);
      setResendTimer(30);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to resend OTP. Please try again.',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>OTP Screen</Text>
        </View>
        {loading ? (
          <OTPSkeleton />
        ) : (
          <View style={styles.mainContainer}>
            {/* <Text style={styles.title}>Enter Confirmation Code</Text>
            <Text style={styles.subTitle}>
              A 4-digit code was sent to your{' '}
              {loginWithEmail ? 'Email' : 'Phone Number'}{'\n'}
              {loginWithEmail ? email : phoneNumber}
            </Text> */}
            
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    selectedInput === index && styles.selectedOtpInput,
                  ]}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={ref => (inputRefs.current[index] = ref)}
                  onFocus={() => setSelectedInput(index)}
                  onBlur={() => setSelectedInput(null)}
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleResendCode} disabled={resendDisabled}>
              <Text
                style={[
                  styles.resendText,
                  resendDisabled && styles.disabledResendText,
                ]}>
                {resendDisabled ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
        <Toast />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 10,
    color: Colors.BLACK,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  subTitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontFamily: 'Montserrat-Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    margin: 5,
    backgroundColor: '#fff',
    color: Colors.BLACK,
    fontFamily: 'Montserrat-SemiBold',
  },
  selectedOtpInput: {
    borderColor: '#503A73',
    borderWidth: 2,
  },
  resendText: {
    color: '#503A73',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat-Regular',
  },
  disabledResendText: {
    color: '#999',
  },
  button: {
    backgroundColor: '#503A73',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingBackdrop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
});

export default OTPScreen;
