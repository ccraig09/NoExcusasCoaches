import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";

const ClassItem = (props) => {
  let logoimg = "../assets/icon-noexlogo.png";

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onClassClick} useForeground>
          <Image style={styles.image} source={{ uri: props.image }} />
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    width: 350,
    height: 300,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 14,
    backgroundColor: "black",
    margin: 20,
  },
  wrapper: {
    marginLeft: 10,
  },
  logo: {
    width: 34,
    height: 34,
  },
  touchable: {
    borderRadius: 14,
    overflow: "hidden",
  },
  // imageContainer: {
  //   width: "100%",
  //   height: 140,
  //   borderTopLeftRadius: 14,
  //   borderTopRightRadius: 14,
  //   overflow: "hidden",
  // },
  image: {
    width: "100%",
    height: "100%",
    // position: "absolute",
    // top: 0,
    // left: 0,
  },
  cardTitle: {
    color: Colors.noExprimary,
    fontSize: 24,
    position: "absolute",

    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    width: 190,
  },
  caption: {
    fontSize: 20,
    color: "white",
    fontFamily: "open-sans-bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "#b8bece",
    fontWeight: "600",
    fontSize: 15,
    textTransform: "uppercase",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingLeft: 15,
  },
});

export default ClassItem;
