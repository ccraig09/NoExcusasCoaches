import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  SafeAreaView,
  Animated,
  RefreshControl,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
// import dayjs from "dayjs";
import styled from "styled-components/native";
import ClassItem from "../components/ClassItem";
import ClientAvatar from "../components/ClientAvatar";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import * as dayjs from "dayjs";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-tiny-toast";
import { ButtonGroup } from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { Avatar, ListItem } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Moment from "moment";
// import { extendMoment } from "moment-range";

import NotificationButton from "../components/UI/NotificationButton";
import { TextInput } from "react-native";
import Moment from "moment";
import { extendMoment } from "moment-range";

const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? "Buenos Días"
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? "Buenas Tardes"
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? "Buenas Noches" // if for some reason the calculation didn't work
    : "Bienvenido";

const ActiveClientListScreen = ({ navigation }) => {
  const [clientList, setClientList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [inactiveList, setInactiveList] = useState([]);
  const [inMemoryClientes, setInMemoryClientes] = useState([]);
  const [inMemoryInActiveClientes, setInMemoryInActiveClientes] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [Level1, setLevel1] = useState([]);
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const moment = extendMoment(Moment);

  // const moment = extendMoment(Moment);

  // var date1 = userInfo.endDate;
  // var date2 = userInfo.startDate;
  // const range = moment.range(date2, date1);
  // const dateDiff = range.diff("days");
  // const minDays = () => {
  //   if (dateDiff > 5) dateDiff = 0;
  // };
  const { user, inactivar } = useContext(AuthContext);
  //   const db = firebase.firestore().collection("Members");

  const width = Dimensions.get("window").width;

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        width: "100%",
        // minHeight: 70,
        padding: 5,
        // paddingVertical: 15,
        // paddingHorizontal: 10,

        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        margin: 5,
        borderColor: Colors.noExprimary,
        shadowColor: Colors.noExprimary,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 9,
      }}
      underlayColor={"white"}
      onPress={() =>
        navigation.navigate("Client", {
          id: item.userId,
          data: clientList,
        })
      }
      onLongPress={() => {
        activateHandler(item.key, item.FirstName, item.active);
      }}
    >
      <Avatar
        rounded
        size={40}
        source={{ uri: `${item.userImg}` }}
        onPress={() =>
          navigation.navigate("Client", {
            id: item.userId,
            data: clientList,
          })
        }
      ></Avatar>
      <View style={{ marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          {item.FirstName}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 13 }}>
          {item.LastName}
        </Text>

        <ClientAvatar
          startDate={item.startDate}
          endDate={item.endDate}
          userId={item.userId}
        />
      </View>
    </TouchableOpacity>
  );
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const reactivateHandler = async (Title, rowKey) => {
    const toast = Toast.showLoading("Reactivando");

    console.log("reactivando", Title),
      await inactivar(rowKey, true),
      // closeRow(rowMap, rowKey),
      // newData.splice(prevIndex, 1),
      // inactiveList(newData),
      fetchMembers();
    Toast.hide(toast);
  };
  const inactivateHandler = async (Title, rowKey) => {
    const toast = await Toast.showLoading("Inactivando");

    console.log("desactivando", Title),
      await inactivar(rowKey, false),
      // closeRow(rowMap, rowKey),
      // newData.splice(prevIndex, 1),
      // clientList(newData), ¿˘
      fetchMembers();
    Toast.hide(toast);
  };

  const activateHandler = async (rowKey, Title, active) => {
    console.log("this is previndex", rowKey);
    // const newData = !active ? [...inactiveList] : [...clientList];
    // const prevIndex = !active
    //   ? inactiveList.findIndex((item) => item.key === rowKey)
    //   : clientList.findIndex((item) => item.key === rowKey);

    if (active === false) {
      Alert.alert("Reactivar?", `Quisieras reactivar "${Title}"?`, [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: async () => reactivateHandler(Title, rowKey),
        },
      ]);
    } else {
      Alert.alert("Desactivar?", `Quisieras desactivar "${Title}"?`, [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: async () => inactivateHandler(Title, rowKey),
        },
      ]);
    }
  };

  const HiddenItemWithActions = (props) => {
    const { swipeAnimatedValue, onClose, onDelete } = props;

    return (
      <View style={styles.rowBack}>
        {/* <Text>Left</Text> */}
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onClose}
        >
          <IconMat
            name="close-circle-outline"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onDelete}
        >
          <Animated.View
            style={[
              styles.trash,
              {
                transform: [
                  {
                    scale: swipeAnimatedValue.interpolate({
                      inputRange: [-90, -45],
                      outputRange: [1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <IconMat name="arrow-right-circle-outline" size={25} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = (itemData, rowMap) => {
    return (
      <HiddenItemWithActions
        data={clientList}
        rowMap={rowMap}
        onClose={() => closeRow(rowMap, itemData.item.key)}
        onDelete={() =>
          activateHandler(
            rowMap,
            itemData.item.key,
            itemData.item.FirstName,
            itemData.item.active
          )
        }
      />
    );
  };

  const searchClients = (value) => {
    const filteredClients =
      selectedIndex === 0
        ? inMemoryClientes.filter((client) => {
            let clientLowercase = (
              client.FirstName +
              " " +
              client.LastName
            ).toLowerCase();

            let searchTermLowercase = value.toLowerCase();

            return clientLowercase.indexOf(searchTermLowercase) > -1;
          })
        : inMemoryInActiveClientes.filter((client) => {
            let clientLowercase = (
              client.FirstName +
              " " +
              client.LastName
            ).toLowerCase();

            let searchTermLowercase = value.toLowerCase();

            return clientLowercase.indexOf(searchTermLowercase) > -1;
          });
    selectedIndex === 1
      ? setInactiveList(filteredClients)
      : setClientList(filteredClients);
    // setClientList(filteredClients);
  };

  useFocusEffect(
    React.useCallback(() => {
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
                  active,
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
                var date1 = moment().startOf("day");
                var date2 = moment(endDate, "DD-MM-YYYY");
                const dateDiff = moment.duration(date2.diff(date1)).asDays();

                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  plan: plan,
                  active: active,
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
                  dateDiff: dateDiff,
                });
                // console.log("date diffs", dateDiff);
              });
            });
          // setClientList(list);

          setClientList(
            list
              .filter((data) => data.active !== false)
              .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
          );
          setInactiveList(
            list
              .filter((data) => data.active == false)
              .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
          );

          setInMemoryClientes(
            list
              .filter((data) => data.active !== false)
              .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
          );
          setInMemoryInActiveClientes(
            list
              .filter((data) => data.active == false)
              .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
          );
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

  const fetchMembers = async () => {
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
              active,
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
            var date1 = moment().startOf("day");
            var date2 = moment(endDate, "DD-MM-YYYY");
            const dateDiff = moment.duration(date2.diff(date1)).asDays();

            list.push({
              key: doc.id,
              FirstName: FirstName,
              LastName: LastName,
              userImg: userImg,
              email: email,
              Phone: Phone,
              plan: plan,
              active: active,
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
              dateDiff: dateDiff,
            });
            // console.log("date diffs", dateDiff);
          });
        });
      // setClientList(list);
      setClientList(
        list
          .filter((data) => data.active !== false)
          .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
      );
      setInactiveList(
        list
          .filter((data) => data.active == false)
          .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
      );

      setInMemoryClientes(
        list
          .filter((data) => data.active !== false)
          .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
      );
      setInMemoryInActiveClientes(
        list
          .filter((data) => data.active == false)
          .sort((a, b) => (a.FirstName < b.FirstName ? -1 : 1))
      );
    } catch (e) {
      console.log(e);
    }
  };

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
          <View style={{ alignItems: "flex-end" }}></View>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Edit")}>
              <Icon name="settings" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </View>

      {/* <View style={styles.TitleBar}></View> */}
      <View style={{ flex: 1 }}>
        <View>
          <ButtonGroup
            buttons={["ACTIVOS", "INACTIVOS"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              console.log(value);
              setSelectedIndex(value);
            }}
            selectedButtonStyle={{ backgroundColor: Colors.noExprimary }}
            containerStyle={{ marginBottom: 20, borderRadius: 15 }}
          />
          <TextInput
            placeholder={selectedIndex === 0 ? "🔎 ACTIVOS" : "🔎 INACTIVOS"}
            placeholderTextColor="#dddddd"
            style={{
              width: "80%",
              // marginTop: 20,
              // height: 50,
              fontSize: 26,
              padding: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#7d90a0",
            }}
            onChangeText={(value) => searchClients(value)}
          />

          <Subtitle>
            {"Activos".toUpperCase()} ({" "}
            {selectedIndex === 0 ? clientList.length : inactiveList.length} )
          </Subtitle>
          <FlatList
            onRefresh={() => {
              fetchMembers();
            }}
            refreshing={isLoading}
            showsHorizontalScrollIndicator={false}
            data={selectedIndex === 0 ? clientList : inactiveList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          {/* <SwipeListView
            refreshControl={
              <RefreshControl
                colors={["#FF4949", "#FF4949"]}
                // refreshing={isRefreshing}
                // onRefresh={loadDetails}
              />
            }
            // useFlatList={true}
            data={clientList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            disableRightSwipe
            onRowOpen={(rowKey, rowMap) => {
              setTimeout(() => {
                rowMap[rowKey] && rowMap[rowKey].closeRow();
              }, 2000);
            }}
            // previewRowKey={clientList[0].key}

            // onRowDidOpen={onRowDidOpen}
          /> */}
        </View>
        {/* <View>
          <TextInput
            placeholder="🔎 Inactivos"
            placeholderTextColor="#dddddd"
            style={{
              width: "80%",
              // marginTop: 20,
              // height: 50,
              fontSize: 26,
              padding: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#7d90a0",
            }}
            onChangeText={(value) => searchClients(value)}
          />

          <Subtitle>
            {"Inactivos".toUpperCase()} ( {inactiveList.length} )
          </Subtitle>
          <SwipeListView
            refreshControl={
              <RefreshControl
                colors={["#FF4949", "#FF4949"]}
                // refreshing={isRefreshing}
                // onRefresh={loadDetails}
              />
            }
            // useFlatList={true}
            data={inactiveList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            disableRightSwipe
            onRowOpen={(rowKey, rowMap) => {
              setTimeout(() => {
                rowMap[rowKey] && rowMap[rowKey].closeRow();
              }, 2000);
            }}
            // previewRowKey={clientList[0].key}

            // onRowDidOpen={onRowDidOpen}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 800;
  font-size: 17px;
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
  rowBack: {
    alignItems: "center",
    // backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    height: 45,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: "#1f65ff",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
});
export default ActiveClientListScreen;
