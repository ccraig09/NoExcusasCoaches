import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { ListItem, Avatar } from "react-native-elements";

const ClientDetailsScreen = ({ route, navigation }) => {
  const { id, data } = route.params;
  const selectedClient = data.find((key) => key.userId === id);

  const list = [
    {
      title: "Plan:",
      data: selectedClient.plan,
    },
    {
      title: "Fecha de inicio:",
      data: selectedClient.startDate,
    },
    {
      title: "Fecha de vencimiento:",
      data: selectedClient.endDate,
    },
    {
      title: "Metas:",
      data: selectedClient.goal,
    },
    {
      title: "Oficio:",
      data: selectedClient.sport,
    },
    {
      title: "History clinica:",
      data: selectedClient.history,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Edit");
          }}
        >
          <Avatar
            rounded
            // avatarStyle={styles.userImg}
            size={150}
            icon={{ name: "user", type: "font-awesome" }}
            source={{ uri: selectedClient.userImg }}
            onPress={() => {
              navigation.navigate("EditClient", {
                clientData: selectedClient,
              });
            }}
          >
            <Avatar.Accessory
              name="pencil-outline"
              type="material-community"
              size={40}
              // color="black"
            />
          </Avatar>
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>
        {selectedClient.FirstName} {selectedClient.LastName}
      </Text>

      <Text style={styles.userInfoTitle}>{selectedClient.Phone}</Text>
      <Text style={styles.userInfoTitle}>{selectedClient.email}</Text>
      <View style={styles.userBtnWrapper}></View>
      <View>
        <Text style={styles.userInfoPoints}>
          Puntos Acumulados: {selectedClient.points}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainbox}>
          {list.map((l, i) => (
            <ListItem key={i} bottomDivider>
              {/* <Avatar source={{ uri: l.avatar_url }} /> */}
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>
                  {l.title}
                </ListItem.Title>

                <ListItem.Subtitle>{l.data}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>

        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitleId}>{selectedClient.userId}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImg: {
    marginTop: 20,
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  border: {
    flexDirection: "row",
    width: Dimensions.get("window").width / 1.2,
    borderWidth: 0.7,
    borderColor: "black",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  userBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#2e64e5",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: "center",
    padding: 10,
  },
  userInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoPoints: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: Colors.noExprimary,
  },
  userInfoTitleId: {
    color: "silver",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
