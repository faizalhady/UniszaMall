import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const CategoryPicker = ({ title, selectedCategory, onCategoryChange }) => {
  const categories = [
    { label: 'Stationery', value: 'stationery' },
    { label: 'Laptops & Electronics', value: 'electronics' },
    { label: 'Textbooks', value: 'textbooks' },
    { label: 'Backpacks & Bags', value: 'bags' },
    { label: 'Health & Wellness Products', value: 'healthWellness' },
    { label: 'Dorm Room Essentials', value: 'dormEssentials' },
    { label: 'Snacks & Beverages', value: 'snacks' },
    { label: 'Personal Care Items', value: 'personalCare' },
    { label: 'Clothing & Accessories', value: 'clothing' },
  ];

  return (
    <View className="space-y-4 pt-4">
      <Text className="text-base text-black font-pmedium">{title}</Text>
      <TouchableOpacity className="w-full h-16 px-1 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <Picker
          selectedValue={selectedCategory}
          onValueChange={onCategoryChange}
          style={{ flex: 1, color: 'black' }} // inline styles are still needed for picker internals
          dropdownIconColor="gray" // for Android dropdown arrow color
        >
          {categories.map((category) => (
            <Picker.Item key={category.value} label={category.label} value={category.value} />
          ))}
        </Picker>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryPicker;
