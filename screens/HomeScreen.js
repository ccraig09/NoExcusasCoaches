import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import dayjs from "dayjs";
import styled from "styled-components";
import ClassItem from "../components/ClassItem";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import Constants from "expo-constants";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { Avatar, ListItem } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import NotificationButton from "../components/UI/NotificationButton";
import * as Linking from "expo-linking";
import Pedometer from "../components/Pedometer";
const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? "Buenos Días"
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? "Buenas Tardes"
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? "Buenas Noches" // if for some reason the calculation didn't work
    : "Bienvenido";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const HomeScreen = ({ navigation }) => {
  const { user, addToken } = useContext(AuthContext);
  const [coachList, setCoachList] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [Level1, setLevel1] = useState([]);
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //   const db = firebase.firestore().collection("Members");

  const width = Dimensions.get("window").width;

  const keyExtractor = (item, index) => index.toString();

  useEffect(() => {
    Notifications.cancelAllScheduledNotificationsAsync();
    // dailyNotification();
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("tokens match check", token, userInfo.expoPushToken);
      if (token !== userInfo.expoPushToken) {
        addToken(token);
      }
      // console.log();
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Alerta",
          "No recibirá noticias si no habilita las notificaciones. Si desea recibir notificaciones, habilitelas desde configuración.",
          [
            { text: "Cancel" },
            // If they said no initially and want to change their mind,
            // we can automatically open our app in their settings
            // so there's less friction in turning notifications on
            {
              text: "Activar Notificaciones",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ]
        );
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("background", response);
        // navigation.navigate("Edit");
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("foreground", notification);
      });
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  // const dailyNotification = () => {
  //   // const coaches = coachList.map((code) => code.expoPushToken);
  //   // console.log("cheses", coaches);
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Diario Frase Motivacional",
  //       body: "Deeeenso con tooodo!",
  //     },
  //     trigger: {
  //       // type: "daily",
  //       hour: 18,
  //       minute: 10,

  //       repeats: true,
  //     },
  //   });
  // };
  // const triggerNotificationHandler = () => {
  //   const coaches = coachList.map((code) => code.expoPushToken);
  //   console.log("cheses", coaches);
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "My first local notification",
  //       body: "this is the first local notification we are sending!",
  //       data: userInfo,
  //     },
  //     trigger: {
  //       seconds: 2,
  //     },
  //   });

  // fetch("https://exp.host/--/api/v2/push/send", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Accept-Encoding": "gzip, deflate",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     to: coaches,
  //     data: { extraData: "Some data" },
  //     title: "Sent via the app",
  //     body: "This push notification was sent via the app!",
  //     // badge: 7,
  //   }),
  // });
  // };

  const renderItem = ({ item }) => (
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
        source={{ uri: `${item.userImg}` }}
        onPress={() => {}}
      ></Avatar>
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
                  expoPushToken,
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
                  expoPushToken,
                  userId: userId,
                });
              });
            });
          setCoachList(list);
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
      <StatusBar hidden={false} />
      <View
        style={{
          width: width,
          marginTop: 20,
          flexDirection: "row",
          // justifyContent: "space-between",
          // paddingRight: 10,
          paddingLeft: 10,
        }}
      >
        <Avatar
          rounded
          size={80}
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
            justifyContent: "space-around",
            // maxWidth: 120,
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
          </View>

          <View style={styles.qr}>
            <Icon.Button
              name="qr-code"
              size={50}
              color="black"
              backgroundColor="#f0f3f5"
              onPress={() => {
                navigation.navigate("Scan", {
                  coachList: coachList,
                });
              }}
            />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notification");
              }}
            >
              <NotificationButton />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Edit")}>
              <Icon name="settings" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.TitleBar}></View>
      {/* <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      /> */}

      {/* <Pedometer /> */}
      <Subtitle>{"Coaches".toUpperCase()}</Subtitle>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={coachList}
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
export default HomeScreen;
