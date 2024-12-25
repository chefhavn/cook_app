import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Colors = {
  Primary: '#6200ee', // Replace with your preferred primary color
  Background: '#f5f5f5', // Background color for the screen
  Text: '#333', // Text color
};

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.Primary,
  },
});

export default HelpScreen;
