import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const Colors = {
  Primary: '#503A73', // Primary color for the buttons
  Background: '#f5f5f5', // Background color for the screen
  Text: '#333', // Text color
  CardBackground: '#ffffff', // Card background color
  Accent: '#ffa500', // Accent color for action items
  ButtonText: '#fff', // Button text color
  BorderColor: '#ddd', // Border color for separating items
};

const recentTransactions = [
  { id: '1', date: '2024-12-20', amount: '$100.00' },
  { id: '2', date: '2024-12-19', amount: '$150.00' },
  { id: '3', date: '2024-12-18', amount: '$75.00' },
];

const MyEarningsScreen = () => {
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Earnings</Text>

      <View style={styles.earningsOverview}>
        <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
        <Text style={styles.totalEarningsAmount}>$325.00</Text>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={recentTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          style={styles.transactionsList}
        />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Withdraw Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.Primary,
    textAlign: 'center',
    marginBottom: 20,
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
  },
  actionButtonText: {
    color: Colors.ButtonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyEarningsScreen;
