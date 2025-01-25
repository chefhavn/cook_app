import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import KYCComponent from '../../component/KYCComponent/KYCComponent';
import { fetchBookings, approveBooking, rejectBooking, fetchLatestAcceptedOrder, getVendorDetails } from '../../services/api';
import Colors from '../../utils/Colors';
import RecentOrders from '../../component/Home/RecentOrders';

export default function HomeScreen({ navigation }) {

  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Colors.SECONDARY,
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true); // Show indicator
    try {
      // Fetch user data
      const storedUserData = await AsyncStorage.getItem('user');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        console.log(parsedUserData)
        setUserData(parsedUserData);
        setKycStatus(parsedUserData.kyc_status);
        if(parsedUserData.id && parsedUserData.kyc_status === "Pending"){
          const vendorDetails = await getVendorDetails(parsedUserData.id);
          setKycStatus(vendorDetails.kyc_status);
        }

        // Fetch latest accepted order for the chef
        const chefId = parsedUserData.id;
        const orderData = await fetchLatestAcceptedOrder(chefId);
        console.log("Order latest", orderData)
        if (orderData.success && orderData.order) {
          setLatestOrder(orderData.order);
        } else {
          console.log(orderData.message);
          setLatestOrder(null);
        }
      }

      // Fetch bookings
      const data = await fetchBookings();
      if (data.success) {
        const rejectedIds = JSON.parse(await AsyncStorage.getItem('rejectedBookings')) || [];
        const filteredBookings = data.bookings.filter(
          (booking) => !rejectedIds.includes(booking._id)
        );
        setBookings(filteredBookings);
      } else {
        console.error('Error fetching bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Hide indicator
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  

  const handleAccept = async (id) => {
    try {
      const result = await approveBooking(userData.id, id);
      if (result.success) {
        Alert.alert('Booking Accepted', `Booking ID: ${id} has been accepted.`);
        fetchData();
      } else {
        Alert.alert('Error', result.message || 'Failed to approve booking.');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      Alert.alert('Error', 'An error occurred while approving the booking.');
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await rejectBooking(id);
      if (result) {
        const rejectedIds = JSON.parse(await AsyncStorage.getItem('rejectedBookings')) || [];
        rejectedIds.push(id);
        await AsyncStorage.setItem('rejectedBookings', JSON.stringify(rejectedIds));
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
        Alert.alert('Booking Rejected', `Rejected booking ID: ${id}`);
      } else {
        Alert.alert('Error', result.message || 'Failed to reject booking.');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Alert.alert('Error', 'An error occurred while rejecting the booking.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

      {kycStatus !== 'Pending' &&
        <RecentOrders navigation={navigation} latestOrder={latestOrder} />
      }


        {kycStatus === 'Pending' ? (
          <KYCComponent navigation={navigation} />
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking._id} style={styles.card}>
              <Card.Title title={`Booking No: ${booking.booking_number}`} titleStyle={styles.title} />
              <Card.Content>
                <Paragraph style={styles.boldText}>Event Type:</Paragraph>
                <Paragraph>{booking.event_type}</Paragraph>
                <Paragraph style={styles.boldText}>Date:</Paragraph>
                <Paragraph>{new Date(booking.date).toLocaleDateString()}</Paragraph>
                <Paragraph style={styles.boldText}>Price:</Paragraph>
                <Paragraph>₹{booking.price}</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <TouchableOpacity onPress={() => handleAccept(booking._id)} style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject(booking._id)} style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noBookingsText}>No bookings available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  rejectButtonText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});
