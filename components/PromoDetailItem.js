import React, { createContext, useState } from "react";
import {
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components";
import * as Linking from "expo-linking";

const PromoDetailItem = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  // let logoimg = "../assets/icon-noexlogo.png";
  console.log(props.description, props.extension);
  return (
    <View style={styles.Container}>
      <View style={styles.Cover}>
        <Image
          style={styles.Image}
          source={{ uri: props.image }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />

        <ActivityIndicator
          style={{ alignSelf: "center", marginTop: 70 }}
          size="small"
          color="black"
          animating={isLoading}
        />
        <View style={styles.Wrapper}></View>
      </View>
      <View>
        <Subtitle>{props.title}</Subtitle>
        <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "600" }}>
          {props.subtitle}
        </Text>
      </View>
      <ScrollView style={{ marginHorizontal: 5 }}>
        <Text>{props.description}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(props.extension)}>
          <Text style={{ textDecorationLine: "underline", color: "blue" }}>
            {props.extension}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Subtitle = styled.Text`
  color: #cd9a21;
  font-weight: 800;
  font-size: 30px;
  text-align: center;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Cover: {
    height: 475,
  },
  Image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  PlayWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40,
    marginLeft: -40,
  },
  PlayView: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  Wrapper: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 20,
    alignItems: "center",
  },
  Logo: {
    width: 24,
    height: 24,
  },
  Subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 5,
    textTransform: "uppercase",
  },
});

export default PromoDetailItem;
