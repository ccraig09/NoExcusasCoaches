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

const NotificationScreenHistory = (props) => {
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
            .collection("ClientNotificationHistory")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, subtitle, timestamp, userId } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  subtitle: subtitle,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
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
        return index.toString();
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
                  <Text style={styles.name}>{Notification.title}</Text>
                  <Text>{Notification.subtitle}</Text>
                </View>
                <Text style={styles.timeAgo}>{Notification.timestamp}</Text>
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
  },
});

export default NotificationScreenHistory;
