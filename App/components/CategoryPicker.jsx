import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const CategoryPicker = ({ title, selectedCategory, onCategoryChange }) => {
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
