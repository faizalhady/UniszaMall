import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from '../../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenTemplate from '../../components/ScreenTemplate';
import { fetchFeeds } from '../../sanity';

const PurchaseDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { purchaseId } = route.params;

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseItems = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(`/purchases/${purchaseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Purchase items fetched:', response.data);
          setPurchaseItems(response.data);
        }
      } catch (error) {
        console.error('Error fetching purchase items:', error);
      }
    };

    fetchPurchaseItems();
  }, [purchaseId]);

  useEffect(() => {
    if (purchaseItems.length > 0) {
      const fetchAndFilterFeeds = async () => {
        try {
          const allFeeds = await fetchFeeds();
          console.log('All feeds fetched:', allFeeds);

          const itemIds = purchaseItems.map(item => item.item_id);
          const filteredFeeds = allFeeds.filter(feed => itemIds.includes(feed._id));
          console.log('Filtered feeds:', filteredFeeds);

          setFeeds(filteredFeeds);
        } catch (error) {
          console.error('Error fetching and filtering feeds:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAndFilterFeeds();
    }
  }, [purchaseItems]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const subtotal = feeds.reduce((sum, item) => {
    const purchaseItem = purchaseItems.find(purchase => purchase.item_id === item._id);
    return sum + (item.price * (purchaseItem ? purchaseItem.Qty : 0));
  }, 0);

  return (
    <ScreenTemplate title="Purchase Details">
      <SafeAreaView style={{ flex: 1, width: '100%', justifyContent: 'flex-start', backgroundColor: '#EBEAEF', paddingVertical: 16 }}>
        {feeds.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 48 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>No Items Found</Text>
          </View>
        ) : (
          <FlatList
            data={feeds}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const purchaseItem = purchaseItems.find(purchase => purchase.item_id === item._id);
              return (
                <View className="flex-row px-6 w-full items-center my-1">
                  <View className="bg-white rounded-xl flex items-center justify-center p-2 w-16 h-16 relative">
                    <Image
                      source={{ uri: item?.mainImage?.asset?.url }}
                      resizeMode="cover"
                      className="w-full h-full opacity-30"
                    />
                    <View className="inset-0 absolute flex items-center justify-center">
                      <Image
                        source={{ uri: item?.mainImage?.asset?.url }}
                        resizeMode="contain"
                        className="w-12 h-12"
                      />
                    </View>
                  </View>

                  <View className="flex  space-y-2 ml-3 flex-1">
                    <View className="flex items-start justify-center">
                      <Text className="text-lg font-semibold text-[#555]">
                        {item?.title}
                      </Text>
                      <Text className="text-sm font-semibold text-[#777]">
                        {item?.shortDescription}
                      </Text>
                      <Text className="text-lg font-bold text-black">
                        RM {item?.price}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-center space-x-2 rounded-xl border border-gray-300 px-2 py-1 ml-auto">
                    <Text className="text-md font-bold text-black">Qty: {purchaseItem?.Qty}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
        <View style={{ paddingHorizontal: 16, width: '100%', marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>Subtotal</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>RM {subtotal.toFixed(2)}</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScreenTemplate>
  );
};

export default PurchaseDetails;
