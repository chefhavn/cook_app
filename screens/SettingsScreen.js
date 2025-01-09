import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Linking,
} from 'react-native';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

// Imported Screens
import EditProfileScreen from './EditProfileScreen/EditProfileScreen';
import AboutScreen from './AboutScreen/AboutScreen';
import MyEarningsScreen from './MyEarningsScreen/MyEarningsScreen';
import LocationSettingsScreen from './LocationSettingsScreen/LocationSettingsScreen';
import HelpScreen from './HelpScreen/HelpScreen';
import TermsScreen from './TermsAndConditions/TermsScreen';
import PrivacyPolicyScreen from './PrivacyPolicy/PrivacyPolicyScreen';
import { deleteUserAccount } from '../services/api';

const SettingsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  const screens = [
    { name: 'Edit Profile', screen: 'EditProfileScreen', icon: require('../assets/images/edit_profile_icon.png') },
    { name: 'About', screen: 'AboutScreen', icon: require('../assets/images/about_icon.png') },
    { name: 'My Earnings', screen: 'MyEarningsScreen', icon: require('../assets/images/rupee_icon.png') },
    { name: 'Location Settings', screen: 'LocationSettingsScreen', icon: require('../assets/images/setting_icon.png'), disabled: true },
    { name: 'Help', screen: 'HelpScreen', icon: require('../assets/images/help_icon.png') },
    { name: 'Terms & Conditions', screen: 'TermsScreen', icon: require('../assets/images/t&c_icon.png') },
    { name: 'Privacy Policy', screen: '', icon: require('../assets/images/privacy&policy_icon.png') },
  ];

  const rightArrowIcon = require('../assets/images/right_angle_icon.png');
  const logoutIcon = require('../assets/images/logout_icon.png');
  const firstLetter = userData?.name?.charAt(0).toUpperCase() || 'J';

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('user');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    setModalVisible(false);
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        await AsyncStorage.removeItem('user');

        Alert.alert('Logged out', 'You have been logged out.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      } else {
        // Alert.alert('No User Found', 'You are not logged in.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };


  const handleAccountDeletion = async () => {
    setDeleteAccountModalVisible(false);
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        Alert.alert('No User Found', 'No user data found.');
        return;
      }

      const userId = JSON.parse(user).id;

      // Call the deleteUserAccount API function to delete the user account
      const response = await deleteUserAccount(userId);

      // If API call is successful
      await AsyncStorage.removeItem('user');
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');

      // Navigate the user back to the Login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'An error occurred while deleting your account.');
    }
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://chefhavn.com/privacy-policy'); // Open the privacy policy URL in a browser
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Header Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            {/* Custom Avatar */}
            <View style={[styles.avatar, { backgroundColor: 'white' }]}>
            {userData?.avatar ? (
          <Image
            source={{ uri: userData.avatar }} // Display the image if avatar is available
            style={styles.avatarImage}
          />
        ) : (
          <Text style={[styles.avatarText, { color: Colors.PRIMARY }]}>
            {firstLetter} {/* Display the first letter if no avatar */}
          </Text>
        )}
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>
                {userData ? userData.name : 'John Doe'}
              </Text>
              <Text style={styles.profileRating}>⭐ {userData?.rating || '4.8'}</Text>
            </View>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsTitle}>Earned Today</Text>
            <Text style={styles.earningsValue}>₹{userData?.earnings || '259.90'}</Text>
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
            style={[styles.itemContainer, item.disabled && styles.disabledItem]}
            onPress={() => item.screen ? navigation.navigate(item.screen) : handlePrivacyPolicyPress()}
            disabled={item.disabled}
          >
            <Image source={item.icon} style={styles.iconStyle} />
            <Text style={styles.itemText}>{item.name}</Text>
            <Image source={rightArrowIcon} style={styles.arrowStyle} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => setDeleteAccountModalVisible(true)} style={styles.itemContainer}>
          <Image source={logoutIcon} style={styles.iconStyle} />
          <Text style={styles.itemText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.itemContainer}>
          <Image source={logoutIcon} style={styles.iconStyle} />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.PRIMARY }]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.modalButton, { backgroundColor: Colors.PRIMARY }]}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal visible={deleteAccountModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete your account? This action is irreversible.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setDeleteAccountModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.PRIMARY }]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAccountDeletion}
                style={[styles.modalButton, { backgroundColor: Colors.PRIMARY }]}>
                <Text style={styles.logoutButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
  avatar: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
    borderRadius: 30, // To make it round
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15, // Space between avatar and profile text
  },
  avatarText: {
    fontSize: 24, // Size of the letter
    fontWeight: 'bold',
  },
  profileText: {
    justifyContent: 'center',
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
    color: '#000',
    marginBottom: 10,
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  arrowStyle: {
    width: 16,
    height: 16,
    tintColor: 'gray',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "black"
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.PRIMARY
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default SettingsScreen;
