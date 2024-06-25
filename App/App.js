import React, { useEffect, useState } from "react";

import { View, Text } from 'react-native'
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux"
import 'react-native-url-polyfill/auto';

import { Upload, HomeScreen, OnBoardingScreen,ProductScreen,CartScreen,ConfirmCheckout,AuthScreen, AddItem,Upload2,Main,Likes,Listings,Profile,EditItem,Purchases,PurchaseDetails} from './screens';
import { BottomTab } from './components';

import store from './context/store';

const Stack = createNativeStackNavigator();

const MyComponent = ({ setActiveScreen }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const currentScreen = navigation.getCurrentRoute().name;
      setActiveScreen(currentScreen);
      console.log("Active Screen : ", currentScreen);
    });

    return unsubscribe;
  }, [navigation]);
};

const App = () => {
  const [activeScreen, setActiveScreen] = useState("");
  return (
    
    <NavigationContainer>
       <MyComponent setActiveScreen={setActiveScreen} />
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Upload" component={Upload} /> */}
          {/* <Stack.Screen name="Upload2" component={Upload2} /> */}
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Listings" component={Listings} />
          <Stack.Screen name="Likes" component={Likes} />
          <Stack.Screen name="Purchases" component={Purchases} />
          <Stack.Screen name="PurchaseDetails" component={PurchaseDetails} />
          <Stack.Screen name="EditItem" component={EditItem} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="AddItem" component={AddItem} />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="ConfirmCheckout" component={ConfirmCheckout} />
        </Stack.Navigator>
      </Provider>
      {activeScreen !== "OnBoarding" && activeScreen !== "AuthScreen" && (
    <BottomTab activeScreen={activeScreen} />
  )}
    </NavigationContainer>
  )
}

export default App