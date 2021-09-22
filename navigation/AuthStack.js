import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
// import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
// import OnboardingScreen from "../screens/OnboardingScreen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={({ navigation }) => ({
          title: "",
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          title: "",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f9fafd",
            shadowColor: "#f9fafd",
            elevation: 0,
          },
          // headerLeft: () => (
          //   <View style={{ marginLeft: 10 }}>
          //     <FontAwesome.Button
          //       name="long-arrow-left"
          //       size={25}
          //       backgroundColor="#f9fafd"
          //       color="#333"
          //       onPress={() => navigation.navigate("Signup")}
          //     />
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ header: () => null }}
      />
      {/* <Stack.Screen
        name="Forgot"
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          title: "",
          headerStyle: {
            backgroundColor: "#f9fafd",
            shadowColor: "#f9fafd",
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate("Login")}
              />
            </View>
          ),
        })}
      /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
