import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ScreenTemplate = ({ title, children }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 w-full items-start justify-start bg-[#EBEAEF] space-y-1">
      <View className="flex-row items-center justify-between w-full px-4 py-12">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={32} color={"#555"} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', marginLeft: -26 }}>
          <Text className="text-xl font-semibold text-[#555]">
            {title}
          </Text>
        </View>

        {/* <View className="w-10 h-10 rounded-xl bg-white flex items-center justify-center relative">
          {/* Optional Right Icon or other content */}
        {/* </View> */}
      </View>
      
      <ScrollView className="w-full flex-1">
        <View className="flex space-y-4 px-4">
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenTemplate;
