import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Card, Paragraph } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import KYCComponent from '../../component/KYCComponent/KYCComponent';
import { fetchBookings, approveBooking, rejectBooking } from '../../services/api';

export default function HomeScreen({ navigation, setAcceptedOrders }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);

  // Fetch user data and bookings every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('user');
          console.log(storedUserData);
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            setKycStatus(parsedUserData.kyc_status);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const loadBookings = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
          // Fetch all bookings from the server
          const data = await fetchBookings();
          if (data.success) {
            // Get rejected booking IDs from AsyncStorage
            const rejectedIds = JSON.parse(await AsyncStorage.getItem('rejectedBookings')) || [];
      
            // Filter out the rejected bookings
            const filteredBookings = data.bookings.filter(
              (booking) => !rejectedIds.includes(booking._id)
            );
      
            // Update the state with non-rejected bookings
            setBookings(filteredBookings);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false); // Hide loading spinner after fetching
        }
      };
      

      fetchUserData();
      loadBookings();
    }, []) // Empty dependency array ensures this runs every time the screen is focused
  );

  // Handle user logout
  const handleLogout = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        await AsyncStorage.removeItem('user');
        Alert.alert('Logged out', 'You have been logged out.');
  
        // Reset navigation stack to Login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      } else {
        Alert.alert('No User Found', 'You are not logged in.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  // Handle booking acceptance with backend API call
  const handleAccept = async (id) => {
    try {
      const result = await approveBooking(userData.id, id);
      if (result.success) {
        const acceptedBooking = bookings.find((booking) => booking._id === id);
        setAcceptedBookings((prev) => [...prev, acceptedBooking]);
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
        Alert.alert('Booking Accepted', `Booking ID: ${id} has been accepted.`);
      } else {
        Alert.alert('Error', result.message || 'Failed to approve booking.');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      Alert.alert('Error', 'An error occurred while approving the booking.');
    }
  };

  // Handle booking rejection with backend API call
  const handleReject = async (id) => {
    try {
      const result = await rejectBooking(id);
      if (result) {
        // Store the rejected ID in AsyncStorage
        const rejectedIds = JSON.parse(await AsyncStorage.getItem('rejectedBookings')) || [];
        rejectedIds.push(id);
        await AsyncStorage.setItem('rejectedBookings', JSON.stringify(rejectedIds));
  
        // Update the state to remove the booking from the list
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
        <ActivityIndicator size="large" color="#4688F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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

        {kycStatus === 'Pending' ? (
          <KYCComponent navigation={navigation} />
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking._id} style={styles.card}>
              <Card.Title title={`Booking No: ${booking.booking_number}`} />
              <Card.Content>
                <Paragraph>Event Type: {booking.event_type}</Paragraph>
                <Paragraph>Date: {new Date(booking.date).toLocaleDateString()}</Paragraph>
                <Paragraph>Price: ₹{booking.price}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <TouchableOpacity onPress={() => handleAccept(booking._id)} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject(booking._id)} style={styles.rejectButton}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text>No bookings available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContainer: {
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3D00',
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: '#4688F1',
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
  card: {
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
