import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addtocart } from "../context/actions/cartActions"; // Ensure you have addtocart action
import axios from "../AxiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductScreen = ({ route }) => {
  const { _id } = route.params;

  const feeds = useSelector((state) => state.feeds);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [qty, setQty] = useState(1);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const screenHeight = Math.round(Dimensions.get("window").height);

  const updateCategory = async (categories) => {
    console.log('Screen accessed, categories:', categories); // Debug log to check function trigger

    try {
      const token = await AsyncStorage.getItem('token'); // Adjust based on how you store the token
      console.log(`Sending request with categories: ${categories}`); // Debug log before axios call
      const response = await axios.post('/update-recommend', 
        { category: categories },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Incremented categories click count', response.data); // Debug log after successful axios call
    } catch (error) {
      console.error('Error incrementing categories click count:', error.response ? error.response.data : error.message);
    }
  };

  const handleLikeItem = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });
        const username = response.data.Username;

        await axios.post('/like', { itemId, username }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert('Success', 'Item liked successfully');
      }
    } catch (error) {
      console.error('Error liking item:', error);
      Alert.alert('Error', 'Failed to like item');
    }
  };

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
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (feeds) {
      const productData = feeds?.feeds.filter((item) => item._id === _id)[0];
      setData(productData);
      if (productData) {
        updateCategory(productData.categories); // Trigger the function when the product is loaded
      }
      fetchCartItems();
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [feeds]);

  const handleQty = (action) => {
    const newQty = qty + action;
    setQty(newQty >= 1 ? newQty : 1);
  };

  const handlePressCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.post('/cart/add', { itemId: data._id, quantity: qty }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(addtocart({ data: data, qty: qty }));
        setCartItems([...cartItems, { _id: data._id }]); // Update local state immediately
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const isItemInCart = cartItems.some(item => item._id === _id);

  return (
    <View className="flex-1 items-start justify-start bg-[#EBEAEF] space-y-4">
      {isLoading ? (
        <View className="w-full flex-1 h-full items-center justify-center ">
          <ActivityIndicator size={"large"} color={"teal"} />
        </View>
      ) : (
        <>
          <SafeAreaView className="w-full">
            {/* Top section */}
            <View className="flex-row items-center justify-between px-4 py-12 w-full">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={32} color={"#555"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("CartScreen")}
              >
                <MaterialIcons name="shopping-cart" size={32} color={"black"} />
              </TouchableOpacity>
            </View>

            {/* Image section */}
            <View
              className="w-full flex items-center justify-center relative"
              style={{ height: screenHeight / 2 }}
            >
              <View className="w-full h-full absolute top-0 left-0 flex items-center justify-center ">
                <Image
                  source={{ uri: data?.mainImage?.asset?.url }}
                  resizeMode="contain"
                  className="w-80 h-80"
                />
              </View>
            </View>
          </SafeAreaView>

          <View className="w-full flex-1 h-full bg-white rounded-t-[36px] py-6 px-12 space-y-4">
            <View className="w-full items-center justify-between flex-row">
              <View className="flex items-start justify-center">
                <Text className="text-xl font-semibold text-[#555]">
                  {data?.title}
                </Text>
                <Text className="text-sm font-semibold text-[#777]">
                  {data?.shortDescription}
                </Text>
              </View>
              <TouchableOpacity 
                className="bg-black w-8 h-8 rounded-full flex items-center justify-center"
                onPress={() => handleLikeItem(data._id)}
              >
                <AntDesign name="heart" size={16} color="#fbfbfb" />
              </TouchableOpacity>
            </View>

            {/* bottom section */}
            <View className="flex-row w-full items-center justify-between">
              <Text className="text-xl font-bold text-black">
                RM {data?.price}
              </Text>

              <View className="flex-row items-center justify-center space-x-4 rounded-xl border border-gray-200 px-4 py-1">
                <TouchableOpacity onPress={() => handleQty(-1)}>
                  <Text className="text-xl font-bold text-[#555]">-</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">{qty}</Text>
                <TouchableOpacity onPress={() => handleQty(1)}>
                  <Text className="text-xl font-bold text-[#555]">+</Text>
                </TouchableOpacity>
              </View>

              {loadingCart ? (
                <ActivityIndicator size="small" color="teal" />
              ) : (
                isItemInCart ? (
                  <TouchableOpacity className="bg-black px-4 py-2 rounded-xl">
                    <Text className="text-base font-semibold text-gray-50">
                      Added
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handlePressCart}
                    className="bg-black px-4 py-2 rounded-xl"
                  >
                    <Text className="text-base font-semibold text-gray-50">
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ProductScreen;
