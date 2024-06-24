import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { fetchFeeds } from "../sanity";
import { ASA, Muka } from '../assets';
import { useDispatch, useSelector } from 'react-redux';
import { SET_FEEDS } from "../context/actions/feedsActions";
import { Feeds } from '../components';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import axios from '../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ activeScreen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const feeds = useSelector((state) => state.feeds);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSearchTerm = (text) => {
    setSearchTerm(text);
    setFiltered(feeds?.feeds.filter((item) => item.title.includes(text)));
  };

  const loadFeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchFeeds();
      dispatch(SET_FEEDS(res));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadFeeds();
    }, [loadFeeds])
  );

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

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            navigation.navigate('AuthScreen');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-[#EBEAEF]">
      <View className="w-full flex-row items-center justify-between px-4 py-12">
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="chevron-left" size={32} color="#555" />
        </TouchableOpacity>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            Unisza
            <Text style={{ color: '#FF9900' }}>Mall.</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <MaterialIcons
            name="shopping-cart"
            size={32}
            color="#130d2d"
          />
        </TouchableOpacity>
      </View>


      <View className="flex-row items-center justify-between px-4 py-2 w-full space-x-6">
        {/* ########################################### Search Bar ########################################### */}
        <View className="px-4 py-2 bg-white rounded-xl flex-1 flex-row items-center justify-center space-x-2">
          <MaterialIcons name="search" size={24} color="#7f7f7f" />
          <TextInput
            className="text-base font-semibold text=[#555] flex-1 py-1 -mt-1"
            placeholder="Search Here..."
            value={searchTerm}
            onChangeText={handleSearchTerm}
          />
        </View>
        {/* ########################################### Filter button ########################################### */}
        <TouchableOpacity className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
          <FontAwesome name="filter" size={24} color="#7f7f7f" />
        </TouchableOpacity>
      </View>
      {/* ##################################### Scrollable View / Sanity Items ##################################### */}
      <ScrollView className="flex1 w-full" contentContainerStyle={{ paddingBottom: 120 }}>
        {isLoading ? (
          <View className="flex-1 h-80 items-center justify-center">
            <ActivityIndicator size={"large"} color={"teal"} />
          </View>
        ) : (
          <Feeds
            feeds={filtered || (filtered?.length > 0 ? filtered : feeds?.feeds)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;
