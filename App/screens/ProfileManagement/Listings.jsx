import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeeds } from '../../sanity';
import { SET_FILTERED_FEEDS, DELETE_FEED } from '../../context/actions/feedsActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteItem } from '../../sanity';
import axios from '../../AxiosConfig';
import ScreenTemplate from '../../components/ScreenTemplate';
import FeedItemCard from '../../components/FeedItemCard';

const Listings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const filteredFeeds = useSelector((state) => state.feeds.filteredFeeds);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsername(response.data.Username);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const fetchFilteredFeeds = async () => {
    try {
      const allFeeds = await fetchFeeds();
      const filteredFeeds = allFeeds.filter(feed => feed.username === username);
      dispatch(SET_FILTERED_FEEDS(filteredFeeds));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching filtered feeds:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        await fetchUserInfo();
        await fetchFilteredFeeds();
      };
      initialize();
    }, [username])
  );

  const handleDeleteFeed = async (id) => {
    try {
      await deleteItem(id);
      dispatch(DELETE_FEED(id));
      Alert.alert('Success', 'Feed item deleted successfully');
    } catch (error) {
      console.error('Error deleting feed item:', error);
      Alert.alert('Error', 'Failed to delete feed item');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScreenTemplate title="Listings">
      <View className="w-full flex-1">
        {filteredFeeds.length === 0 || !filteredFeeds ? (
          <View className="flex-1 items-center py-12">
            <Text className="text-xl font-semibold text-[#555]">No Items Found</Text>
          </View>
        ) : (
          <ScrollView className="w-full flex-1">
            <View className="flex space-y-4">
              <FlatList
                data={filteredFeeds}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <FeedItemCard item={item} onDelete={handleDeleteFeed} showEdit />}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Listings;
