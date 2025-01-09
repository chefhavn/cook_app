import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const Colors = {
  Primary: '#503A73',
  Background: '#f5f5f5',
  Text: '#333',
  CardBackground: '#ffffff',
  Accent: '#ffa500',
  ButtonText: '#fff',
  BorderColor: '#ddd',
  ButtonHover: '#6a4b96', // Hover effect color for buttons
};

const MyEarningsScreen = ({ navigation }) => {
  const [chefId, setChefId] = useState(null);  // State to hold the chefId
  const [earningsData, setEarningsData] = useState(null);
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

  // Fetch earnings data from the backend after the chefId is available
  useEffect(() => {
    if (chefId) {
      const fetchEarningsData = async () => {
        try {
          const response = await fetch(`https://www.chefhavn.com/api/booking/earning-details/${chefId}`);
          const data = await response.json();
          setEarningsData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching earnings data:', error);
          setLoading(false);
        }
      };

      fetchEarningsData();
    }
  }, [chefId]);

  const renderTransaction = ({ item }) => (
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

  return (
    <View style={styles.container}>
      {/* Earnings Overview Section */}
      <View style={styles.earningsOverview}>
        <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
        <Text style={styles.totalEarningsAmount}>₹{earningsData.totalEarnings}</Text>
      </View>

      {/* Latest Earnings Section */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Earnings</Text>
        <FlatList
          data={earningsData.latestEarnings}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          style={styles.transactionsList}
        />
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('EarningsDetails', { chefId })}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Withdrawals Section */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Withdrawals</Text>
        <FlatList
          data={earningsData.latestWithdrawals}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          style={styles.transactionsList}
        />
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('WithdrawalsDetails', { chefId })}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Withdraw Now Button */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('WithdrawNow', {
            availableBalance: earningsData.availableBalance, // Passing available balance
            chefId: chefId
          })}
        >
          <Text style={styles.actionButtonText}>Withdraw Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
  },
  earningsOverview: {
    backgroundColor: Colors.CardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalEarningsLabel: {
    fontSize: 18,
    color: Colors.Text,
    marginBottom: 10,
  },
  totalEarningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.Primary,
  },
  transactionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.Text,
    marginBottom: 10,
  },
  transactionsList: {
    marginTop: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  viewAllButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.Accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.Primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Shadow for button
  },
  actionButtonText: {
    color: Colors.ButtonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
  },
});

export default MyEarningsScreen;
