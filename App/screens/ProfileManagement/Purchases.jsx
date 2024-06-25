import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenTemplate from '../../components/ScreenTemplate';
import moment from 'moment';

const Purchases = () => {
  const navigation = useNavigation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('/purchases', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPurchases(response.data);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const handlePress = (id) => {
    navigation.navigate('PurchaseDetails', { purchaseId: id });
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScreenTemplate title="Purchases">
      <View className="flex-1 w-full items-start justify-start bg-[#EBEAEF] space-y-4">
        {purchases.length === 0 ? (
          <View className="flex-1 items-center py-12">
            <Text className="text-xl font-semibold text-[#555]">No Purchases Found</Text>
          </View>
        ) : (
          <FlatList
            data={purchases}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePress(item.id)}
                className="w-full p-4 bg-white rounded-xl mb-4"
              >
                <Text className="text-lg font-semibold text-[#555]">Purchased On: {formatDate(item.purchase_date)}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

export default Purchases;
