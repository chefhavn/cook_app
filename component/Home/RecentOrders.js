import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RecentOrders({ latestOrder, navigation }) {
  const orderData = latestOrder?.booking_id;

  return (
    <View style={styles.container}>
      {latestOrder ? (
        <Card style={styles.card}>
          <Card.Title
            title="Recent Approved Order"
            subtitle={`Booking Number: ${orderData?.booking_number}`}
            left={(props) => <Icon {...props} name="clipboard-check-outline" size={30} />}
          />
          <Card.Content>
            <Text style={styles.text}>Location: {orderData?.location}</Text>
            <Text style={styles.text}>Date: {new Date(orderData?.date).toLocaleDateString()}</Text>
            <Text style={styles.text}>Event Type: {orderData?.event_type}</Text>
            <Text style={styles.text}>Cuisine: {orderData?.cuisine_type}</Text>
            <Text style={styles.text}>
              Status: <Text style={styles.status}>{latestOrder.status}</Text>
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => navigation.navigate('OrderDetails', { order: latestOrder })}
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <View style={styles.noOrderContainer}>
          <Icon name="alert-circle-outline" size={40} color="gray" />
          <Text style={styles.noOrderText}>No Recent Orders Found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  text: {
    marginVertical: 4,
    fontSize: 16,
  },
  status: {
    fontWeight: 'bold',
    color: 'green',
  },
  noOrderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noOrderText: {
    marginTop: 10,
    fontSize: 18,
    color: 'gray',
  },
});
