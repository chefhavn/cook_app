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
import { checkKYCStatus, submitKYC, sentKycSubmitMail } from '../../services/api';
import Colors from '../../utils/Colors';
// import Colors from '../../constants/Colors'; // Assuming you have a Colors constant

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
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allows all file types
      });
      setSelectedFile(result[0]); // Store the selected file in state
      console.log("Selected file:", result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("File selection canceled");
      } else {
        console.error("File selection error:", err);
      }
    }
  };

  useEffect(() => {
    const checkKYCStatusAsync = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        console.log(user)
        const chefId = JSON.parse(user).id;
        const response = await checkKYCStatus(chefId);
        console.log("KYC STATUS", response)
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
      const parsedUser = JSON.parse(user);
      const { id: chefId, name, email } = parsedUser;
  
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
      console.log("KYC Response", response);
  
      // Call the API to send acknowledgment email
      try {
        const mailResponse = await sentKycSubmitMail(email, name);
        console.log("Mail Response", mailResponse);
        if (mailResponse.success) {
          Alert.alert('Acknowledgment email sent successfully!');
        } else {
          console.error('Failed to send acknowledgment email:', mailResponse.error);
        }
      } catch (mailError) {
        console.error('Error sending acknowledgment email:', mailError);
      }
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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          {!isKYCVerified && (
            <Card.Title
              title="KYC Verification"
              subtitle="Please fill your details"
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardSubtitle}
            />
          )}
          <Card.Content>
            {isKYCVerified === null ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : isKYCVerified ? (
              <Text style={styles.verificationMessage}>{kycMessage}</Text>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  value={fullName}
                  onChangeText={setFullName}
                />
                {/* Dropdown for ID Type */}
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.input}>
                  <Text style={styles.inputText}>{govtIdType}</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder={`${govtIdType} Number`}
                  placeholderTextColor="#888"
                  value={govtIdNumber}
                  onChangeText={setGovtIdNumber}
                />

                <View style={styles.imageContainer}>
                  <Text style={styles.labelText}>{`Upload Front of ${govtIdType}`}</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.actionButton]}
                      onPress={() => handleImageSelection('front', 'camera')}
                    >
                      <Image
                        source={require('../../assets/images/camera_icon.png')}
                        style={styles.actionButtonImage}
                        />
                        <Text style={styles.actionButtonText}>Capture Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton]}
                      onPress={() => handleImageSelection('front', 'gallery')}
                    >
                      <Image
                        source={require('../../assets/images/gallery_icon.png')}
                        style={styles.actionButtonImage}
                        />
                        <Text style={styles.actionButtonText}>Select from Gallery</Text>
                    </TouchableOpacity>
                  </View>
                  {frontUri && (
                    <Image source={{ uri: frontUri }} style={styles.image} />
                  )}
                </View>

                {/* Only show back image option for Aadhar */}
                {govtIdType === 'Aadhar Card' && (
                  <View style={styles.imageContainer}>
                    <Text style={styles.labelText}>{`Upload Back of ${govtIdType}`}</Text>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.actionButton]}
                        onPress={() => handleImageSelection('back', 'camera')}
                      >
                        <Image
                        source={require('../../assets/images/camera_icon.png')}
                        style={styles.actionButtonImage}
                        />
                        <Text style={styles.actionButtonText}>Capture Image</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton]}
                        onPress={() => handleImageSelection('back', 'gallery')}
                      >
                        <Image
                        source={require('../../assets/images/gallery_icon.png')}
                        style={styles.actionButtonImage}
                        />
                        <Text style={styles.actionButtonText}>Select from Gallery</Text>
                      </TouchableOpacity>
                    </View>
                    {backUri && (
                      <Image source={{ uri: backUri }} style={styles.image} />
                    )}
                  </View>
                )}

                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Do you have prior experience?</Text>
                  <Switch
                    value={hasExperience}
                    onValueChange={setHasExperience}
                    trackColor={{ false: "#767577", true: Colors.PRIMARY }}
                    thumbColor={hasExperience ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
                {hasExperience && (
                  <>
                  <TextInput
                    style={styles.input}
                    placeholder="Describe your experience"
                    placeholderTextColor="#888"
                    value={experienceDetails}
                    onChangeText={setExperienceDetails}
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity style={styles.filePickerButton} onPress={handleFilePick}>
                  <Text style={styles.filePickerButtonText}>
                    {selectedFile ? "File Selected: " + selectedFile.name : "Upload File"}
                  </Text>
                </TouchableOpacity>
                </>
                )}
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: Colors.PRIMARY }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit KYC</Text>
                </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Select ID Type</Text>
            {['Aadhar Card', 'Voter Card', 'Driving License'].map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setGovtIdType(item);
                  setModalVisible(false);
                }}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: Colors.PRIMARY }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#ffffff',
    elevation: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 15
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  inputText: {
    color: '#333',
    fontSize: 16
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%'
  },
  actionButton: {
    flex: 0.48,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  actionButtonImage: {
    width: 30,
    height: 30,

  },
  actionButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 5
  },
  switchLabel: {
    fontSize: 16,
    color: '#333'
  },
  filePickerButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  filePickerButtonText: {
    color: "#000",
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center'
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666'
  },
  verificationMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    padding: 15
  }
});