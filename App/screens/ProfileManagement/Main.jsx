import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from '../../components/ScreenTemplate';

const Main = () => {
  const navigation = useNavigation();

  return (
    <ScreenTemplate title="Menu">
      <View className="flex-1 justify-center items-center px-5">
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md mb-4"
        >
          <Text className="text-base text-white font-semibold">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Likes')}
          className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md mb-4"
        >
          <Text className="text-base text-white font-semibold">Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Listings')}
          className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md mb-4"
        >
          <Text className="text-base text-white font-semibold">Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Purchases')}
          className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md mb-4"
        >
          <Text className="text-base text-white font-semibold">Purchases</Text>
        </TouchableOpacity>
      </View>
    </ScreenTemplate>
  );
};

export default Main;
