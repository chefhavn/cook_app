import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const AppWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      {React.Children.map(children, (child) =>
        child.type === Text
          ? React.cloneElement(child, {
              style: [child.props.style, styles.text],
            })
          : child
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Regular',
  },
  container: {
    flex: 1,
  },
});

export default AppWrapper;
