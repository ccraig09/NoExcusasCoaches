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
import LottieView from "lottie-react-native";

const ClientResultScreen = ({ route, navigation }) => {
  const { data } = route.params;
  const selectedClient = data;

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.goBack();
    // }, 8000);
  }, []);

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
        <Image
          style={styles.userImg}
          source={{ uri: selectedClient.userImg }}
        />
        <Text style={styles.userName}>
          {selectedClient.FirstName} {selectedClient.LastName}
        </Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>{selectedClient.country}</Text>
        <View style={styles.userBtnWrapper}>
          <Text style={styles.userInfoTitle}>
            Puntos: {selectedClient.points + 1}
          </Text>
          <LottieView
            style={styles.plusLottie}
            source={require("../assets/lottie/plusLottie.json")}
            autoPlay
          />
        </View>
        <View style={styles.userInfoWrapper}></View>
        {/* </View> */}
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{selectedClient.Phone}</Text>
          <Text style={styles.userInfoTitle}>{selectedClient.email}</Text>
          <View
            style={{
              // flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.userInfoTitle}>Plan:</Text>
            <Text style={styles.userInfoTitle}>{selectedClient.plan}</Text>
          </View>
          <Text style={styles.userInfoTitle}>Fecha de inicio:</Text>

          <Text style={styles.userInfoTitle}>{selectedClient.startDate}</Text>
          <Text style={styles.userInfoTitle}>Fecha de Vencimiento:</Text>

          <Text style={styles.userInfoTitle}>{selectedClient.endDate}</Text>
          <Text style={styles.userInfoTitle}>Metas:</Text>

          <Text style={styles.userInfoTitle}>{selectedClient.goal}</Text>
          <Text style={styles.userInfoTitle}>Deporte:</Text>

          <Text style={styles.userInfoTitle}>{selectedClient.sport}</Text>
          <Text style={styles.userInfoTitle}>History Clinica:</Text>

          <Text style={styles.userInfoTitle}>{selectedClient.history}</Text>
          <Text style={styles.userInfoTitle}>{selectedClient.userId}</Text>
          {/* <Text style={styles.userInfoTitle}>{selectedClient.email}</Text> */}
          {/* <Text style={styles.userInfoSubTitle}>Posts</Text> */}
        </View>
        {/* {posts.map((item) => (
        <PostCard key={item.id} item={item} onDelete={handleDelete} />
      ))} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientResultScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 20,
    marginBottom: 20,
    marginTop: 20,
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
    alignItems: "center",
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
  plusLottie: {
    width: 20,
    height: 150,
    marginTop: -50,
    marginLeft: -20,
  },
});
