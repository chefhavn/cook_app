import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editVendorProfile } from '../../services/api';

const Colors = {
  Primary: '#503A73',
  Background: '#f5f5f5',
  Text: '#333',
  Button: '#503A73',
  ButtonText: '#fff',
};

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Vendor',
  });
  const [loading, setLoading] = useState(false);

  // Load profile data from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('user');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    };
    loadProfile();
  }, []);

  // Handle input change
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userId = profile.id;
      const updatedProfileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      };

      // Call the API to update the vendor profile
      const response = await editVendorProfile(userId, updatedProfileData);

      if (response.success) {
        // Update AsyncStorage with the new profile data
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong while updating profile');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={profile.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={profile.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={profile.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={profile.role}
        editable={false}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.ButtonText} />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.Primary,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.Text,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: Colors.Button,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: Colors.ButtonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
