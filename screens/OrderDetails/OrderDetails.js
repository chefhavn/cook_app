import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../utils/Colors';
import { startBooking, endBooking } from '../../services/api';

export default function OrderDetails({ route, navigation }) {
  const { order } = route.params;
  const booking = order?.booking_id;
  const [orderEndAmount, setOrderEndAmount] = useState(1599)
  const [amountDue, setAmountDue] = useState(0)

  const [isCookingStarted, setIsCookingStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



const calculateOrderAmount = () => {
  console.log("tYPE of ORDER AMOUNT", typeof orderEndAmount);
  if(orderEndAmount === 1199){
    console.log("1st IF ELSE")
    setAmountDue(0)
}
else if (orderEndAmount < 1199){
  console.log("2ND IF ELSE")
  setAmountDue(0)
}
else{
    let amount_due = orderEndAmount - 1199;
    console.log("aMOUNT DUE", amount_due);
    console.log("3RD IF ELSE")
    setAmountDue(amount_due)

    navigation.navigate('PendingAmount', { amountDue: amount_due });

}
}
 
  // Start Cooking
  const handleStartCooking = async () => {
    try {
      const response = await startBooking(booking._id);
      if (response.success) {
        setIsCookingStarted(true);

        // Store the start time in AsyncStorage
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
          <TouchableOpacity style={styles.button} onPress={handleStartCooking}>
            <Text style={styles.buttonText}>Start Cooking</Text>
          </TouchableOpacity>
        ) : (
          <>
            {
              booking.status === 'Completed' ? (
                <>
                  <Text style={styles.timerText}>Order Completed</Text>
                </>
              ) : (
                <>
                  {/* <Text style={styles.timerText}>Elapsed Time: {formatTime(elapsedTime)}</Text> */}
                  <TouchableOpacity
                    style={[styles.button, styles.endCookButton]}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.buttonText}>End Cooking</Text>
                  </TouchableOpacity>
                </>

              )
            }


          </>
        )}
      </View>


      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {/* You completed this cooking in {formatTime(elapsedTime)}. Are you sure you want to end? */}
              Are you sure you want to end?
            </Text>
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
  },
  text: {
    marginVertical: 8, // Added space between text elements
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
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
