import React, { useEffect } from 'react';
// ##################################
import { View, Text, Image } from 'react-native';
import Swiper from "react-native-swiper";
import AsyncStorage from '@react-native-async-storage/async-storage';
// ############################################
import { Screen1, Screen2, Screen3, Logo } from '../assets';

import { useNavigation } from '@react-navigation/native';

const OnBoardingScreen = () => {

    const navigation = useNavigation();

    // useEffect(()=>{
    //     const checkOnboardingStatus = async () => {
    //         const value = await AsyncStorage.getItem("@onboarding_complete");
    //         if (value !== null && value === "true"){
    //             navigation.replace("Home");
    //         }
    //     }
    //     checkOnboardingStatus();
    // },[])

    const handleOnboardingComplete = async (e) => {
        console.log('Triggered :', e);
        if (e === 2) {
            try {
                await AsyncStorage.setItem("@onboarding_complete", "true");
                navigation.navigate('Home')
            } catch (error) {
                console.log("error OnBoarding : ", error);
            }

        }
    }

    return (
        <View className=" flex-1 items-center justify-center bg-white">
            <Swiper onIndexChanged={handleOnboardingComplete}>
                <ScreenOne />
                <ScreenTwo />
                <ScreenThree />
            </Swiper>
        </View>
    )
}


export const ScreenOne = () => {
    return (
        <View className=" flex-1 items-center justify-center relative bg-yellow-200">
        <View className=" flex-1 items-center justify-center relative">
        <Image source={Logo} className="w-100 h-100" resizeMode='contain' />
        </View>    
        </View>
    );
};
export const ScreenTwo = () => {
    return (
        <View className=" flex-1 space-y-6 items-center justify-start  bg-green-200">
            <Image source={Logo} className="w-200 h-[65%]" resizeMode="contain" />
            <View className="flex items-center justify-center px-6 space-y-6">
                <Text className="text-2xl tracking-wider text-[#555]">
                    Find What You Need Here
                </Text>
                <Text className="text-xl tracking-wider text-[#777] text-center">
                    Best E-Shopping Platform for Unisza Students
                </Text>
            </View>
        </View>
    );
};
export const ScreenThree = () => {
    return (
        <View className=" flex-1 space-y-6 items-center justify-start  bg-violet-300">
            <Image source={Logo} className="w-200 h-[65%]" resizeMode="contain" />
            <View className="flex items-center justify-center px-6 space-y-6">
                <Text className="text-2xl tracking-wider text-[#555]">
                Find What You Need Here
                </Text>
                <Text className="text-xl tracking-wider text-[#777] text-center">
                Best E-Shopping Platform for Unisza Students
                </Text>
            </View>
        </View>
    );
};

export default OnBoardingScreen