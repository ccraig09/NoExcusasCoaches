import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";

import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import SocialButton from "../components/SocialButton";
import { AuthContext } from "../navigation/AuthProvider";

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login, signInWithGoogle } = useContext(AuthContext);

  const loginHandler = async () => {
    setIsLoading(true);

    await login(email, password);

    setIsLoading(false);
  };
  const googleLoginHandler = async () => {
    setIsLoading(true);

    await signInWithGoogle();

    // setIsLoading(false);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#ffffff", Colors.noExprimary]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <ActivityIndicator size="small" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#ffffff", Colors.noExprimary]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/icon-noexlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.text}>Bienvenido</Text>
        {/* <Text style={styles.text}>Prioriza</Text> */}

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Correo"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Contraseña"
          iconType="lock"
          secureTextEntry={true}
        />
        <View style={{ width: "100%" }}>
          <FormButton
            buttonTitle="Iniciar Sesión"
            onPress={() => loginHandler()}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => props.navigation.navigate("Forgot")}
        >
          <Text style={styles.navButtonText}>Olvidé mi contranseña</Text>
        </TouchableOpacity>

        <View>
          <SocialButton
            buttonTitle="Gmail"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => {
              googleLoginHandler();
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => props.navigation.navigate("Signup")}
        >
          <Text style={styles.navButtonText}>
            No tienes una cuenta? Crear aqui
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Kufam-SemiBoldItalic",
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
    // fontFamily: "Lato-Regular",
  },
});
