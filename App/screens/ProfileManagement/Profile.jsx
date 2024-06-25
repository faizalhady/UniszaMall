import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, Platform, ScrollView, StyleSheet } from 'react-native';
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
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
      }
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
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profilePicture || oldProfilePicture || 'https://path.to.default/image.png' }} style={styles.profilePicture} />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        
        <Text>Current Username: {username}</Text>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={handleUsernameChange}
          placeholder="New Username"
        />

       
        <View style={styles.passwordContainer} className="flex-row items-center">
      <TextInput
        className="flex-1 p-2 border border-gray-300 rounded"
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
          className="ml-2 -mt-1" // Adjusted margin top
        />
      )}
    </View>

        {isOldPasswordValid && (
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            placeholder="New Password"
            secureTextEntry
          />
        )}

        <Button title="Save Changes" onPress={handleSaveChanges} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 90,
    backgroundColor: "#fff",
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00bfa5',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputWithIcon: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  addImageBtn: {
    backgroundColor: "#00bfa5",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  addImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignSelf: "center",
  },
  message: {
    color: 'green',
    textAlign: 'center',
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginLeft: 10,
  },
});

export default Profile;
