import React, { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";

const NotificationScreen = (props) => {
  // this.state = {
  //   data: [
  //     {
  //       id: 3,
  //       image: "https://bootdey.com/img/Content/avatar/avatar7.png",
  //       name: "March SoulLaComa",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "https://via.placeholder.com/100x100/FFB6C1/000000",
  //     },
  //     {
  //       id: 2,
  //       image: "https://bootdey.com/img/Content/avatar/avatar6.png",
  //       name: "John DoeLink",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "https://via.placeholder.com/100x100/20B2AA/000000",
  //     },
  //     {
  //       id: 4,
  //       image: "https://bootdey.com/img/Content/avatar/avatar2.png",
  //       name: "Finn DoRemiFaso",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "",
  //     },
  //     {
  //       id: 5,
  //       image: "https://bootdey.com/img/Content/avatar/avatar3.png",
  //       name: "Maria More More",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "",
  //     },
  //     {
  //       id: 1,
  //       image: "https://bootdey.com/img/Content/avatar/avatar1.png",
  //       name: "Frank Odalthh",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "https://via.placeholder.com/100x100/7B68EE/000000",
  //     },
  //     {
  //       id: 6,
  //       image: "https://bootdey.com/img/Content/avatar/avatar4.png",
  //       name: "Clark June Boom!",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "",
  //     },
  //     {
  //       id: 7,
  //       image: "https://bootdey.com/img/Content/avatar/avatar5.png",
  //       name: "The googler",
  //       text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
  //       attachment: "",
  //     },
  //   ],
  // };
  const [notificationList, setNotificationList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
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
                  sort: timestamp,
                });
              });
            });
          setNotificationList(list.sort((a, b) => (a.sort < b.sort ? 1 : -1)));
        } catch (e) {
          console.log(e);
        }
      };

      fetchNotifications();
    }, [])
  );

  return (
    <FlatList
      style={styles.root}
      data={notificationList}
      // extraData={this.state}
      ItemSeparatorComponent={() => {
        return <View style={styles.separator} />;
      }}
      keyExtractor={(item, index) => {
        return index;
      }}
      renderItem={(item) => {
        const Notification = item.item;
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
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={mainContentStyle}>
                <View style={styles.text}>
                  <Text
                    style={
                      ([styles.name],
                      {
                        color:
                          Notification.Title === "Reservacion"
                            ? "#1E90FF"
                            : "purple",
                        fontWeight: "bold",
                      })
                    }
                  >
                    {Notification.Title}
                  </Text>
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
                {Notification.Suggestion || Notification.Plan ? (
                  <Text style={styles.timeAgo}>{Notification.timestamp}</Text>
                ) : (
                  <Text style={([styles.timeAgo], { color: "red" })}>
                    Revisar Database
                  </Text>
                )}
              </View>
              {attachment}
            </View>
          </View>
        );
      }}
    />
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
