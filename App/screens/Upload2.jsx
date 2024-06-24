import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Upload2 = () => {
  const navigation = useNavigation();

  const [meal, setMeal] = useState({
    meal_name: "",
    meal_minutes: "",
    Rating: "",
    calories_info: "",
    ingredient: "",
    meal_step: "",
    category: "",
    image: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const categories = [
    "Select Category",
    "Breakfast",
    "Lunch",
    "Dinner",
    "High Protein",
    "Vegetarian",
  ];

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      base64: true,
    });

    if (!result.cancelled) {
      setMeal({ ...meal, image: result.assets[0].uri });
    }
  };

  const handleCategorySelection = (selectedCategory) => {
    let categoryValue;
    switch (selectedCategory) {
      case "Breakfast":
        categoryValue = 1;
        break;
      case "Lunch":
        categoryValue = 2;
        break;
      case "Dinner":
        categoryValue = 3;
        break;
      case "High Protein":
        categoryValue = 4;
        break;
      case "Vegetarian":
        categoryValue = 5;
        break;
      default:
        categoryValue = ""; // Or whatever default value you want
        break;
    }
    setMeal({ ...meal, category: categoryValue });
    setShowDropdown(false); // Close the dropdown after selection
  };

  const handleAddMeal = async () => {
    if (
      meal.meal_name &&
      meal.meal_minutes &&
      meal.Rating &&
      meal.calories_info &&
      meal.ingredient &&
      meal.meal_step &&
    //   meal.category &&
      meal.image
    ) {
      try {
        await axios.post("http://172.20.105.130:8082/test", meal, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        Alert.alert("Success", "All information added successfully");
        navigation.navigate("MealsTwo");
      } catch (error) {
        console.error("Error adding meal:", error);
      }
    } else {
      Alert.alert("Warning", "Please fill all information");
    }
  };

  const handleBackToDashboard = () => {
    navigation.navigate("MealsTwo");
  };

  const renderNumberedList = (text) => {
    const items = text.split("\n").map((item, index) => (
      <Text key={index}>
        {index + 1}) {item.trim()}
      </Text>
    ));
    return items;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Wrap the entire view in ScrollView */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={meal.meal_name}
          onChangeText={(text) => setMeal({ ...meal, meal_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Meal Minutes"
          value={meal.meal_minutes}
          onChangeText={(text) => setMeal({ ...meal, meal_minutes: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Rating"
          value={meal.Rating}
          onChangeText={(text) => setMeal({ ...meal, Rating: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Calories Info"
          value={meal.calories_info}
          onChangeText={(text) => setMeal({ ...meal, calories_info: text })}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Ingredients (List each ingredient on a new line)"
          value={meal.ingredient}
          onChangeText={(text) => setMeal({ ...meal, ingredient: text })}
          multiline={true}
          numberOfLines={100} // Adjust the number of lines based on your design
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Meal Steps (List each step on a new line)"
          value={meal.meal_step}
          onChangeText={(text) => setMeal({ ...meal, meal_step: text })}
          multiline={true}
          numberOfLines={500} // Adjust the number of lines based on your design
        />

        <TouchableOpacity
          style={styles.categoryDropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text>{meal.category || "Select Category"}</Text>
          {showDropdown && (
            <View style={styles.dropdown}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.dropdownItem}
                  onPress={() => handleCategorySelection(category)}
                >
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <Text style={styles.addImageText}>Pick an image</Text>
        </TouchableOpacity>
        {meal.image && (
          <Image source={{ uri: meal.image }} style={styles.image} />
        )}

        {/* button */}
        <IconButton
          icon="plus-circle"
          color="#00bfa5"
          onPress={handleAddMeal}
          style={styles.addMealButton}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToDashboard}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 90,
    backgroundColor: "#fff",
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
  multilineInput: {
    height: 120, // Adjust the height as needed
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#0077cc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addMealButton: {
    backgroundColor: "#00bfa5",
    borderRadius: 5,
    alignContent: "center",
    marginTop: 10,
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
  categoryDropdown: {
    position: "relative", // Ensure the dropdown is positioned relative to its parent
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdown: {
    position: "absolute",
    top: -228, // Adjust this value to position the dropdown below the input
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Upload2;