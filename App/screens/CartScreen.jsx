import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from '../AxiosConfig';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFeeds } from '../sanity';

const CartScreen = () => {
  const navigation = useNavigation();
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Cart items fetched:', response.data);
        setCartItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeeds = async () => {
    try {
      const allFeeds = await fetchFeeds();
      setFeeds(allFeeds);
    } catch (error) {
      console.error('Error fetching all feeds:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAllFeeds();
  }, []);

  useEffect(() => {
    let mainTotal = 0;
    if (cartItems?.length > 0 && feeds.length > 0) {
      cartItems.forEach((cartItem) => {
        const feedItem = feeds.find(feed => feed._id === cartItem.item_id);
        if (feedItem) {
          mainTotal += feedItem.price * cartItem.Qty;
        }
      });
      setTotal(mainTotal);
    }
  }, [cartItems, feeds]);

  const handleDeleteCartItem = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.delete(`/cart/remove/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(cartItems.filter((item) => item.item_id !== itemId));
        Alert.alert('Success', 'Item removed from cart successfully');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const handleProceedToCheckout = () => {
    const shippingCost = 5.0;
    const grandTotal = total + shippingCost;
    const itemsWithPrices = cartItems.map(cartItem => {
      const feedItem = feeds.find(feed => feed._id === cartItem.item_id);
      return {
        ...cartItem,
        price: feedItem ? feedItem.price : 0
      };
    });
    navigation.navigate('ConfirmCheckout', { subtotal: total, shippingCost, grandTotal, items: itemsWithPrices });
  };

  const rightSwipeActions = () => {
    return (
      <View className="h-full w-24 flex items-center justify-center bg-white">
        <TouchableOpacity>
          <FontAwesome5 name="trash" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const CartItemCard = ({ item, Qty }) => {
    return (
      <Swipeable
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={() => handleDeleteCartItem(item._id)}
      >
        <View className="flex-row px-6 w-full items-center my-1">
          <TouchableOpacity onPress={() => navigation.navigate("ProductScreen", { _id: item._id })}>
            <View className="bg-white rounded-xl flex items-center justify-center p-2 w-16 h-16 relative">
              <Image
                source={{ uri: item?.mainImage?.asset?.url }}
                resizeMode="cover"
                className="w-full h-full opacity-30"
              />
              <View className="inset-0 absolute  flex items-center justify-center ">
                <Image
                  source={{ uri: item?.mainImage?.asset?.url }}
                  resizeMode="contain"
                  className="w-12 h-12"
                />
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex items-center space-y-2 ml-3 flex-1">
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

          <View className="flex-row items-center justify-center space-x-4 rounded-xl border border-gray-300 px-3 py-1 ml-auto">
            <Text className="text-lg font-bold text-black"> Qty : {Qty}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <GestureHandlerRootView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </GestureHandlerRootView>
    );
  }

  const getCartItemData = (itemId) => feeds.find(feed => feed._id === itemId);

  return (
    <GestureHandlerRootView className="flex-1 w-full items-start justify-start bg-[#EBEAEF] space-y-4">
      <SafeAreaView>
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={32} color={"#555"} />
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-[#555]">
            Shopping Bag
          </Text>

          <View className="w-10 h-10 rounded-xl  flex items-center justify-center relative">
            <FontAwesome5 name="shopping-bag" size={26} color="black" />
            <View className="absolute w-5 h-5 bg-orange-500 top-0 right-0 rounded-md flex items-center justify-center " >
              <Text className="text-white"  style={{ top: -2 }}>{cartItems?.length}</Text>
            </View>
          </View>
        </View>

        {cartItems.length === 0 || !cartItems ? (
          <View className="flex-1 items-center py-12">
            <Text className="text-xl font-semibold text-[#555]">Cart Is Empty</Text>
          </View>
        ) : (
          <ScrollView className="w-full flex-1">
            <View className="flex space-y-4">
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.item_id}
                renderItem={({ item }) => {
                  const feedItemData = getCartItemData(item.item_id);
                  return feedItemData ? <CartItemCard item={feedItemData} Qty={item.Qty} /> : null;
                }}
              />
            </View>

            <View className="px-8 w-full flex space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">
                  Subtotal
                </Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-xl font-semibold text-black">
                    RM {parseFloat(total).toFixed(2)}
                  </Text>
                  <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                </View>
              </View>
              <View className="w-full h-[2px] bg-white"></View>

              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">
                  Shipping Cost
                </Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-xl font-semibold text-black">
                    RM  5.0
                  </Text>
                  <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                </View>
              </View>
              <View className="w-full h-[2px] bg-white"></View>

              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">
                  Subtotal
                </Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-sm text-gray-500 mr-4">
                    ({cartItems?.length}) items
                  </Text>
                  <Text className="text-xl font-semibold text-black">
                    RM {parseFloat(total + 5.0).toFixed(2)}
                  </Text>
                  <Text className="text-sm uppercase text-gray-500">Ringgit</Text>
                </View>
              </View>
            </View>

            <View className="w-full px-8 my-4">
              <TouchableOpacity 
                className="w-full p-2 py-3 rounded-xl bg-orange-500 flex items-center justify-center"
                onPress={handleProceedToCheckout}
              >
                <Text className="text-lg text-white font-semibold">
                  Proceed to checkout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CartScreen;
