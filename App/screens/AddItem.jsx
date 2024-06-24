import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../AxiosConfig';
import { icons } from '../constants';
import FormField from '../components/FormField';
import CategoryPicker from '../components/CategoryPicker';
import { addItem } from '../sanity';
import { createClient } from '@sanity/client';
import ScreenTemplate from '../components/ScreenTemplate';

const AddItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    mainImage: null,
    categories: '',
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/*'] : ['video/*'],
    });
    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({
          ...form,
          mainImage: result.assets[0],
        });
      }
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

  const handleSubmit = async () => {
    setIsLoading(true);
   
    try {
      if (!form.mainImage) {
        throw new Error('Please select a main image.');
      }

      const mainImageAsset = await uploadImageToSanity(form.mainImage);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please login again.');
      }

      const response = await axios.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      
      const username = response.data.Username;

      const itemData = {
        _type: 'products',
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainImageAsset._id,
          },
        },
        categories: selectedCategory,
        username: username,
      };

      await addItem(itemData);
      console.log(username);

      setForm({
        title: '',
        description: '',
        price: '',
        mainImage: null,
        categories: '',
      });

      setSelectedCategory('');
      Alert.alert('Success', 'Item uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload item. Please try again later.');
      console.error('Failed to upload item:', error);
    }

    setIsLoading(false);
  };

  return (
    <ScreenTemplate title="Add Item">
      <ScrollView className="px-4 pb-40" contentContainerStyle={{ paddingBottom: 100 }}>
        <FormField
          title="Title"
          value={form.title}
          placeholder="Add title here..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-4"
        />
        <FormField
          title="Description"
          value={form.description}
          placeholder="Add description here..."
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-4"
        />
        <FormField
          title="Price"
          value={form.price}
          placeholder="Enter price"
          handleChangeText={(e) => setForm({ ...form, price: e })}
          otherStyles="mt-4"
        />
        <CategoryPicker
          title="Category"
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <View className="mt-4 space-y-2">
          <Text className="text-base text-black font-medium">Image</Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.mainImage ? (
              <Image
                source={{ uri: form.mainImage.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-gray-100 rounded-2xl border-2 border-gray-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-black font-medium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <TouchableOpacity onPress={handleSubmit} className="w-full h-16 bg-orange-500 rounded-2xl justify-center items-center shadow-md">
            <Text className="text-base text-white font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

export default AddItem;
