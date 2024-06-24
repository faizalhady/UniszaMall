import React from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from '../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedDetail = ({ data }) => {
  const navigation = useNavigation();
  const screenWidth = Math.round(Dimensions.get("window").width);
  const cardWidth = screenWidth / 2 - 20;

  const handleClick = () => {
    navigation.navigate("ProductScreen", { _id: data?._id });
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

  return (
    <TouchableOpacity
      onPress={handleClick}
      className="p-4 m-2 rounded-xl bg-white flex items-center justify-center"
      style={{ width: cardWidth }}
    >
      <Image
        source={{ uri: data?.mainImage?.asset?.url }}
        resizeMode="contain"
        className="w-32 h-52"
      />

      <View className="flex items-start justify-start space-y-1 w-full">
        <Text className="text-base font-semibold text-[#555]">
          {data?.title}
        </Text>
        <Text className="text-sm text-[#777]">{data?.description}</Text>
      </View>

      <View className="flex-row items-center justify-between space-y-1 w-full">
        <Text className="text-base font-semibold text-[#555]">
          RM {data?.price}
        </Text>

        <TouchableOpacity
          className="bg-black w-8 h-8 rounded-full flex items-center justify-center"
          onPress={() => handleLikeItem(data._id)}
        >
          <AntDesign name="heart" size={16} color={"#fbfbfb"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FeedDetail;
