import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Providers from "./navigation";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
LogBox.ignoreLogs([
  "Could not find image file:///private/var/containers/Bundle/Application/B452FB9E-9E1E-425D-B2FE-7A57366A6B1D/Expo%20Go.app/null.png",
]);
LogBox.ignoreLogs([
  "Could not find image file:///private/var/containers/Bundle/Application/B452FB9E-9E1E-425D-B2FE-7A57366A6B1D/Expo%20Go.app/undefined.png",
]);

const fetchFonts = async () => {
  await Font.loadAsync({
    aliens: require("./assets/fonts/aliens.ttf"),
    "Kufam-SemiBoldItalic": require("./assets/fonts/Kufam-SemiBoldItalic.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-BoldItalic": require("./assets/fonts/Lato-BoldItalic.ttf"),
    "Lato-Italic": require("./assets/fonts/Lato-Italic.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  //cruzmarilu462@gmail.com
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onError={console.warn}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    // <Provider>
    <SafeAreaProvider>
      <Providers />
    </SafeAreaProvider>
    // </Provider>
  );
}
