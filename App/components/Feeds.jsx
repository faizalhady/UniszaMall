import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { FeedDetail } from "../components";

const Feeds = ({ feeds, onPress }) => {
  return (
    <View className="flex-row flex-wrap items-center justify-center ">
      {feeds?.length > 0 ? (
        <>
          {feeds?.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => {
              console.log('Feed item clicked:', item); // Debug log to ensure the click event
              onPress(item.categories);
            }}>
              <FeedDetail data={item} />
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View className="w-full h-64 flex items-center justify-center py-5">
          <ActivityIndicator size={"large"} color={"teal"} />
          <Text>No Items Found</Text>
        </View>
      )}
    </View>
  );
};

export default Feeds;
