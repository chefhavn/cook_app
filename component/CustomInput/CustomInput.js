import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const Colors = {
  PRIMARY: '#503A73', // Replace with your preferred primary color
  BACKGROUND: '#ffffff', // Background color of the input
};

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text) => {
    if (keyboardType === 'phone-pad') {
      // Restrict to numbers and limit to 10 digits
      const filteredText = text.replace(/[^0-9]/g, '').slice(0, 10);
      onChangeText(filteredText);
    } else {
      // Allow normal behavior for other input types
      onChangeText(text);
    }
  };

  return (
    <View
      style={[
        styles.container,
        style,
        { borderColor: isFocused ? Colors.PRIMARY : '#dadada' }, // Dynamic border color
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#333"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 8,
    borderWidth: 1.5, // Border width
    outline: 'none'
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default CustomInput;
