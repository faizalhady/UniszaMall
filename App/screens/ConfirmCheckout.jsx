import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';
import { FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import axios from '../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenTemplate from '../components/ScreenTemplate';

const ConfirmCheckout = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { subtotal, shippingCost, grandTotal, items } = route.params;
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handlePayment = async () => {
        if (!paymentMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await axios.post('/complete-purchase', { items }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setShowConfetti(true);
                Alert.alert('Success', 'Payment made successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Home');
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error('Error completing purchase:', error);
            Alert.alert('Error', 'Failed to complete purchase');
        }
    };

    return (
        <ScreenTemplate title="Confirm Checkout">
            <SafeAreaView className="flex-1 w-full items-start justify-start bg-[#EBEAEF] space-y-4 px-4 py-12">

                <View className="w-full flex space-y-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-[#555]">Subtotal</Text>
                        <View className="flex-row items-center justify-center space-x-1">
                            <Text className="text-xl font-semibold text-black">
                                RM {parseFloat(subtotal).toFixed(2)}
                            </Text>
                            <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                        </View>
                    </View>
                    <View className="w-full h-[2px] bg-white"></View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-[#555]">Shipping Cost</Text>
                        <View className="flex-row items-center justify-center space-x-1">
                            <Text className="text-xl font-semibold text-black">
                                RM {parseFloat(shippingCost).toFixed(2)}
                            </Text>
                            <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                        </View>
                    </View>
                    <View className="w-full h-[2px] bg-white"></View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-[#555]">Grand Total</Text>
                        <View className="flex-row items-center justify-center space-x-1">
                            <Text className="text-xl font-semibold text-black">
                                RM {parseFloat(grandTotal).toFixed(2)}
                            </Text>
                            <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                        </View>
                    </View>
                    <View className="w-full h-[2px] bg-white"></View>

                    <View className="flex-row justify-around mt-4">
                        <View className="flex items-center">
                            <TouchableOpacity onPress={() => setPaymentMethod('COD')} className={`p-4 rounded-full ${paymentMethod === 'COD' ? 'bg-orange-500' : 'bg-white'}`}>
                                <FontAwesome5 name="money-bill-wave" size={24} color={paymentMethod === 'COD' ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <Text className="text-sm mt-2">{paymentMethod === 'COD' ? 'COD' : 'COD'}</Text>
                        </View>
                        <View className="flex items-center">
                            <TouchableOpacity onPress={() => setPaymentMethod('OnlineBanking')} className={`p-4 rounded-full ${paymentMethod === 'OnlineBanking' ? 'bg-orange-500' : 'bg-white'}`}>
                                <MaterialIcons name="account-balance" size={24} color={paymentMethod === 'OnlineBanking' ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <Text className="text-sm mt-2">{paymentMethod === 'OnlineBanking' ? 'Online Banking' : 'Online Banking'}</Text>
                        </View>
                        <View className="flex items-center">
                            <TouchableOpacity onPress={() => setPaymentMethod('CreditCard')} className={`p-4 rounded-full ${paymentMethod === 'CreditCard' ? 'bg-orange-500' : 'bg-white'}`}>
                                <FontAwesome5 name="credit-card" size={24} color={paymentMethod === 'CreditCard' ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <Text className="text-sm mt-2">{paymentMethod === 'CreditCard' ? 'Credit Card' : 'Credit Card'}</Text>
                        </View>
                    </View>


                    <View className="w-full px-8 my-4">
                        <TouchableOpacity
                            className="w-full p-2 py-3 rounded-xl bg-orange-500 flex items-center justify-center"
                            onPress={handlePayment}
                        >
                            <Text className="text-lg text-white font-semibold">Make Payment</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />}
            </SafeAreaView>
        </ScreenTemplate>
    );
};

export default ConfirmCheckout;
