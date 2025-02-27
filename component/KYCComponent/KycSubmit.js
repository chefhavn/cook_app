import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KycSubmit = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.icon} source={require("../../assets/images/verified.png")} />
        
        <Text style={styles.title}>Verification in Progress</Text>
        
        <Text style={styles.message}>
          Your profile is under verification. Our team is reviewing your submitted documents.
        </Text>
        
        <View style={styles.infoContainer}>
          <Image style={styles.icon_v} source={require("../../assets/images/info.png")} />
          <Text style={styles.infoText}>
            This process typically takes 1-2 business days. We'll notify you once completed.
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
        <Image style={styles.icon_v} source={require("../../assets/images/hour.png")} />
          <Text style={styles.statusText}>Status: Pending</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 10,
    height: 70,
    width: 70
  },
  icon_v: {
    height: 30,
    width: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFA000',
  },
});

export default KycSubmit;