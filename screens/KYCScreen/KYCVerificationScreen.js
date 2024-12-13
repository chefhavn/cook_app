import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Button,
  Switch,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkKYCStatus, submitKYC } from '../../services/api';

export default function KYCVerificationScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [govtIdType, setGovtIdType] = useState('Aadhar Card');
  const [frontUri, setFrontUri] = useState(null);
  const [backUri, setBackUri] = useState(null);
  const [hasExperience, setHasExperience] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState('');
  const [isKYCVerified, setIsKYCVerified] = useState(null);
  const [kycMessage, setKYCMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkKYCStatusAsync = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const chefId = JSON.parse(user).id;
        const response = await checkKYCStatus(chefId);
        console.log("KYC STATUS",response)
        if (response.success) {
          setIsKYCVerified(true);
          setKYCMessage('Your profile is under verification.');
        } else {
          setIsKYCVerified(false);
        }
      } catch (error) {
        console.error('Error checking KYC status:', error);
        setIsKYCVerified(false);
      }
    };
    checkKYCStatusAsync();
  }, []);

  // Handle image selection
  const handleImageSelection = (side, method) => {
    const options = { mediaType: 'photo', quality: 1 };
    const imagePicker = method === 'camera' ? launchCamera : launchImageLibrary;

    imagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        side === 'front' ? setFrontUri(uri) : setBackUri(uri);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (!frontUri && govtIdType === 'Aadhar Card') {
        Alert.alert('Front ID picture is required');
        return;
      }

      const formData = new FormData();
      const user = await AsyncStorage.getItem('user');
      const chefId = JSON.parse(user).id;

      formData.append('user_id', chefId);
      formData.append('govt_id_name', govtIdType);
      formData.append('govt_id_number', govtIdNumber);

      formData.append('govt_id_front_pic', {
        uri: frontUri,
        type: 'image/jpeg',
        name: `${govtIdType}_front.jpg`,
      });

      if (govtIdType === 'Aadhar Card') {
        formData.append('govt_id_back_pic', {
          uri: backUri,
          type: 'image/jpeg',
          name: `${govtIdType}_back.jpg`,
        });
      }

      if (hasExperience) {
        formData.append('experience_details', experienceDetails);
      }

      const response = await submitKYC(formData);
      console.log("KYC Response",response)
      if (response.status === 201) {
        Alert.alert('KYC Data Submitted Successfully!');
        setFrontUri(null);
        setBackUri(null);
        setIsKYCVerified(true);
        setKYCMessage('Your profile is under verification.');
      } else {
        Alert.alert('KYC Data Submission Failed!');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      Alert.alert('KYC Data Submission Failed!');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          {!isKYCVerified && (
            <Card.Title
              title="KYC Verification"
              subtitle="Please fill your details"
            />
          )}
          <Card.Content>
            {isKYCVerified === null ? (
              <Text>Loading...</Text>
            ) : isKYCVerified ? (
              <Text>{kycMessage}</Text>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                />
                {/* Dropdown for ID Type */}
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.input}>
                  <Text>{govtIdType}</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder={`${govtIdType} Number`}
                  value={govtIdNumber}
                  onChangeText={setGovtIdNumber}
                />

                <View style={styles.imageContainer}>
                  <Text>{`Upload Front of ${govtIdType}`}</Text>
                  <View style={styles.buttonRow}>
                    <Button
                      title="Capture Image"
                      onPress={() => handleImageSelection('front', 'camera')}
                    />
                    <Button
                      title="Select from Gallery"
                      onPress={() => handleImageSelection('front', 'gallery')}
                    />
                  </View>
                  {frontUri && (
                    <Image source={{ uri: frontUri }} style={styles.image} />
                  )}
                </View>

                {/* Only show back image option for Aadhar */}
                {govtIdType === 'Aadhar Card' && (
                  <View style={styles.imageContainer}>
                    <Text>{`Upload Back of ${govtIdType}`}</Text>
                    <View style={styles.buttonRow}>
                      <Button
                        title="Capture Image"
                        onPress={() => handleImageSelection('back', 'camera')}
                      />
                      <Button
                        title="Select from Gallery"
                        onPress={() => handleImageSelection('back', 'gallery')}
                      />
                    </View>
                    {backUri && (
                      <Image source={{ uri: backUri }} style={styles.image} />
                    )}
                  </View>
                )}

                <View style={styles.switchContainer}>
                  <Text>Do you have prior experience?</Text>
                  <Switch value={hasExperience} onValueChange={setHasExperience} />
                </View>
                {hasExperience && (
                  <TextInput
                    style={styles.input}
                    placeholder="Describe your experience"
                    value={experienceDetails}
                    onChangeText={setExperienceDetails}
                  />
                )}
                <Button title="Submit KYC" onPress={handleSubmit} />
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Select ID Type</Text>
            {['Aadhar Card', 'Voter Card', 'Driving License'].map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setGovtIdType(item);
                  setModalVisible(false);
                }}
                style={styles.modalOption}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { elevation: 3, borderRadius: 8, padding: 10 },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  imageContainer: { marginVertical: 20, alignItems: 'center' },
  image: { width: 150, height: 150, marginTop: 10, borderRadius: 5 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalOption: { padding: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
