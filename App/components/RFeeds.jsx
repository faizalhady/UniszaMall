import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FeedDetail } from "../components";

const RFeeds = ({ feeds, onPress }) => {
  return (
    <View className="flex-row flex-wrap items-center justify-center">
      {feeds?.length > 0 ? (
        <>
          {feeds?.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => onPress(item.categories)} style={{ margin: 5 }}>
                
              <View style={{ width: 70, height: 70 }}>
                <Image 
                  source={{ uri: item.mainImage.asset.url }} 
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                />
                <Text numberOfLines={1} style={{ fontSize: 10, textAlign: 'center', marginTop: 5 }}>
                  {item.title}
                </Text>
              </View>
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

export default RFeeds;
