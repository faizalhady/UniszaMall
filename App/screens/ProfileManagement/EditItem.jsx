import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ScreenTemplate from '../../components/ScreenTemplate';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@sanity/client';
import { updateItem } from '../../sanity';

const EditItem = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params; // Get the passed item data

  const feeds = useSelector((state) => state.feeds.feeds);
  const [data, setData] = useState(item);
  const [selectedImage, setSelectedImage] = useState(item?.mainImage?.asset?.url || '');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the URI of the selected image
      setData({ ...data, mainImage: { asset: { url: result.assets[0].uri } } });
    }
  };

  const uploadImageToSanity = async (image) => {
    try {
      const blob = await fetch(image.uri);
      const blobData = await blob.blob();

      const client = createClient({
        projectId: 'iv5jyn1g',
        dataset: 'production',
        apiVersion: '2024-04-02',
        useCdn: true,
        token: 'sk3TdoUk03Ay0AIhsnb8rNOrauIXvZIoeyMvy3UuA0I7U3eIFBsnw6pmbuS9QcfuIHnJEDoQ1hUilttO51kAVGmtdzNRYmfV82JUKmT9h2uWbKxEbL9ypsZk651qtSThnsMShmIbu8RFO3ThNal1eLzyJC2Oj0CR3tDc2J91iPdru26CIzIJ',
      });

      const uploadedAsset = await client.assets.upload('image', blobData);

      return uploadedAsset;
    } catch (error) {
      console.error('Error uploading image to Sanity.io:', error);
      throw new Error('Failed to upload image to Sanity.io. Please try again later.');
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      let uploadedImage;
      if (selectedImage !== item?.mainImage?.asset?.url) {
        uploadedImage = await uploadImageToSanity({ uri: selectedImage });
      }

      const updatedData = {
        ...data,
        mainImage: uploadedImage ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImage._id,
          },
        } : data.mainImage,
      };

      await updateItem(data._id, updatedData);
      Alert.alert('Success', 'Changes saved successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again later.');
    }
    setIsLoading(false);
  };

  return (
    <ScreenTemplate title="Edit Item">
      <ScrollView className="px-4 pb-40" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-4">
          <Text className="text-base text-black font-medium">Image</Text>
          <TouchableOpacity onPress={pickImage} className="mt-2">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '100%', height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View className="mt-4">
          <Text className="text-base text-black font-medium">Title</Text>
          <TextInput
            value={data?.title || ''}
            placeholder="Add title here..."
            onChangeText={(e) => setData({ ...data, title: e })}
            className="mt-2 p-4 bg-gray-100 rounded-2xl border-2 border-gray-200"
          />
        </View>
        <View className="mt-4">
          <Text className="text-base text-black font-medium">Description</Text>
          <TextInput
            value={data?.description || ''}
            placeholder="Add description here..."
            onChangeText={(e) => setData({ ...data, description: e })}
            className="mt-2 p-4 bg-gray-100 rounded-2xl border-2 border-gray-200"
          />
        </View>
        <View className="mt-4">
          <Text className="text-base text-black font-medium">Price</Text>
          <TextInput
            value={data?.price ? data.price.toString() : ''}
            placeholder="Enter price"
            onChangeText={(e) => setData({ ...data, price: e })}
            className="mt-2 p-4 bg-gray-100 rounded-2xl border-2 border-gray-200"
          />
        </View>
        <View className="mt-7 space-y-2">
          <TouchableOpacity onPress={handleSaveChanges} className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md">
            <Text className="text-base text-white font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

export default EditItem;
