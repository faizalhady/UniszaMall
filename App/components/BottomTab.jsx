import { View, Text, TouchableOpacity,Image } from "react-native";
import React, { useState, useCallback, useEffect } from 'react';
import { ASA, Muka } from '../assets';

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from '../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTab = ({ activeScreen }) => {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('/user/profile-picture', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setProfilePicture(response.data.profile_picture || '');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };
    fetchProfilePicture();
  }, []);

  return (
    <View className="absolute bottom-6 w-full px-8">
      <View className="bg-[#130d2d] rounded-xl px-4 py-6 w-full flex-row items-center justify-around">
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Image
            source={profilePicture ? { uri: profilePicture } : Muka}
            className="w-10 h-10 rounded-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <MaterialIcons
            name="format-list-bulleted"
            size={32}
            color="#5C5576"
          />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome
            name="home"
            size={32}
            color={activeScreen === "Home" ? "#FC900E" : "#fbfbfb"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Likes")}>
        <AntDesign name="heart" size={29} color={activeScreen === "Likes" ? "#FC900E" : "#fbfbfb"} />
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <MaterialIcons
            name="shopping-cart"
            size={32}
            color={activeScreen === "CartScreen" ? "#FC900E" : "#fbfbfb"}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate("AddItem")}>
        <AntDesign 
        name="plus" 
        size={32}
        color={activeScreen === "AddItem" ? "#FC900E" : "#fbfbfb"}
        />
           
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTab;