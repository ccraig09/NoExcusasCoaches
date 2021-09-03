import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const CoachDetailsScreen = ({ route }) => {
  const { id, data } = route.params;
  const selectedCoach = data.find((key) => key.userId === id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.userImg} source={{ uri: selectedCoach.userImg }} />
        <Text style={styles.userName}>
          {selectedCoach.FirstName} {selectedCoach.LastName}
        </Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>{selectedCoach.country}</Text>

        <View style={styles.userInfoWrapper}></View>
        {/* </View> */}
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{selectedCoach.email}</Text>
          {/* <Text style={styles.userInfoTitle}>{selectedCoach.email}</Text> */}
          {/* <Text style={styles.userInfoSubTitle}>Posts</Text> */}
        </View>
        {/* {posts.map((item) => (
        <PostCard key={item.id} item={item} onDelete={handleDelete} />
      ))} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoachDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
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
    marginBottom: 10,
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
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
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
