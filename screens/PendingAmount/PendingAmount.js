import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function PendingAmount({ route, navigation }) {
  const { amountDue } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Amount</Text>
      <Text style={styles.amount}>Amount Due: ₹{amountDue}</Text>
      <Button
        title="Do Payment"
        onPress={() => {
          // Handle payment logic here
          alert("Proceeding to Payment...");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amount: {
    fontSize: 18,
    marginBottom: 30,
  },
});
