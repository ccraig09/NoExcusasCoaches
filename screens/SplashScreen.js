import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const startHandler = () => {
    Alert.alert(
      "Ya tienes una Cuenta?",
      "Puedes iniciar sesion o crear una cuenta",
      [
        {
          text: "Crear una cuenta",
          onPress: () => {
            navigation.navigate("Signup");
          },
        },
        {
          text: "Tengo una cuenta",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[Colors.noExprimary, "#ffffff"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Animatable.Image
            animation="bounceIn"
            duration={1500}
            source={require("../assets/icon-noexlogo.png")}
            style={styles.logo}
            resizeMode="stretch"
          />
        </View>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <Text style={styles.title}>Por los coaches</Text>
          <Text style={styles.text}>Iniciar Sesion o crear una cuenta</Text>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => startHandler()}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Empezamos</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
  },
  gradient: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: Colors.noExprimary,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
});
