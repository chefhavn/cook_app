import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editVendorProfile } from '../../services/api'; // Assuming this is your API for profile update
import { launchImageLibrary } from 'react-native-image-picker';

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
    avatar: '', // avatar field for storing the avatar URI
  });
  const [loading, setLoading] = useState(false);

  // Load profile data and avatar from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('user');
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);

          // Load the avatar image URI from AsyncStorage
          const storedAvatar = await AsyncStorage.getItem('avatar');
          if (storedAvatar) {
            setProfile(prevProfile => ({ ...prevProfile, avatar: storedAvatar }));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  // Handle input changes (name, email, phone)
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  // Handle profile update (only text fields are updated, avatar is not sent)
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userId = profile.id;
      const updatedProfileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role, // Assuming role is part of the profile data
      };

      // Call the API to update the vendor profile (without avatar)
      const response = await editVendorProfile(userId, updatedProfileData);

      if (response.success) {
        // Update AsyncStorage with the new profile data (but keep the avatar unchanged)
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

  // Handle image selection for avatar
  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true, // You can use base64 or URI as per your requirement
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image');
        } else {
          const avatarUri = response.assets[0].uri;
          setProfile({ ...profile, avatar: avatarUri });

          // Save the avatar URI to AsyncStorage
          AsyncStorage.setItem('avatar', avatarUri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profile.avatar || 'https://via.placeholder.com/150' }} // Default avatar if no avatar selected
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleSelectImage}>
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
      </View>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.Button,
    borderRadius: 20,
    padding: 5,
  },
  editText: {
    color: Colors.ButtonText,
    fontSize: 20,
    fontWeight: 'bold',
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
