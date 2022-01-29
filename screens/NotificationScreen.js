import React, { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { ButtonGroup } from "react-native-elements";
import Colors from "../constants/Colors";

const NotificationScreen = (props) => {
  const { user, readUpdate, accept, notificationReceipt } =
    useContext(AuthContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [notificationList, setNotificationList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchHistory = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("ClientNotificationHistory")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, subtitle, timestamp, userId } = doc.data();
                list.push({
                  key: doc.id,
                  Title: title,
                  subtitle: subtitle,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  isRead: true,
                  sort: timestamp,
                });
              });
            });
          setHistoryList(list.sort((a, b) => (a.sort < b.sort ? 1 : -1)));
        } catch (e) {
          console.log(e);
        }
      };
      const fetchNotifications = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Notifications")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Cell,
                  timestamp,
                  userId,
                  Goals,
                  Plan,
                  extraInfo,
                  Time,
                  Status,
                  startDate,
                  Suggestion,
                  isRead,
                  userInfo,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: Title,
                  Cell: Cell,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  Goals: Goals,
                  Plan: Plan,
                  extraInfo: extraInfo,
                  Time: Time,
                  Status: Status,
                  startDate: startDate,
                  Suggestion: Suggestion,
                  isRead: isRead,
                  userInfo: userInfo,
                  sort: timestamp,
                });
              });
            });
          setNotificationList(list.sort((a, b) => (a.sort < b.sort ? 1 : -1)));
        } catch (e) {
          console.log(e);
        }
      };

      fetchHistory();
      fetchNotifications();
    }, [])
  );
  const fetchNotifications = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Notifications")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              Title,
              Cell,
              timestamp,
              userId,
              Goals,
              Plan,
              extraInfo,
              Time,
              Status,
              startDate,
              Suggestion,
              isRead,
              userInfo,
            } = doc.data();
            list.push({
              key: doc.id,
              Title: Title,
              Cell: Cell,
              timestamp: timestamp.toDate().toDateString(),
              userId: userId,
              Goals: Goals,
              Plan: Plan,
              extraInfo: extraInfo,
              Time: Time,
              Status: Status,
              startDate: startDate,
              Suggestion: Suggestion,
              isRead: isRead,
              userInfo: userInfo,
              sort: timestamp,
            });
          });
        });
      setNotificationList(list.sort((a, b) => (a.sort < b.sort ? 1 : -1)));
    } catch (e) {
      console.log(e);
    }
  };

  const readUpdateHandler = async (key, boolean) => {
    await readUpdate(key, boolean);
    fetchNotifications();
  };

  const acceptHandler = async (
    key,
    state,
    boolean,
    userInfo,
    type,
    header,
    subHeader
  ) => {
    await accept(key, state, boolean);
    await triggerNotificationHandler(
      userInfo,
      type,
      state,
      header,
      subHeader,
      boolean
    );
    fetchNotifications();
  };

  const triggerNotificationHandler = (
    userInfo,
    type,
    state,
    header,
    subHeader,
    boolean
  ) => {
    console.log("token?", userInfo.expoPushToken);
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: userInfo.expoPushToken,
        sound: "default",
        // data: { extraData: scannedUser },
        title: `${header}`,
        body: `${subHeader}`,
      }),
    });
    notificationReceipt(
      `${header}`,
      `${subHeader}`,
      userInfo.expoPushToken,
      userInfo.FirstName,
      userInfo.LastName,
      userInfo,
      state,
      boolean
    );
    Alert.alert("Notification Enviado!", "");
    // setNotify(false);
    // setNotifyTitle("");
    // setNotifySubtitle("");
  };

  return (
    <View>
      <ButtonGroup
        buttons={["CLIENTES", "HISTORIA"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          console.log(value);
          setSelectedIndex(value);
        }}
        selectedButtonStyle={{ backgroundColor: Colors.noExprimary }}
        containerStyle={{ marginBottom: 20, borderRadius: 15 }}
      />
      <FlatList
        style={styles.root}
        data={selectedIndex === 0 ? notificationList : historyList}
        // extraData={this.state}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={(item) => {
          const Notification = item.item;
          const titleColor = () => {
            if (Notification.Title === "Ups!") {
              return "red";
            }
            if (Notification.Title === "Aprobado ☑️") {
              return "green";
            } else {
              return Colors.noExprimary;
            }
          };
          let attachment = <View />;

          let mainContentStyle;
          if (Notification.attachment) {
            mainContentStyle = styles.mainContent;
            attachment = (
              <Image
                style={styles.attachment}
                source={{ uri: Notification.attachment }}
              />
            );
          }
          return (
            <TouchableOpacity
              style={[
                styles.container,
                { backgroundColor: !Notification.isRead ? "silver" : "white" },
              ]}
              onPress={() => {
                if (selectedIndex === 0) {
                  Alert.alert("Eligir Accion", "", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    !Notification.isRead
                      ? {
                          text: "Marcar como leido",
                          //  "Marcar como no leido",
                          onPress: () =>
                            readUpdateHandler(Notification.key, true),
                        }
                      : {
                          text: "Marcar como no leido",
                          //  "Marcar como no leido",
                          onPress: () =>
                            readUpdateHandler(Notification.key, false),
                        },

                    Notification.Status === "Pendiente"
                      ? {
                          text: "Cambiar a Aceptado",
                          onPress: () =>
                            acceptHandler(
                              Notification.key,
                              "Aceptado",
                              false,
                              Notification.userInfo,
                              Notification.Title,
                              "Aprobado ☑️",
                              "Tu solicitud ha sido aceptada"
                            ),
                        }
                      : {
                          text: "Cambiar a Pendiente",
                          onPress: () =>
                            acceptHandler(
                              Notification.key,
                              "Pendiente",
                              false,
                              Notification.userInfo,
                              Notification.Title,
                              "Ups!",
                              "Tu solicitud cambio a pendiente, verifica que todo este correcto."
                            ),
                        },
                  ]);
                } else {
                  null;
                }
              }}
            >
              {selectedIndex === 0 ? (
                <Image
                  source={{
                    uri: Notification.userInfo
                      ? Notification.userInfo.userImg
                      : null,
                  }}
                  style={styles.avatar}
                />
              ) : null}
              <View style={styles.content}>
                <View style={mainContentStyle}>
                  <View style={styles.text}>
                    <Text
                      style={
                        ([styles.name],
                        {
                          color: titleColor(),
                          fontWeight: "bold",
                        })
                      }
                    >
                      {Notification.Title}
                    </Text>

                    {Notification.subtitle ? (
                      <Text>{Notification.subtitle}</Text>
                    ) : null}
                    {Notification.Status ? (
                      <Text
                        style={{
                          color:
                            Notification.Status === "Pendiente"
                              ? "orange"
                              : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {Notification.Status}
                      </Text>
                    ) : null}
                    {Notification.Plan ? (
                      <Text style={styles.category}>
                        Plan:{" "}
                        <Text style={styles.answer}>{Notification.Plan}</Text>
                      </Text>
                    ) : null}
                    {Notification.startDate ? (
                      <Text style={styles.category}>
                        Desde:{" "}
                        <Text style={styles.answer}>
                          {Notification.startDate}
                        </Text>
                      </Text>
                    ) : null}
                    {Notification.Suggestion ? (
                      <Text style={styles.category}>
                        Surgenica:{" "}
                        <Text style={styles.answer}>
                          {Notification.Suggestion}
                        </Text>
                      </Text>
                    ) : null}
                    {Notification.userInfo ? (
                      <Text style={styles.category}>
                        De:{" "}
                        <Text style={styles.answer}>
                          {Notification.userInfo.FirstName}{" "}
                          {Notification.userInfo.LastName}
                        </Text>
                      </Text>
                    ) : null}

                    {Notification.Time ? (
                      <Text style={styles.category}>
                        Horario:{" "}
                        <Text style={styles.answer}>{Notification.Time}</Text>
                      </Text>
                    ) : null}
                    {Notification.Goals ? (
                      <Text style={styles.category}>
                        Metas:{" "}
                        <Text style={styles.answer}>{Notification.Goals}</Text>
                      </Text>
                    ) : null}
                    {Notification.Cell ? (
                      <Text style={styles.category}>
                        Cell:{" "}
                        <Text style={styles.answer}>{Notification.Cell}</Text>
                      </Text>
                    ) : null}
                    {Notification.extraInfo ? (
                      <Text style={styles.category}>
                        Extra Info:{" "}
                        <Text style={styles.answer}>
                          {Notification.extraInfo}
                        </Text>
                      </Text>
                    ) : null}
                  </View>
                  {/* {Notification.Suggestion || Notification.Plan ? ( */}
                  <Text style={styles.timeAgo}>{Notification.timestamp}</Text>
                  {/* ) : (
                    <Text style={([styles.timeAgo], { color: "red" })}>
                      Revisar Database
                    </Text>
                  )} */}
                </View>
                {attachment}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "flex-start",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    marginBottom: 5,
    // flexDirection: "row",
    // flexWrap: "wrap",
  },
  category: {
    fontWeight: "bold",
  },
  answer: {
    fontWeight: "normal",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  img: {
    height: 50,
    width: 50,
    margin: 0,
  },
  attachment: {
    position: "absolute",
    right: 0,
    height: 50,
    width: 50,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
  },
  timeAgo: {
    fontSize: 12,
    color: "#696969",
  },
  name: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "bold",
  },
});

export default NotificationScreen;
