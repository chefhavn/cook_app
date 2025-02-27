import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

const KycReject = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>Verification Rejected</Text>
        
        <Text style={styles.message}>
          Unfortunately, your verification was not approved. You can apply again after 7 days.
        </Text>
        
        <View style={styles.infoContainer}>
          <Image style={styles.icon_v} source={require("../../assets/images/info_red.png")} />
          <Text style={styles.infoText}>
            Please ensure that you provide accurate and clear documents for successful verification.
          </Text>
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
    width: 70,
  },
  icon_v: {
    height: 30,
    width: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
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
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
    lineHeight: 20,
  },
});

export default KycReject;
