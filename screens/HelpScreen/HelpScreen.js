import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Colors = {
  Primary: '#503A73', // Replace with your preferred primary color
  Background: '#f5f5f5', // Background color for the screen
  Text: '#333', // Text color
  ButtonColor: '#03a9f4', // Button color for contact options
  ButtonText: '#fff', // Text color for buttons
};

const HelpScreen = () => {
  const handleCallUs = () => {
    Linking.openURL('tel:+1234567890'); // Replace with the actual phone number
  };

  const handleEmailUs = () => {
    Linking.openURL('mailto:support@chefhavn.com'); // Replace with your actual email
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.subtitle}>We're here to assist you!</Text>

      {/* Call Us Section */}
      <TouchableOpacity style={styles.button} onPress={handleCallUs}>
        <Text style={styles.buttonText}>Call Us</Text>
      </TouchableOpacity>

      {/* Email Us Section */}
      <TouchableOpacity style={styles.button} onPress={handleEmailUs}>
        <Text style={styles.buttonText}>Contact Us by Email</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>You can reach us anytime!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.Primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.Text,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.ButtonColor,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: Colors.ButtonText,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: Colors.Text,
    marginTop: 30,
    textAlign: 'center',
  },
});

export default HelpScreen;
