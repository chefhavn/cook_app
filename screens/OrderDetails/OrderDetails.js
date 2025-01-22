import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../utils/Colors';
import { startBooking, endBooking } from '../../services/api';

export default function OrderDetails({ route, navigation }) {
  const { order } = route.params;
  const booking = order?.booking_id;
  const [orderEndAmount, setOrderEndAmount] = useState(1599);
  const [amountDue, setAmountDue] = useState(0);
  const [isCookingStarted, setIsCookingStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [canStartCooking, setCanStartCooking] = useState(false);

  useEffect(() => {
    const checkStartCookingTime = () => {
      const now = new Date();
      const bookingTime = new Date(booking?.date);
      const timeDifference = (bookingTime - now) / (1000 * 60 * 60); // Difference in hours

      if (timeDifference <= 2) {
        setCanStartCooking(true);
      } else {
        setCanStartCooking(false);
      }
    };

    checkStartCookingTime();
    const interval = setInterval(checkStartCookingTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [booking]);

  const calculateOrderAmount = () => {
    if (orderEndAmount <= 1199) {
      setAmountDue(0);
    } else {
      const amount_due = orderEndAmount - 1199;
      setAmountDue(amount_due);
      navigation.navigate('PendingAmount', { amountDue: amount_due });
    }
  };

  const handleOtpVerification = async () => {
    if (otp === '1234') {
      Alert.alert('Success', 'OTP Verified. You can now start cooking.');
      setIsOtpVerified(true);
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  const handleStartCooking = async () => {
    try {
      if (!isOtpVerified) {
        Alert.alert('Error', 'Please verify the OTP first.');
        return;
      }

      const response = await startBooking(booking._id);
      if (response.success) {
        setIsCookingStarted(true);

        const startTime = Date.now();
        await AsyncStorage.setItem('startTime', JSON.stringify(startTime));

        Alert.alert('Success', 'Cooking started successfully.');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error starting cooking:', error);
      Alert.alert('Error', 'Failed to start cooking.');
    }
  };

  // End Cooking
  const handleEndCooking = async () => {
    try {
      // Retrieve the start time
      const storedStartTime = await AsyncStorage.getItem('startTime');
      const startTime = storedStartTime ? JSON.parse(storedStartTime) : null;

      if (!startTime) {
        Alert.alert('Error', 'Start time not found.');
        return;
      }

      calculateOrderAmount();

      console.log("AMOUNT DUE",amountDue)

      // Calculate elapsed time
      const endTime = Date.now();
      const timeToPrepare = Math.round((endTime - startTime) / 60000);
      const formattedTime = `${Math.floor(timeToPrepare / 60)}:${timeToPrepare % 60}`;

      // Call the API to end cooking
      const response = await endBooking(booking._id, formattedTime);
      console.log(response);
      setIsCookingStarted(false);
      await AsyncStorage.removeItem('startTime');
      Alert.alert('Success', 'Cooking ended successfully.');
      if (response.success) {
        console.log(response.success)
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error ending cooking:', error);
      Alert.alert('Error', 'Failed to end cooking.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={[styles.text, styles.bold]}>Booking Number: {booking?.booking_number}</Text>
        <Text style={styles.text}>Location: {booking?.location}</Text>
        <Text style={styles.text}>Date: {new Date(booking?.date).toLocaleString()}</Text>
        <Text style={styles.text}>Event Type: {booking?.event_type}</Text>
        <Text style={styles.text}>Cuisine Type: {booking?.cuisine_type}</Text>
        <Text style={styles.text}>Number of People: {booking?.no_of_people}</Text>
        <Text style={styles.text}>Number of Dishes: {booking?.no_of_dishes}</Text>
        <Text style={styles.text}>Booking Duration: {booking?.booking_duration} hours</Text>
        <Text style={styles.text}>Booking Status: {booking?.status}</Text>
        <Text style={styles.text}>Price: ₹{booking?.price || 'Free'}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {!isCookingStarted && booking.status === 'Accepted' ? (
          !canStartCooking ? (
            <>
              <TouchableOpacity style={styles.button} onPress={handleStartCooking}>
                <Text style={styles.buttonText}>Start Cooking</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.message}>
              You can start cooking 2 hours before the scheduled time.
            </Text>
          )
        ) : (
          <>
            {booking.status === 'Completed' ? (
              <Text style={styles.timerText}>Order Completed</Text>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.endCookButton]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>End Cooking</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to end?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={() => {
                  setModalVisible(false);
                  handleEndCooking();
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',  // Ensure title text is black
  },
  text: {
    marginVertical: 8, // Added space between text elements
    fontSize: 16,
    color: '#000', // Set default text color to black
  },
  bold: {
    fontWeight: 'bold',
    color: '#000', // Set bold text color to black
  },
  status: {
    fontWeight: 'bold',
    color: 'green',
  },
  actionsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endCookButton: {
    marginTop: 10,
    backgroundColor: '#f44336',
  },
  timerText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#000', // Ensure timer text is black
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // Ensure modal text is black
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
});
