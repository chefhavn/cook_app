import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Card, Paragraph, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { fetchChefOrders, cancelOrder } from '../services/api';
import moment from 'moment-timezone';
import Colors from '../utils/Colors'; // Import Colors utility

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const userData = await AsyncStorage.getItem('user');
          console.log(userData)
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setChefId(parsedUser.id);
            const data = await fetchChefOrders(parsedUser.id);
            console.log("Fetch Order data", data)
            if (data.success) {
              setOrders(data.bookings);
            } else {
              Alert.alert('No orders found');
            }
          }
        } catch (error) {
          Alert.alert('Error', 'Unable to fetch orders');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  const handleCancelOrder = async (bookingId) => {
    try {
      const response = await cancelOrder(bookingId);
      if (response.success) {
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
    const bookingTime = moment.utc(orderDate).local();
    const timeDifference = bookingTime.diff(currentTime, 'hours');
    return timeDifference <= 3;
  };

  const OrderCard = ({ order }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>

        <View style={styles.eventDate}>
          <Text style={styles.value}>{order.event_type}</Text>
          <Text style={styles.value}>
            {moment.utc(order.date).local().format('MMM D, YYYY')}
          </Text>
        </View>



        <View style={styles.numberPrice}>
          <Text style={styles.bookingNumber}>
            {order.booking_number}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>₹</Text>
            <Text style={styles.price}>{order.price}</Text>
          
          </View>

        </View>


        <Text>
            {order.status}
          </Text>


      </View>

      {
        isBookingConfirmed(order.date) && order.status !== 'Cancelled' || order.status !== 'Ongoing' ? (
          <View style={styles.statusContainer}>
            <Text style={styles.confirmedStatus}>Confirmed Order</Text>
          </View>
        ) : order.status === 'Cancelled' ? (
          <View style={styles.statusContainer}>
            <Text style={styles.cancelledStatus}>Order Cancelled</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelOrder(order._id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )
      }

    </Card >
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))
      ) : (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,

  },

  value: {
    fontSize: 16,
    fontWeight: '500'

  },

  eventDate: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  bookingNumber: {
    color: 'gray',
    fontSize: 16,
  },

  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  numberPrice: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  priceSymbol: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.PRIMARY
  },

  price: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.PRIMARY
  },

  statusContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
    alignItems: 'center',
  },
  confirmedStatus: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  cancelledStatus: {
    color: '#F44336',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});

export default MyOrdersScreen;
