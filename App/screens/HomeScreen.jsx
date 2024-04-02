import React, { useEffect, useState } from 'react'

import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { fetchFeeds } from "../sanity";
import { Screen3 } from '../assets'
import {useDispatch, useSelector } from 'react-redux';
import { SET_FEEDS } from "../context/actions/feedsActions";

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const feeds = useSelector((state) => state.feeds);
  const dispatch = useDispatch();

  const handleSearchTerm = (text) => {
    setSearchTerm(text);
    // setFiltered(feeds?.feeds.filter((item) => item.title.includes(text)));s
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchFeeds().then((res) => {
        // console.log(res);
        dispatch(SET_FEEDS(res));
        console.log("Feeds from Store : ", feeds.feeds);
        setInterval(() => {
          setIsLoading(false);
        }, 2000);
      });
    } catch (error) {
      console.log(error);
      // setIsLoading(false);
    }
  }, []);


  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-[#EBEAEF]">
      <View className="w-full flex-row items-center justify-between px-4 py-12">
        <MaterialIcons name="chevron-left" size={32} color="#555" />

        <Image
          source={Screen3}
          className="w-12 h-12 rounded-xl"
          resizeMode="cover"
        />
      </View>

      <View className="flex-row items-center justify-between px-4 py-2 w-full space-x-6">
      {/* ########################################### Search Bar########################################### */}
        <View className="px-4 py-2 bg-white rounded-xl flex-1 flex-row items-center justify-center space-x-2">
          <MaterialIcons name="search" size={24} color="#7f7f7f" />
          <TextInput
            className="text-base font-semibold text=[#555] flex-1 py-1 -mt-1 "
            placeholder="Search Here..."
            value={searchTerm}
            onChangeText={handleSearchTerm}
          />
        </View>
      {/* ########################################### FIler button########################################### */}
        <TouchableOpacity className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
          <FontAwesome name="filter" size={24} color="#7f7f7f" />
        </TouchableOpacity>
      </View>
      {/* ###################################################################################### */}
      {/* ##################################### Scrollable View / Sanity Items################################################# */}
      <ScrollView className="flex1 w-full">
        {isLoading ? (
          <View className="flex-1 h-80 items-center justify-center">
            <ActivityIndicator size={"large"} color={"teal"} />
          </View>
        ) : (
          <></>
        ) }
      </ScrollView>

      {/* ###################################################################################### */}


    </SafeAreaView >
  )
}

export default HomeScreen