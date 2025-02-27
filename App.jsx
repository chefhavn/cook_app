import React, { useState, useEffect, useContext } from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/WelcomeScreens/SplashScreen';
import LoginScreen from './screens/AuthScreen/LoginScreen';
import RegisterScreen from './screens/AuthScreen/RegisterScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SettingsScreen from './screens/SettingsScreen';
import KYCVerificationScreen from './screens/KYCScreen/KYCVerificationScreen';
import Colors from './utils/Colors';
import OrderDetails from './screens/OrderDetails/OrderDetails';
import OTPScreen from './screens/AuthScreen/OTPScreen';
import EditProfileScreen from './screens/EditProfileScreen/EditProfileScreen';
import AboutScreen from './screens/AboutScreen/AboutScreen';
import MyEarningsScreen from './screens/MyEarningsScreen/MyEarningsScreen';
import LocationSettingsScreen from './screens/LocationSettingsScreen/LocationSettingsScreen';
import HelpScreen from './screens/HelpScreen/HelpScreen';
import TermsScreen from './screens/TermsAndConditions/TermsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicy/PrivacyPolicyScreen';
import AppWrapper from './AppWrapper';
import PendingAmount from './screens/PendingAmount/PendingAmount';
import WithdrawNowScreen from './screens/MyEarningsScreen/WithdrawNowScreen';
import EarningsDetailsScreen from './screens/MyEarningsScreen/EarningsDetailsScreen';
import WithdrawalsDetailsScreen from './screens/MyEarningsScreen/WithdrawalsDetailsScreen';
import { UserProvider,UserContext } from './context/UserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarIcon: ({ focused }) => {
        let imageSource;

        // Assign images based on route name
        if (route.name === 'Home') {
          imageSource = focused
            ? require('./assets/images/home_icon.png')
            : require('./assets/images/home_icon_inactive.png');
        } else if (route.name === 'MyOrders') {
          imageSource = focused
            ? require('./assets/images/food_icon.png')
            : require('./assets/images/food_icon_inactive.png');
        } else if (route.name === 'Settings') {
          imageSource = focused
            ? require('./assets/images/setting_icon.png')
            : require('./assets/images/setting_icon_inactive.png');
        }

        return <Image source={imageSource} style={styles.icon} resizeMode="contain" />;
      },
      tabBarLabel: ({ focused }) => {
        let labelText;

        if (route.name === 'Home') {
          labelText = 'Home';
        } else if (route.name === 'MyOrders') {
          labelText = 'My Orders';
        } else if (route.name === 'Settings') {
          labelText = 'Settings';
        }

        return (
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: focused ? Colors.PRIMARY : '#808080',
            }}
          >
            {labelText}
          </Text>
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="MyOrders" component={MyOrdersScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeTabs"
      component={BottomTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="KYCVerification"
      component={KYCVerificationScreen}
      options={{ title: '' }}
    />
    <Stack.Screen name="PendingAmount" component={PendingAmount} />
    <Stack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={{ title: 'Order Details' }}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
    <Stack.Screen
      name="AboutScreen"
      component={AboutScreen}
      options={{ title: 'About' }}
    />
    <Stack.Screen
      name="MyEarningsScreen"
      component={MyEarningsScreen}
      options={{ title: 'Earnings' }}
    />
    <Stack.Screen
      name="LocationSettingsScreen"
      component={LocationSettingsScreen}
      options={{ title: 'Location' }}
    />
    <Stack.Screen
      name="HelpScreen"
      component={HelpScreen}
      options={{ title: 'Help' }}
    />
    <Stack.Screen
      name="TermsScreen"
      component={TermsScreen}
      options={{ title: 'Terms & Conditions' }}
    />
    <Stack.Screen
      name="PrivacyPolicyScreen"
      component={PrivacyPolicyScreen}
      options={{ title: 'Privacy Policy' }}
    />
    <Stack.Screen
      name="WithdrawNow"
      component={WithdrawNowScreen}
      options={{ title: 'Withdraw Now' }}
    />
    <Stack.Screen
      name="EarningsDetails"
      component={EarningsDetailsScreen}
      options={{ title: 'Earnings Details' }}
    />
    <Stack.Screen
      name="WithdrawalsDetails"
      component={WithdrawalsDetailsScreen}
      options={{ title: 'Withdrawal Details' }}
    />
  </Stack.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLoggedIn] = useState(false);
  const { isLoggedIn } = useContext(UserContext);

  // Fetch user data and check login status
  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user');
      console.log('Stored User Data:', storedUserData);
      setIsLoggedIn(storedUserData !== null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Manage initial app load and state
  useEffect(() => {
    const initializeApp = async () => {
      await fetchUserData();
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
      <NavigationContainer>
        {isLoggedIn ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
  );
};

// Wrap the entire app with UserProvider
const RootApp = () => (
  <UserProvider>
    <App />
  </UserProvider>
);


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default RootApp;
