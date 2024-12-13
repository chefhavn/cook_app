import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Button } from 'react-native';
import { Card, Paragraph, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { fetchChefOrders, cancelOrder } from '../services/api';
import moment from 'moment-timezone';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState(null);

  // Fetch orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setChefId(parsedUser.id);

            const data = await fetchChefOrders(parsedUser.id);
            if (data.success) {
              setOrders(data.bookings);
            } else {
              Alert.alert('No orders found');
            }
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          Alert.alert('Error', 'Unable to fetch orders');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, []) // Dependency array is empty so this runs only when the screen gains focus
  );

  const handleCancelOrder = async (bookingId) => {
    try {
      const response = await cancelOrder(bookingId);
      if (response.success) {
        // Update the local orders state after canceling the order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === bookingId ? { ...order, status: 'Cancelled' } : order
          )
        );
        Alert.alert('Order cancelled successfully');
      } else {
        Alert.alert('Failed to cancel the order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      Alert.alert('Error', 'Unable to cancel the order');
    }
  };

  const isBookingConfirmed = (orderDate) => {
    const currentTime = moment();
    const bookingTime = moment.utc(orderDate).local(); // Convert from UTC to local time
    const timeDifference = bookingTime.diff(currentTime, 'hours');
    return timeDifference <= 3;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4688F1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order._id} style={styles.card}>
            <Card.Title title={`Order No: ${order.booking_number}`} />
            <Card.Content>
              <Paragraph>Event Type: {order.event_type}</Paragraph>
              <Paragraph>Date: {moment.utc(order.date).local().format('DD/MM/YYYY HH:mm')}</Paragraph>
              <Paragraph>Price: ₹{order.price}</Paragraph>
              {isBookingConfirmed(order.date) && order.status !== 'Cancelled' ? (
                <Badge style={styles.confirmedBadge}>Confirmed Order</Badge>
              ) : order.status === 'Cancelled' ? (
                <Text style={styles.cancelledText}>Order Cancelled</Text>
              ) : (
                <Button title="Cancel Order" onPress={() => handleCancelOrder(order._id)} />
              )}
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text>No orders found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 10,
  },
  confirmedBadge: {
    marginTop: 10,
    backgroundColor: 'green',
    color: 'white',
    padding: 5,
  },
  cancelledText: {
    color: 'red',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyOrdersScreen;
