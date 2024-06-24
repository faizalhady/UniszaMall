import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addItem } from '../sanity';

function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    productType: '',
    mainImage: null,
    bgImage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);
    try {
        const response = await fetch(uri);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const blob = await response.blob();

        const uploadUrl = 'YOUR_UPLOAD_ENDPOINT'; // Make sure this is correct
        const formData = new FormData();
        formData.append('file', blob, uri.split('/').pop());

        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const result = await uploadResponse.json(); // Adjust according to server response
        setIsLoading(false);
        return result;
    } catch (error) {
        console.error("Failed to upload image:", error);
        setIsLoading(false);
        setIsError(true);
        Alert.alert("Upload Failed", `Error: ${error.message}`);
        return null;
    }
};


  const handleImageUpload = async (field) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) {
      return;
    }

    const asset = await uploadImage(pickerResult.uri);
    if (asset) {
      setFormData({ ...formData, [field]: pickerResult.uri });
      Alert.alert("Success", "Image uploaded successfully!");
    } else {
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let mainImageAsset = null;
    let bgImageAsset = null;

    if (formData.mainImage) {
      const uploadedMainImage = await uploadImage(formData.mainImage);
      if (uploadedMainImage) {
        mainImageAsset = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedMainImage._id
          }
        };
      }
    }

    if (formData.bgImage) {
      const uploadedBgImage = await uploadImage(formData.bgImage);
      if (uploadedBgImage) {
        bgImageAsset = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedBgImage._id
          }
        };
      }
    }

    const formattedData = {
      _type: 'products',
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      price: parseFloat(formData.price),
      productType: formData.productType,
      mainImage: mainImageAsset,
      bgImage: bgImageAsset
    };

    try {
      await addItem(formattedData);
      Alert.alert("Success", "Product uploaded successfully!");
    } catch (error) {
      console.error('Failed to upload product:', error);
      Alert.alert("Upload Failed", `Failed to upload product: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EBEAEF]">
      <ScrollView className="p-4 space-y-4">
        <TextInput
          className="mt-1 p-2 bg-white border border-gray-300 rounded-md text-gray-800"
          onChangeText={text => handleChange('title', text)}
          value={formData.title}
          placeholder="Enter the title"
        />

        <TextInput
          className="mt-1 p-2 bg-white border border-gray-300 rounded-md text-gray-800"
          onChangeText={text => handleChange('description', text)}
          value={formData.description}
          placeholder="Enter a full description"
          multiline
        />

        <TextInput
          className="mt-1 p-2 bg-white border border-gray-300 rounded-md text-gray-800"
          onChangeText={text => handleChange('shortDescription', text)}
          value={formData.shortDescription}
          placeholder="Enter a short description"
          multiline
        />

        <TextInput
          className="mt-1 p-2 bg-white border border-gray-300 rounded-md text-gray-800"
          onChangeText={text => handleChange('price', text)}
          value={formData.price}
          placeholder="Enter the price"
          keyboardType="numeric"
        />

        <TouchableOpacity
          className="p-2 rounded-md flex-row items-center justify-center bg-gray-300"
          onPress={() => handleImageUpload('mainImage')}>
          <Text className="text-white">
            {formData.mainImage ? "Change Main Image" : "Upload Main Image"}
          </Text>
          {formData.mainImage && <Image source={{ uri: formData.mainImage }} style={{ width: 100, height: 100 }} />}
        </TouchableOpacity>

        <TouchableOpacity
          className="p-2 rounded-md flex-row items-center justify-center bg-gray-300"
          onPress={() => handleImageUpload('bgImage')}>
          <Text className="text-white">
            {formData.bgImage ? "Change Background Image" : "Upload Background Image"}
          </Text>
          {formData.bgImage && <Image source={{ uri: formData.bgImage }} style={{ width: 100, height: 100 }} />}
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-teal-500 p-3 rounded-md items-center"
          onPress={handleSubmit}>
          <Text className="text-white font-semibold">Submit Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Upload;
