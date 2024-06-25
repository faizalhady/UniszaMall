import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';

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

const Filter = ({ onFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (value) => {
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(category => category !== value)
        : [...prev, value]
    );
  };

  const applyFilter = () => {
    onFilter(selectedCategories);
  };

  return (
    <View className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 p-4 rounded-xl">
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
      <TouchableOpacity onPress={applyFilter} className="mt-4 p-2 bg-orange-500 rounded-xl">
        <Text className="text-white text-center">Apply Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Filter;
