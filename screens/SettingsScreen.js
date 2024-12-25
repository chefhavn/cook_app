import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { Card, Paragraph } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect




// Imported Screens
import EditProfileScreen from './EditProfileScreen/EditProfileScreen';
import AboutScreen from './AboutScreen/AboutScreen';
import MyEarningsScreen from './MyEarningsScreen/MyEarningsScreen';
import LocationSettingsScreen from './LocationSettingsScreen/LocationSettingsScreen';
import HelpScreen from './HelpScreen/HelpScreen';
import TermsScreen from './TermsAndConditions/TermsScreen';
import PrivacyPolicyScreen from './PrivacyPolicy/PrivacyPolicyScreen';

const SettingsScreen = ({ navigation }) => {

  const [userData, setUserData] = useState(null);

  // List of screens with corresponding names and targets
  const screens = [
    { name: 'Edit Profile', screen: 'EditProfileScreen', icon: require('../assets/images/edit_profile_icon.png') },
    { name: 'About', screen: 'About', icon: require('../assets/images/about_icon.png') },
    { name: 'My Earnings', screen: 'MyEarnings', icon: require('../assets/images/rupee_icon.png') },
    { name: 'Location Settings', screen: 'LocationSettings', icon: require('../assets/images/setting_icon.png') },
    { name: 'Help', screen: 'Help', icon: require('../assets/images/help_icon.png') },
    { name: 'Terms & Conditions', screen: 'Terms', icon: require('../assets/images/t&c_icon.png') },
    { name: 'Privacy Policy', screen: 'PrivacyPolicy', icon: require('../assets/images/privacy&policy_icon.png') },
  ];

  const rightArrowIcon = require('../assets/images/right_angle_icon.png'); // Right-angle arrow image
  const logoutIcon = require('../assets/images/logout_icon.png'); // Logout icon

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('user');
          console.log(storedUserData);
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      fetchUserData();
}))
    

  // Handle user logout
  const handleLogout = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      console.log(user)
      if (user) {
         await AsyncStorage.clear();
        Alert.alert('Logged out', 'You have been logged out.');

        // Reset navigation stack to Login
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        //   })
        // );
        console.log("User",user)
        navigation.navigate('Login');

      } else {
        Alert.alert('No User Found', 'You are not logged in.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Header Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <Avatar
              rounded
              size="large"
              source={{
                uri:
                  userData?.profilePicUrl || 'https://example.com/profile-pic.jpg',
              }}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>
                {userData ? userData.name : 'John Doe'}
              </Text>
              <Text style={styles.profileRating}>⭐ {userData?.rating || '4.8'}</Text>
            </View>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsTitle}>Earned Today</Text>
            <Text style={styles.earningsValue}>${userData?.earnings || '259.90'}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData?.totalTrips || 15}</Text>
                <Text style={styles.statLabel}>Total Trips</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData?.timeOnline || '15h 30m'}</Text>
                <Text style={styles.statLabel}>Time Online</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData?.totalDistance || '45 km'}</Text>
                <Text style={styles.statLabel}>Total Distance</Text>
              </View>
            </View>
          </View>
        </View>
        {screens.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => navigation.navigate(item.screen)}
        >
          {/* Left Icon */}
          <Image source={item.icon} style={styles.iconStyle} />

          {/* Text */}
          <Text style={styles.itemText}>{item.name}</Text>

          {/* Right Arrow */}
          <Image source={rightArrowIcon} style={styles.arrowStyle} />
        </TouchableOpacity>
      ))}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.itemContainer}
        >
          <Image source={logoutIcon} style={styles.iconStyle}/>
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.Primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  profileContainer: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileRating: {
    color: '#fff',
    fontSize: 16,
  },
  earningsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  earningsTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center',
    justifyContent: 'space-between', // Space between left and right icons/text
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // For shadow effect on Android
    backgroundColor: '#fff',
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 10, // Space between icon and text
  },
  itemText: {
    flex: 1, // Take up remaining space
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
  },
  arrowStyle: {
    width: 16,
    height: 16,
    tintColor: 'gray', // Optional: Tint color for the arrow
  },
});

export default SettingsScreen;
