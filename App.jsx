import React, { useState, useEffect, useCallback } from 'react';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define Bottom Tab Navigator without icons
const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarIcon: ({ focused }) => {
        let imageSource;

        // Assign images based on route name
        if (route.name === 'Home') {
          imageSource = focused
            ? require('./assets/images/home_icon.png') // Active Home Image
            : require('./assets/images/home_icon_inactive.png'); // Inactive Home Image
        } else if (route.name === 'MyOrders') {
          imageSource = focused
            ? require('./assets/images/food_icon.png') // Active Orders Image
            : require('./assets/images/food_icon_inactive.png'); // Inactive Orders Image
        } else if (route.name === 'Settings') {
          imageSource = focused
            ? require('./assets/images/setting_icon.png') // Active Settings Image
            : require('./assets/images/setting_icon_inactive.png'); // Inactive Settings Image
        }

        return (
          <Image
            source={imageSource}
            style={styles.icon}
            resizeMode="contain"
          />
        );
      },
      tabBarLabel: ({ focused }) => {
        let labelText;

        // Assign labels based on route name
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

const styles = StyleSheet.create({
  icon: {
    width: 24, // Set the icon width
    height: 24, // Set the icon height
  },
});


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user');
      console.log("afafaffafas", storedUserData)
      if (storedUserData !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  // Manage initial app load
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await fetchUserData();
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AppWrapper>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="HomeTabs"
                component={BottomTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{ title: 'Order Details' }}
              />
              <Stack.Screen
                name="KYCVerification"
                component={KYCVerificationScreen}
                options={{ title: 'Verify KYC' }}
              />

<Stack.Screen name="PendingAmount" component={PendingAmount} />

              
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
                options={{ title: 'Earning' }}
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
                options={{ title: 'Terms & Condition' }}
              />

              <Stack.Screen
                name="PrivacyPolicyScreen"
                component={PrivacyPolicyScreen}
                options={{ title: 'Privacy & Policy' }}
              />


            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />


              <Stack.Screen name="OTP" component={OTPScreen} />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HomeTabs"
                component={BottomTabs}
                options={{
                  headerShown: false
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppWrapper>
  );

};

export default App;