import React from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FeedItemCard = ({ item, onDelete, showEdit }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16, width: '100%', alignItems: 'center', marginVertical: 8 }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProductScreen', { _id: item?._id })}
        style={{ backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', padding: 8, width: 64, height: 64, position: 'relative' }}
      >
        <Image
          source={{ uri: item?.bgImage?.asset?.url }}
          resizeMode="cover"
          style={{ width: '100%', height: '100%', opacity: 0.3, borderRadius: 10 }}
        />
        <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: item?.mainImage?.asset?.url }}
            resizeMode="contain"
            style={{ width: 48, height: 48 }}
          />
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#555' }}>
          {item?.title}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#777' }}>
          {item?.description}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>
          RM {item?.price}
        </Text>
      </View>

      {showEdit && (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditItem', { item })}
          style={{ backgroundColor: 'blue', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}
        >
          <Feather name="edit" size={16} color={"#fbfbfb"} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => onDelete(item._id)}
        style={{ backgroundColor: 'red', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
      >
        <Entypo name="trash" size={16} color={"#fbfbfb"} />
      </TouchableOpacity>
    </View>
  );
};

export default FeedItemCard;
