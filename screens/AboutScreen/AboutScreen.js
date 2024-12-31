import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Colors = {
  Primary: '#503A73', // Primary color for highlights
  Background: '#f5f5f5', // Background color for the screen
  Text: '#333', // Default text color
  Accent: '#ffa500', // Accent color for categories
};

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>INTRODUCING THE BRAND AND ITS CATEGORIES</Text>
      <Text style={styles.bodyText}>
        Welcome to <Text style={styles.brandName}>Chef Havn</Text>, your ultimate destination for culinary excellence delivered right to your doorstep. We offer two distinct categories of chefs to cater to your unique needs:
      </Text>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Basic Chefs</Text>
        <Text style={styles.bodyText}>
          Our Basic Chefs are passionate newcomers to the culinary world, eager to make their mark. They bring fresh energy and creativity, perfect for those seeking innovative and contemporary dining experiences. Whether you're hosting a casual gathering or looking to explore new flavors, our Basic Chefs will craft delightful meals with enthusiasm and care.
        </Text>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Professional Chefs</Text>
        <Text style={styles.bodyText}>
          Our Professional Chefs are seasoned experts with extensive experience in the culinary industry. They possess a wide range of skills and a deep understanding of diverse cuisines, ensuring a top-notch dining experience. Ideal for high-profile events, corporate functions, or special occasions, our Professional Chefs bring sophistication and mastery to every dish they create.
        </Text>
      </View>

      <Text style={styles.conclusionText}>
        At <Text style={styles.brandName}>Chef Havn</Text>, we are committed to delivering exceptional culinary services that suit your needs. Whether you opt for the innovative flair of a Basic Chef or the refined expertise of a Professional Chef, we guarantee a memorable dining experience right at your doorstep.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.Background,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.Primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  brandName: {
    fontWeight: 'bold',
    color: Colors.Primary,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.Text,
    lineHeight: 24,
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Accent,
    marginBottom: 10,
  },
  conclusionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Text,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AboutScreen;
