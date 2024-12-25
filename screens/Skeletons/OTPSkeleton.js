import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const OTPSkeleton = () => {
  const [loading, setLoading] = useState(true);

  // Stop loading after a delay to simulate data loading (optional)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000); // Adjust duration as needed
//     return () => clearTimeout(timer);
//   }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ShimmerPlaceholder
          visible={!loading}
          shimmerColors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.titleSkeleton}
        />
        <ShimmerPlaceholder
          visible={!loading}
          shimmerColors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.subTitleSkeleton}
        />

        <View style={styles.otpContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ShimmerPlaceholder
              key={index}
              visible={!loading}
              shimmerColors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
              style={styles.otpInputSkeleton}
            />
          ))}
        </View>

        <ShimmerPlaceholder
          visible={!loading}
          shimmerColors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.resendTextSkeleton}
        />
        <ShimmerPlaceholder
          visible={!loading}
          shimmerColors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.buttonSkeleton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  titleSkeleton: {
    height: 24,
    width: '60%',
    borderRadius: 4,
    marginBottom: 10,
  },
  subTitleSkeleton: {
    height: 15,
    width: '80%',
    borderRadius: 4,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInputSkeleton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    margin: 5,
  },
  resendTextSkeleton: {
    height: 16,
    width: '50%',
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonSkeleton: {
    height: 50,
    width: '80%',
    borderRadius: 10,
  },
});

export default OTPSkeleton;
