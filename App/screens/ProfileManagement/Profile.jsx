import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from '../../AxiosConfig'; // Import the configured axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // For managing storage in React Native
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenTemplate from '../../components/ScreenTemplate';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [oldProfilePicture, setOldProfilePicture] = useState(''); // New state for the old profile picture
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(null); // null indicates no input yet
  const [message, setMessage] = useState('');

  // State to track changes
  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isProfilePictureChanged, setIsProfilePictureChanged] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userResponse = await axios.get('/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUsername(userResponse.data.Username);

          const pictureResponse = await axios.get('/user/profile-picture', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setOldProfilePicture(pictureResponse.data.profile_picture || ''); // Set the old profile picture, handle null or empty string
        }
      } catch (error) {
        console.error('There was an error fetching the user data!', error);
      }
    };

    fetchUserInfo();
    requestPermission(); // Request permission when component mounts
  }, []);

  const requestPermission = async () => {
    
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
      }
    
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri); // Set the URI
      setIsProfilePictureChanged(true); // Mark profile picture as changed
    }
  };

  const handleUsernameChange = (text) => {
    setNewUsername(text);
    setIsUsernameChanged(true);
  };

  const handleOldPasswordChange = async (text) => {
    setOldPassword(text);
    setIsPasswordChanged(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.post('/user/check-password', { oldPassword: text }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsOldPasswordValid(response.data.valid);
      }
    } catch (error) {
      setIsOldPasswordValid(false);
    }
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      if (isUsernameChanged) {
        await axios.put('/user/username', { newUsername }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (isPasswordChanged && isOldPasswordValid) {
        await axios.put('/user/password', { oldPassword, newPassword }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (isProfilePictureChanged) {
        await axios.put('/user/upload-profile-picture', { profilePicture }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setMessage('Changes saved successfully');
      setIsUsernameChanged(false);
      setIsPasswordChanged(false);
      setIsProfilePictureChanged(false);
    } catch (error) {
      setMessage('Error saving changes');
      console.error('There was an error saving the changes!', error);
    }
  };

  return (
    <ScreenTemplate title="Profile">
      <ScrollView className="px-4 pb-40" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex items-center my-4">
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: profilePicture || oldProfilePicture || 'https://path.to.default/image.png' }} className="w-32 h-32 rounded-full border-2 border-[#00bfa5]" />
          </TouchableOpacity>
        </View>
        
        <View className="my-4">
          <Text className="text-base text-black font-medium">Current Username: {username}</Text>
          <TextInput
            className="w-full h-12 border border-gray-300 rounded p-2 mt-2"
            value={newUsername}
            onChangeText={handleUsernameChange}
            placeholder="New Username"
          />
        </View>

        <View className="my-4">
          <Text className="text-base text-black font-medium">Old Password</Text>
          <View className="flex-row items-center mt-2">
            <TextInput
              className="flex-1 h-12 border border-gray-300 rounded p-2"
              value={oldPassword}
              onChangeText={handleOldPasswordChange}
              placeholder="Insert Old Password"
              secureTextEntry
            />
            {isOldPasswordValid !== null && (
              <Icon
                name={isOldPasswordValid ? "check" : "close"}
                size={20}
                color={isOldPasswordValid ? "green" : "red"}
                className="ml-2"
              />
            )}
          </View>
        </View>

        {isOldPasswordValid && (
          <View className="my-4">
            <Text className="text-base text-black font-medium">New Password</Text>
            <TextInput
              className="w-full h-12 border border-gray-300 rounded p-2 mt-2"
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              placeholder="New Password"
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleSaveChanges}
          className="w-full h-12 bg-orange-500 rounded-2xl justify-center items-center shadow-md mt-6"
        >
          <Text className="text-base text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>
        {message ? <Text className="text-center text-green-500 mt-4">{message}</Text> : null}
      </ScrollView>
    </ScreenTemplate>
  );
};

export default Profile;
