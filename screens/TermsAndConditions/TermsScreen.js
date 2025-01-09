import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Colors = {
  Primary: '#503A73', // Primary color for headings and accent elements
  Background: '#f5f5f5', // Background color for the screen
  Text: '#333', // Text color
  SectionBackground: '#fff', // Background color for sections
  BorderColor: '#ddd', // Border color for separation
};

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            1. Chefhavn is not responsible for any loss, damage, injury, or any other harm whatsoever that might occur to me.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            2. Chefhavn is not responsible for any dispute that might arise between me and customers.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            3. I accept and acknowledge that I am fit and capable to accept the responsibility assigned as part of Chefhavn transactions.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            4. I will abide by all the instructions that Chefhavn will impose on cooks.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            5. Chefhavn has the sole discretion to allot any cook any assignment/assignments or no assignment.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.Primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: Colors.SectionBackground,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.Text,
  },
});

export default TermsScreen;
