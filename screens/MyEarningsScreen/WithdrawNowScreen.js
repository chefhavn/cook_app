import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Colors = {
    Primary: '#503A73',
    Background: '#f5f5f5',
    Text: '#333',
    CardBackground: '#ffffff',
    ButtonText: '#fff',
    InputBorder: '#e0e0e0',
    ButtonHover: '#6a4b96', // Lighter shade for button hover effect
};

const WithdrawNowScreen = ({ route, navigation }) => {
    const { availableBalance } = route.params; // Get available balance from navigation params
    const [amount, setAmount] = useState('');
    const [transactionId] = useState(generateTransactionId()); // Random transaction ID

    // Generate a random transaction ID
    function generateTransactionId() {
        return 'TXN' + Math.random().toString(36).substring(2, 15).toUpperCase();
    }

    // Handle withdrawal logic
    const handleWithdraw = async () => {
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(userData);
        const chefId = parsedUser.id;

        if (!amount || !transactionId) {
            Alert.alert("Error", "Please provide both amount and transaction ID.");
            return;
        }

        // Validate if the entered amount is less than or equal to the available balance
        if (parseFloat(amount) > availableBalance) {
            Alert.alert("Error", "Withdrawal amount exceeds available balance.");
            return;
        }

        try {
            const response = await fetch('http://192.168.1.46:3000/api/booking/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chef_id: chefId,
                    amount: parseFloat(amount),
                    transaction_id: transactionId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Success", "Your withdrawal request has been successfully created.");
                navigation.goBack();
            } else {
                Alert.alert("Error", data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.label}>Available Balance</Text>
                <Text style={styles.availableBalance}>
                    ₹{availableBalance ? availableBalance : '0.00'}
                </Text>

                <Text style={styles.label}>Withdrawal Amount</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor={Colors.InputBorder}
                />

                {/* Read-only transaction ID */}
                <Text style={styles.label}>Transaction ID</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={transactionId}
                    editable={false}  // Make it read-only
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleWithdraw}
                >
                    {/* <Icon name="arrow-circle-right" size={20} color={Colors.ButtonText} /> */}
                    <Text style={styles.buttonText}>Withdraw</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
        justifyContent: 'center',
    },
    innerContainer: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: Colors.CardBackground,
        elevation: 10, // Shadow effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    label: {
        fontSize: 16,
        color: Colors.Text,
        marginBottom: 10,
        fontWeight: '500',
    },
    availableBalance: {
        fontSize: 22,
        color: Colors.Primary,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'left',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.InputBorder,
        padding: 15,
        fontSize: 16,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    readOnlyInput: {
        backgroundColor: '#f5f5f5',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.Primary,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
        elevation: 3, // Shadow for button
    },
    buttonText: {
        color: Colors.ButtonText,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default WithdrawNowScreen;
