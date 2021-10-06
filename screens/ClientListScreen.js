import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// import dayjs from "dayjs";
import styled from "styled-components/native";
import ClassItem from "../components/ClassItem";
import ClientAvatar from "../components/ClientAvatar";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import * as dayjs from "dayjs";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { Avatar, ListItem } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Moment from "moment";
// import { extendMoment } from "moment-range";

import NotificationButton from "../components/UI/NotificationButton";
import { TextInput } from "react-native";

const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? "Buenos Días"
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? "Buenas Tardes"
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? "Buenas Noches" // if for some reason the calculation didn't work
    : "Bienvenido";

const ClientListScreen = ({ navigation }) => {
  const [clientList, setClientList] = useState([]);
  const [inMemoryClientes, setInMemoryClientes] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [Level1, setLevel1] = useState([]);
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [userImage, setUserImage] = useState(null);

  // const moment = extendMoment(Moment);

  // var date1 = userInfo.endDate;
  // var date2 = userInfo.startDate;
  // const range = moment.range(date2, date1);
  // const dateDiff = range.diff("days");
  // const minDays = () => {
  //   if (dateDiff > 5) dateDiff = 0;
  // };
  const { user, deleteProduct } = useContext(AuthContext);
  //   const db = firebase.firestore().collection("Members");

  const width = Dimensions.get("window").width;

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    // dayjs.extend(relativeTime)

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
        navigation.navigate("Client", {
          id: item.userId,
          data: clientList,
        })
      }
    >
      <Avatar
        rounded
        size={80}
        // {!userInfo.userImg ? (
        //   icon={{ name: "user", type: "font-awesome" }}
        // }
        // style={{ padding: 0 }}
        source={{ uri: `${item.userImg}` }}
        onPress={() =>
          navigation.navigate("Client", {
            id: item.userId,
            data: clientList,
          })
        }
      ></Avatar>
      <View style={{ marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 26 }}>
          {item.FirstName}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 26 }}>
          {item.LastName}
        </Text>

        <ClientAvatar
          startDate={item.startDate}
          endDate={item.endDate}
          userId={item.userId}
        />
        {/* <Text style={{ color: "grey", fontWeight: "bold" }}>{a}"dias"</Text> */}
        {/* <Text>
          {dateDiff > 900000 || dateDiff < 0 ? (
            <Text style={[styles.dateNumber, { color: "red" }]}>
              {" "}
              (0 dias){" "}
            </Text>
          ) : (
            <Text style={[styles.dateNumber, { color: "#666" }]}>
              {" "}
              ({dateDiff} dias){" "}
            </Text>
          )}
          <View style={{ marginBottom: 2 }}>
            {dateDiff < 5 && <Octicons name="alert" size={15} color="red" />}
          </View>
        </Text> */}
      </View>
    </TouchableOpacity>
    // </View>
  );

  const searchClients = (value) => {
    const filteredClients = inMemoryClientes.filter((client) => {
      let clientLowercase = (
        client.FirstName +
        " " +
        client.LastName
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return clientLowercase.indexOf(searchTermLowercase) > -1;
    });
    setClientList(filteredClients);
  };

  useFocusEffect(
    React.useCallback(() => {
      // console.log("loading home and user", user);
      const fetchCoaches = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
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
                  plan,
                  points,
                  startDate,
                  endDate,
                  expoPushToken,
                  goal,
                  history,
                  sport,
                  Age,
                  Height,
                  Weight,
                  Gender,
                  BaseStartDate,
                  Imc,
                  Grasa,
                  Musculo,
                  Basal,
                  GoalBasal,
                  Agua,
                  Proteina,
                  Osea,
                  Metabolica,
                  Viseral,
                  notes,
                  userId,
                } = doc.data();
                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  plan: plan,
                  expoPushToken: expoPushToken,
                  points: points,
                  startDate: startDate,
                  endDate: endDate,
                  goal: goal,
                  history: history,
                  sport: sport,
                  Age,
                  Height,
                  Weight,
                  Gender,
                  BaseStartDate,
                  Imc,
                  Grasa,
                  Musculo,
                  Basal,
                  GoalBasal,
                  Agua,
                  Proteina,
                  Osea,
                  Metabolica,
                  Viseral,
                  notes: notes,
                  createdAt: createdAt,
                  userId: userId,
                });
              });
            });
          setClientList(list);
          setInMemoryClientes(list);
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
                // console.log("Document data:", doc.data());
                setUserInfo(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
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
      <StatusBar hidden={false} />

      <View
        style={{
          width: width,
          marginTop: 20,
          // marginBottom: 20,
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
                userInfo.FirstName.split(" ")[0]
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
      <TextInput
        placeholder="Buscar Cliente"
        placeholderTextColor="#dddddd"
        style={{
          // marginTop: 20,
          // height: 50,
          fontSize: 36,
          padding: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: "#7d90a0",
        }}
        onChangeText={(value) => searchClients(value)}
      />

      <View style={styles.TitleBar}></View>
      <Subtitle>{"Clientes".toUpperCase()}</Subtitle>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={clientList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
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
export default ClientListScreen;
