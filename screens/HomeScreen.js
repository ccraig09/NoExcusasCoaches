import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import dayjs from "dayjs";
import styled from "styled-components/native";
import ClassItem from "../components/ClassItem";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { Avatar, ListItem } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NotificationButton from "../components/UI/NotificationButton";

const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? "Buenos Días"
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? "Buenas Tardes"
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? "Buenas Noches" // if for some reason the calculation didn't work
    : "Bienvenido";

const HomeScreen = ({ navigation }) => {
  const [coachList, setCoachList] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [Level1, setLevel1] = useState([]);
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [userImage, setUserImage] = useState(null);

  const { user, deleteProduct } = useContext(AuthContext);
  //   const db = firebase.firestore().collection("Members");

  const width = Dimensions.get("window").width;

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    // <View
    //   style={{
    //     minHeight: 70,
    //     padding: 5,
    //     flexDirection: "row",
    //     alignItems: "center",
    //   }}
    // >
    <TouchableOpacity
      style={{
        minHeight: 70,
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() =>
        navigation.navigate("Coach", {
          id: item.userId,
          data: coachList,
        })
      }
    >
      <Avatar
        rounded
        size={50}
        // {!userInfo.userImg ? (
        //   icon={{ name: "user", type: "font-awesome" }}
        // }
        // style={{ padding: 0 }}
        source={{ uri: `${item.userImg}` }}
        onPress={() => {
          // if (!userInfo.userImg) {
          //   navigation.navigate("Edit");
          // } else {
          //   navigation.navigate("Profile");
          // }
        }}
      >
        {/* {!userInfo.userImg ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Edit");
              }}
            >
              <Avatar.Accessory
                name="pencil-alt"
                type="font-awesome-5"
                size={25}
              />
            </TouchableOpacity>
          ) : null} */}
      </Avatar>
      <View style={{ marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 26 }}>
          {item.FirstName + " "}
          {item.LastName}
        </Text>
        <Text style={{ color: "grey", fontWeight: "bold" }}>
          {item.country}
        </Text>
      </View>
    </TouchableOpacity>
    // </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      // console.log("loading home and user", user);
      const fetchCoaches = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Coaches")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  FirstName,
                  LastName,
                  userImg,
                  email,
                  Phone,
                  createdAt,
                  country,
                  userId,
                } = doc.data();
                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  country: country,
                  createdAt: createdAt,
                  userId: userId,
                });
              });
            });
          setCoachList(list);
          //   console.log("coachlist?:", coachList);
          // console.log("this the user?", user);
          // console.log(fitnessClasses);
          // setLevel1(fitnessClasses[0].Level1);
        } catch (e) {
          console.log(e);
        }
      };
      const fetchMemberDetails = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Coaches")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data());
                setUserInfo(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No stttuch document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };

      fetchMemberDetails();
      fetchCoaches();
      AsyncStorage.getItem("userData").then((value) => {
        const data = JSON.parse(value);
        // console.log(typeof data.Fir);
        setUserName(typeof data === "object" ? "" : data.givenName);
      });
    }, [])
  );

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar hidden={true} />
      <View
        style={{
          width: width,
          marginTop: 20,
          flexDirection: "row",
          // justifyContent: "space-between",
          // paddingRight: 10,
          paddingLeft: 20,
        }}
      >
        <Avatar
          rounded
          size={90}
          // {!userInfo.userImg ? (
          icon={{ name: "user", type: "font-awesome" }}
          // }
          // style={{ padding: 0 }}
          source={{ uri: `${userInfo.userImg}` }}
          onPress={() => {
            if (!userInfo.userImg) {
              navigation.navigate("Edit");
            } else {
              navigation.navigate("Edit");
            }
          }}
        >
          {!userInfo.userImg ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Edit");
              }}
            >
              <Avatar.Accessory
                name="pencil-alt"
                type="font-awesome-5"
                size={25}
              />
            </TouchableOpacity>
          ) : null}
        </Avatar>

        <View
          style={{
            paddingRight: 10,
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.displayName}>
            <Text style={styles.subtitle}>{greetingMessage}, </Text>
            {/* <View style={{ flexDirection: "row" }}> */}
            <Text style={styles.hello}>
              {!userInfo.FirstName ? (
                userName === "" ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Edit");
                    }}
                  >
                    <Text
                      style={{
                        color: "silver",
                        marginTop: 5,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      }}
                    >
                      Agregar Nombre
                    </Text>
                  </TouchableOpacity>
                ) : (
                  userName
                )
              ) : (
                "Coach " + userInfo.FirstName
              )}
            </Text>
            {/* <Text style={styles.expire}>Desde:</Text>
            <Text style={styles.expire}>
              {dayjs(userInfo.createdAt).format()}
            </Text> */}
          </View>
          {/* <View style={styles.qr}>
            <Icon.Button
              name="qr-code"
              size={80}
              color="black"
              backgroundColor="#f0f3f5"
              onPress={() => {
                navigation.navigate("Qr");
              }}
            />
          </View> */}
          <View style={styles.qr}>
            <Icon.Button
              name="qr-code"
              size={80}
              color="black"
              backgroundColor="#f0f3f5"
              onPress={() => {
                navigation.navigate("Scan");
              }}
            />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => {}}>
              <NotificationButton />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Edit")}>
              <Icon name="settings" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </View>

      <View style={styles.TitleBar}></View>
      <Subtitle>{"Coaches".toUpperCase()}</Subtitle>
      <FlatList
        //   horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={coachList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      {/* <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={coachList}
          renderItem={(itemData) => (
            <ClassItem
              image={itemData.item.userImg}
              title={itemData.item.FirstName}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("Section", {
                  classId: itemData.item.key,
                  classes: sportsClasses,
                });
              }}
            />
          )}
        /> */}
      {/* <Subtitle>{"Deportes".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={sportsClasses}
          renderItem={(itemData) => (
            <ClassItem
              image={itemData.item.Image}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("Section", {
                  classId: itemData.item.key,
                  classes: sportsClasses,
                });
              }}
            />
          )}
        />
        <Subtitle>{"Niños".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={kidsClasses}
          renderItem={(itemData) => (
            <ClassItem
              image={itemData.item.Image}
              title={itemData.item.Title}
              //   price={itemData.item.price}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              //   image={itemData.item.image}
              onClassClick={() => {
                navigation.navigate("Section", {
                  classId: itemData.item.key,
                  classes: kidsClasses,
                });
              }}
            />
          )}
        /> */}
    </SafeAreaView>
  );
};

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 800;
  font-size: 25px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;
const styles = StyleSheet.create({
  RootView: {
    backgroundColor: "black",
    flex: 1,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  Container: {
    flex: 1,
    backgroundColor: "#f0f3f5",
  },
  displayName: {
    marginBottom: 25,
    alignItems: "flex-start",
    // marginTop: 20,
    marginLeft: 10,
  },
  hello: {
    fontWeight: "bold",
    color: Colors.noExprimary,
    fontSize: 20,
  },
  expire: {
    fontWeight: "bold",
    color: "silver",
    fontSize: 15,
  },
  qr: {
    // marginTop: 20,
    // height: 50,
    // width: 50,
    alignSelf: "center",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default HomeScreen;
