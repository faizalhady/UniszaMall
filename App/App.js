import React from 'react'

import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen, OnBoardingScreen } from './screens';
import { Provider } from "react-redux"

import 'react-native-url-polyfill/auto';

import store from './context/store';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  )
}

export default App