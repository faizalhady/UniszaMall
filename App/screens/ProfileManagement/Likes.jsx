import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator,Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from '../../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenTemplate from '../../components/ScreenTemplate';
import { fetchFeeds } from '../../sanity';
import FeedItemCard from '../../components/FeedItemCard';

const Likes = () => {
  const navigation = useNavigation();
  const [likedItems, setLikedItems] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('/likes', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLikedItems(response.data);
        }
      } catch (error) {
        console.error('Error fetching liked items:', error);
      }
    };

    const fetchAndFilterFeeds = async () => {
      try {
        const allFeeds = await fetchFeeds();
        const filteredFeeds = allFeeds.filter(feed => likedItems.includes(feed._id));
        setFeeds(filteredFeeds);
      } catch (error) {
        console.error('Error fetching and filtering feeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedItems().then(fetchAndFilterFeeds);
  }, [likedItems]);
  
  const handleDeleteFeed = async (_id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.delete(`/like-delete/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeeds(feeds.filter(feed => feed._id !== _id));
        Alert.alert('Success', 'Item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting feed item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScreenTemplate title="Likes">
      <View style={{ width: '100%', flex: 1 }}>
        {feeds.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 48 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#555' }}>No Liked Items Found</Text>
          </View>
        ) : (
          <FlatList
            data={feeds}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <FeedItemCard item={item} onDelete={handleDeleteFeed} />}
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

export default Likes;
