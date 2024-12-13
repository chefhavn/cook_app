import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, Menu, IconButton, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function OrderList({ orders, navigation }) {
  const [visible, setVisible] = useState({});

  const openMenu = (id) => setVisible({ ...visible, [id]: true });
  const closeMenu = (id) => setVisible({ ...visible, [id]: false });

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <Card style={styles.orderCard}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.name}>{item.name}</Text>
              <Menu
                visible={visible[item.id]}
                onDismiss={() => closeMenu(item.id)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => openMenu(item.id)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    closeMenu(item.id);
                    navigation.navigate('OrderDetails', { order: item });
                  }}
                  title="View"
                />
              </Menu>
            </View>
            <View style={styles.header}>
              <Text style={styles.orderNo}>No. {item.orderNo}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <View style={styles.addressContainer}>
              <Icon name="map-marker" size={20} color="#4285F4" />
              <Text style={styles.address}>{item.address}</Text>
            </View>
          </Card.Content>
          {item.type === 'New' && (
            <Card.Actions>
              <Button mode="contained">Accept</Button>
              <Button mode="outlined">Reject</Button>
            </Card.Actions>
          )}
        </Card>
      )}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  orderCard: {
    marginVertical: 10, // Increased margin for top and bottom spacing
    paddingBottom: 16,
    borderRadius: 4,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#f5f5f5',
    borderLeftWidth: 1,
    borderLeftColor: '#f5f5f5',
    // iOS shadow equivalent
    shadowColor: 'rgba(0, 0, 0, 0.3)', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1, 
    shadowRadius: 10, 
    // Android shadow equivalent
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center vertically
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#503a73'
  },
  orderNo: {
    fontSize: 12,
    color: '#888',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  date: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 2,
    // paddingHorizontal: 8,
    borderRadius: 5,
    color: '#F57C00',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#503a73'
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  address: {
    marginLeft: 2,
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 5,
  },
});