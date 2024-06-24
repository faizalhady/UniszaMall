import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../AxiosConfig';

const ipAddress = require('../../backend/ip')
const AuthScreen = ({ navigation }) => {

    // const [login, setLogin] = useState([])
    // useEffect(()=> {
    //     axios.get('http://172.20.105.183:8082/')
    //     .then(res => setLogin(res.data))
    //     .catch(res => console.log(err));
    // }, [])


    const SigninComponent = () => {
    // #####################################################################
     
    const [values, setValues] = useState({
            Username: '',
            Password: ''
        });

        const handleSubmit = () => {
            if (!values.Username || !values.Password) {
              Alert.alert('Error', 'Please fill in all fields.');
              return;
            }
        
            axios.post('/login', values)
              .then(async res => {
                if (res.data.Status === 'Success') {
                  const { token } = res.data;
                  await AsyncStorage.setItem('token', token);
                  Alert.alert('Login Successful', 'You are now logged in.');
                  navigation.navigate('OnBoarding');
                } else if (res.data.Status === 'Failure') {
                  Alert.alert('Login Failed', res.data.Message);
                } else {
                  Alert.alert('Error', 'Unexpected response from server.');
                }
              })
              .catch(err => {
                console.error(err);
                Alert.alert('Network Error', 'Something went wrong. Please try again.');
              });
          };
          
    // #####################################################################

        return (
            <View
                style={styles.formContainer}>

                {/* Email input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="mail" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        onChangeText={(text) => setValues({ ...values, Username: text })}
                        placeholder='Username'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Password input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="lock" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        onChangeText={text => setValues({ ...values, Password: text })}
                        placeholder='Password'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Sign in Button */}
                <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                    <Text style={styles.ButtonText}>SIGN IN</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const SignupComponent = () => {

        // #################################################################    
        const [values, setValues] = useState({
            Username: '',
            Email: '',
            Password: ''
        });

        const trySubmit = () => {
            if (!values.Username || !values.Email || !values.Password) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }
            axios.post('http://172.20.105.130/Signup', values)
                .then(res => {
                    console.log(res.data);
                    if (res.data.Status === "Success") {
                        Alert.alert('Registration Successful', 'You can now log in.');
                        // Pass the username to the Ques1 screen
                        //   navigate.navigate('ques1', { username: values.name });
                    } else {
                        Alert.alert('Error', 'Registration faizled. Please try again.');
                    }
                })
                .catch(err => {
                    console.log(err);
                    Alert.alert('Error', 'Something went wrong. Please try again.');
                });
        };

        // #####################################################################
        return (
            <View style={styles.formContainer}>

                {/* Full name input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="user" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        onChangeText={text => setValues({ ...values, Username: text })}
                        placeholder='Username'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Email input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="mail" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        onChangeText={text => setValues({ ...values, Email: text })}
                        placeholder='Email'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Password input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="lock" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        onChangeText={text => setValues({ ...values, Password: text })}
                        placeholder='Password'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Re-enter Password input */}
                <View style={styles.TextInputContainer}>
                    <AntDesign name="lock" size={24} style={styles.TextInputIcon} />
                    <TextInput
                        placeholder='Re-enter Password'
                        style={styles.TextInputText}
                    />
                </View>

                {/* Sign in Button */}
                <TouchableOpacity style={styles.Button} onPress={trySubmit}>
                    <Text style={styles.ButtonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={styles.container}>

            {/* Replace this with your app logo */}
            <View style={{ flexDirection: 'row', }}><Text style={{ fontSize: 32, fontWeight: 800 }}>Unisza</Text><Text style={{ fontSize: 32, fontWeight: 800, color: '#FF9900' }}>Mall.</Text></View>

            {/* Tab navigation between login and signup forms */}
            <View style={{ flex: 1, marginTop: 30 }}>
                <NavigationContainer independent={true}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarActiveTintColor: 'black',
                            tabBarIndicatorStyle: { backgroundColor: '#000000' },
                            animationEnabled: false,
                        }}
                    >
                        <Tab.Screen name='Sign in' component={SigninComponent} />
                        <Tab.Screen name='Sign up' component={SignupComponent} />
                    </Tab.Navigator>
                </NavigationContainer>
            </View>

            { /* Button to signin as guest */}
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.TextButton}>Sign in as a Guest</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },

    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    TextInputContainer: {
        flexDirection: 'row',
        borderColor: '#c7c7c7',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 25,
        alignItems: 'center',
        padding: 5,
    },

    TextInputText: {
        marginLeft: 25,
        // width: '100%',
        // verticalAlign: 'middle'
    },

    TextInputIcon: {
        flex: 0,
        color: '#c7c7c7'
    },

    TextButton: {
        alignSelf: 'center',
        color: '#808080',
        textDecorationLine: 'underline'
    },

    Button: {
        marginTop: 25,
        backgroundColor: 'black',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },

    ButtonText: {
        color: '#fff'
    },
});

export default AuthScreen;