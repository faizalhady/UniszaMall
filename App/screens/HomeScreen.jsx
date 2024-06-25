import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { fetchFeeds } from "../sanity";
import { useDispatch, useSelector } from 'react-redux';
import { SET_FEEDS } from "../context/actions/feedsActions";
import Feeds from '../components/Feeds';  // Ensure the import path is correct
import RFeeds from '../components/RFeeds';  // Ensure the import path is correct
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import axios from '../AxiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, ScrollView as GestureScrollView } from 'react-native-gesture-handler';

const categories = [
  { label: 'Stationery & Supplies', value: 'stationery' },
  { label: 'Electronics & Gadgets', value: 'electronics' },
  { label: 'Books & Study Materials', value: 'books' },
  { label: 'Bags & Accessories', value: 'bags' },
  { label: 'Health & Wellness', value: 'health' },
  { label: 'Home & Living', value: 'home' },
  { label: 'Food & Beverages', value: 'food' },
  { label: 'Clothing & Apparel', value: 'clothing' },
];

const HomeScreen = ({ activeScreen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highestRecommendFeeds, setHighestRecommendFeeds] = useState([]);
  const [showRFeeds, setShowRFeeds] = useState(true); // State to control visibility of RFeeds
  const feeds = useSelector((state) => state.feeds);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSearchTerm = (text) => {
    setSearchTerm(text);
    filterFeeds(selectedCategories, text);
  };

  const handleCategoryFilter = () => {
    console.log('Feeds before filtering:', feeds?.feeds);
    filterFeeds(selectedCategories, searchTerm);
    setShowDropdown(false); // Close the dropdown after selection
  };

  const filterFeeds = (categories, searchTerm) => {
    let filteredFeeds = feeds?.feeds || [];
    if (categories.length > 0) {
      filteredFeeds = filteredFeeds.filter((item) =>
        item.categories && categories.some(category => item.categories.includes(category))
      );
    }
    if (searchTerm) {
      filteredFeeds = filteredFeeds.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log('Feeds after filtering:', filteredFeeds);
    setFiltered(filteredFeeds);
  };

  const toggleCategory = (value) => {
    const newSelectedCategories = selectedCategories.includes(value)
      ? selectedCategories.filter((category) => category !== value)
      : [...selectedCategories, value];
    setSelectedCategories(newSelectedCategories);
    filterFeeds(newSelectedCategories, searchTerm);
  };

  const loadFeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchFeeds();
      dispatch(SET_FEEDS(res));
      setFiltered(res); // Set initial filtered feeds
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

  useEffect(() => {
    const fetchHighestRecommend = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Adjust based on how you store the token
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('/highest-recommend', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const highestCategory = response.data.maxColumn;
        console.log('Highest recommend category:', highestCategory);
        if (highestCategory) {
          const recommendedFeeds = feeds?.feeds.filter((item) =>
            item.categories && item.categories.includes(highestCategory)
          );
          setHighestRecommendFeeds(recommendedFeeds);
        }
      } catch (error) {
        console.error('Error fetching highest recommend category:', error.response ? error.response.data : error.message);
      }
    };

    fetchHighestRecommend();
  }, [feeds]);

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

  const windowWidth = Dimensions.get('window').width;

  const handleScroll = () => {
    // Hide the swipeable view
    setShowRFeeds(false);
  };

  const handleScrollEnd = (event) => {
    // Show the swipeable view only if the user has scrolled back to the top
    if (event.nativeEvent.contentOffset.y === 0) {
      setShowRFeeds(true);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
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
          {/* Search Bar */}
          <View className="px-4 py-2 bg-white rounded-xl flex-1 flex-row items-center justify-center space-x-2">
            <MaterialIcons name="search" size={24} color="#7f7f7f" />
            <TextInput
              className="text-base font-semibold text=[#555] flex-1 py-1 -mt-1"
              placeholder="Search Here..."
              value={searchTerm}
              onChangeText={handleSearchTerm}
            />
          </View>

          {/* Category Dropdown */}
          <View className="relative">
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
              <FontAwesome name="filter" size={24} color="#7f7f7f" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Modal */}
        <Modal
          transparent={true}
          visible={showDropdown}
          animationType="slide"
          onRequestClose={() => setShowDropdown(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-4 rounded-xl w-72">
              <ScrollView className="max-h-60">
                {categories.map(category => (
                  <View key={category.value} className="flex-row items-center justify-between mb-2">
                    <Text className="text-base">{category.label}</Text>
                    <Checkbox
                      value={selectedCategories.includes(category.value)}
                      onValueChange={() => toggleCategory(category.value)}
                    />
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={handleCategoryFilter} className="mt-4 p-2 bg-orange-500 rounded-xl">
                <Text className="text-white text-center">Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Swipeable View */}
        {showRFeeds && searchTerm === "" && (
          <View style={{ height: 110, marginVertical: 10 }}>
            <Text style={{ fontSize: 11, textAlign: 'center', marginTop: 5 }}>Recommended for you</Text>
            <GestureScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
              {highestRecommendFeeds.map((item, index) => (
                <View key={index} style={{ width: 100, height: 100, marginRight: 10 }}>
                  <RFeeds
                    feeds={[item]}
                    onPress={(categories) => {
                      console.log('Feed item clicked:', item); // Debug log to ensure the click event
                      navigation.navigate("ProductScreen", { _id: item._id });
                    }}
                  />
                </View>
              ))}
            </GestureScrollView>
          </View>
        )}

        {/* Scrollable View / Sanity Items */}
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ paddingBottom: 120 }}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
        >
          {isLoading ? (
            <View className="flex-1 h-80 items-center justify-center">
              <ActivityIndicator size={"large"} color={"teal"} />
            </View>
          ) : (
            <Feeds
              feeds={filtered || feeds?.feeds}
              // onPress={handleProductClick}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
