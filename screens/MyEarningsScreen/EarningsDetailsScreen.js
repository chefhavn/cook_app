import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Colors = {
  Primary: '#503A73',
  Background: '#f5f5f5',
  Text: '#333', // Black text color
  CardBackground: '#ffffff',
  Accent: '#ffa500',
  BorderColor: '#ddd',
};

const EarningsDetailsScreen = ({ route }) => {
  const { chefId } = route.params;  // Receive the chefId from the navigation params
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch(`https://www.chefhavn.com/api/booking/earning-details/${chefId}`);
        const data = await response.json();
        console.log("Earnings Data:", data);
        setEarningsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [chefId]);

  const renderEarningItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.transactionAmount}>₹{item.amount}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  if (!earningsData || earningsData.earnings_list.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>All Earnings</Text>
        <Text style={styles.noDataMessage}>No earnings found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Earnings</Text>
      <FlatList
        data={earningsData.earnings_list}
        renderItem={renderEarningItem}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Set header text color to black
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
    color: 'black', // Set transaction date text color to black
  },
  transactionAmount: {
    fontSize: 16,
    color: Colors.Primary,
    fontWeight: 'bold',
  },
  transactionsList: {
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
  },
  noDataMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black', // Set "No data found" message color to black
    marginTop: 20,
  },
});

export default EarningsDetailsScreen;
