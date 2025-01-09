import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const Colors = {
  Primary: '#503A73',
  Background: '#f5f5f5',
  Text: '#333',
  CardBackground: '#ffffff',
  Accent: '#ffa500',
  ButtonText: '#fff',
  BorderColor: '#ddd',
};

const WithdrawalsDetailsScreen = () => {
  const [chefId, setChefId] = useState(null);
  const [withdrawalsData, setWithdrawalsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setChefId(parsedUser.id);  // Set chefId in the state
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch withdrawals data from the backend after the chefId is available
  useEffect(() => {
    if (chefId) {
      const fetchWithdrawalsData = async () => {
        try {
          const response = await fetch(`http://192.168.1.46:3000/api/booking/earning-details/${chefId}`);
          const data = await response.json();
          setWithdrawalsData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching withdrawals data:', error);
          setLoading(false);
        }
      };

      fetchWithdrawalsData();
    }
  }, [chefId]);  // Only run once the chefId has been set

  const renderWithdrawal = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.transactionAmount}>₹{item.amount}</Text>
      <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>{item.status}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Completed':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'black';
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Withdrawals</Text>

      <FlatList
        data={withdrawalsData.withdrawals}
        renderItem={renderWithdrawal}
        keyExtractor={(item) => item._id}
        style={styles.transactionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.Text,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: Colors.CardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  transactionDate: {
    fontSize: 16,
    color: Colors.Text,
  },
  transactionAmount: {
    fontSize: 16,
    color: Colors.Primary,
    fontWeight: 'bold',
  },
  transactionStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    alignSelf: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
  },
  transactionsList: {
    marginTop: 10,
  },
});

export default WithdrawalsDetailsScreen;
