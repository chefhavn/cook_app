import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Image,
} from 'react-native';
import CustomInput from '../../component/CustomInput/CustomInput';
import CustomButton from '../../component/CustomButton/CustomButton';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this package

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const translationY = new Animated.Value(0);

  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [termsError, setTermsError] = useState('');

  // Keyboard listeners for animation
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(translationY, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(translationY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Function to handle checkbox toggle
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    if (!isChecked) setTermsError('');
  };

  const validateName = name => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = phone => {
    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must be 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateTerms = () => {
    if (!isChecked) {
      setTermsError('You must accept the Terms and Privacy Policy');
      return false;
    }
    setTermsError('');
    return true;
  };

  const handleRegister = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isTermsValid = validateTerms();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isTermsValid) {
      return;
    }

    setIsLoading(true);
    try {
      navigation.navigate('OTP', {
        name,
        email,
        phoneNumber: phone,
        isRegister: true,
        loginWithEmail: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Navigation to OTP failed:', error);
      Alert.alert('Error', 'Failed to navigate to OTP screen.');
      setIsLoading(false);
    }
  };

  const handleNameChange = text => {
    setName(text);
    validateName(text);
  };

  const handleEmailChange = text => {
    setEmail(text);
    validateEmail(text);
  };

  const handlePhoneChange = text => {
    // Only allow digits
    const formattedText = text.replace(/[^0-9]/g, '');
    setPhone(formattedText);
    validatePhone(formattedText);
  };

  const openURL = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
        Alert.alert('Error', 'Cannot open the URL');
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Animated.View
          style={[styles.container, {transform: [{translateY: translationY}]}]}>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subHeader}>Register to get started</Text>

            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Name"
                value={name}
                onChangeText={handleNameChange}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.phoneContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <View style={styles.phoneInputWrapper}>
                  <CustomInput
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    maxLength={10}
                  />
                </View>
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={handleCheckboxPress}
                style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
                {isChecked && (
                  <Image
                    source={require('../../assets/images/check_white.png')}
                    style={styles.checkmarkImage}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I've read and agree with the{' '}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    openURL('https://chefhavn.com/terms-condition')
                  }>
                  Terms and Conditions
                </Text>{' '}
                and the{' '}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    openURL('https://chefhavn.com/privacy-policy')
                  }>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
            {termsError ? (
              <Text style={styles.errorText}>{termsError}</Text>
            ) : null}

            <CustomButton
              title="Register"
              onPress={handleRegister}
              isLoading={isLoading}
            />

            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}>
                Login Here
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 30,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  countryCode: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRightWidth: 0,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333333',
  },
  phoneInputWrapper: {
    flex: 1,
    // height: 50,
  },
  phoneInput: {
    height: '100%',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  checkedCheckbox: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  termsText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    flexShrink: 1,
    flex: 1,
  },
  linkText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
    marginLeft: 5,
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
  },
  loginLink: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  checkmarkImage: {
    width: '100%',
    height: '100%',
  },
});

export default RegisterScreen;
