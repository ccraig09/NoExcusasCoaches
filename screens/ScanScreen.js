import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  SectionList,
  ActivityIndicator,
  LogBox,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Audio } from "expo-av";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import Colors from "../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import { extendMoment } from "moment-range";
import * as Notifications from "expo-notifications";
import { Video } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});
const ScanScreen = ({ navigation, route }) => {
  const { coachList } = route.params;
  const [scanned, setScanned] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [scannedClient, setScannedClient] = useState();
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedModal, setScannedModal] = useState(false);
  const { logScan, addPoints } = useContext(AuthContext);
  const [clientList, setClientList] = useState([]);
  const [sound, setSound] = React.useState();
  const moment = extendMoment(Moment);

  useEffect(() => {
    // loadDetails();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    })();
  }, []);

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("background", response);
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

  const triggerNotificationHandler = (scannedUser) => {
    const coaches = coachList.map((code) => code.expoPushToken);

    const filteredCoaches = coaches.filter(
      (element) => ![undefined].includes(element)
    );
    console.log("cheses", filteredCoaches);

    filteredCoaches.forEach((element) => {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: element,
          sound: "default",
          data: { extraData: scannedUser },
          title: "Nuevo inicio de sesion",
          body: `${scannedUser.FirstName} acabo de iniciar sesion`,
        }),
      });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // console.log("loading home and user", user);
      const fetchClients = async () => {
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
                  startDate,
                  points,
                  lastSignIn,
                  endDate,
                  goal,
                  history,
                  sport,
                  userId,
                } = doc.data();
                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  lastSignIn: lastSignIn,
                  plan: plan,
                  points: points,
                  startDate: startDate,
                  endDate: endDate,
                  goal: goal,
                  history: history,
                  sport: sport,
                  createdAt: createdAt,
                  userId: userId,
                });
              });
            });
          setClientList(list);
        } catch (e) {
          console.log(e);
        }
      };

      fetchClients();
    }, [])
  );

  const fetchClients = async () => {
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
              startDate,
              points,
              lastSignIn,
              endDate,
              goal,
              history,
              sport,
              userId,
            } = doc.data();
            list.push({
              key: doc.id,
              FirstName: FirstName,
              LastName: LastName,
              userImg: userImg,
              email: email,
              Phone: Phone,
              lastSignIn: lastSignIn,
              plan: plan,
              points: points,
              startDate: startDate,
              endDate: endDate,
              goal: goal,
              history: history,
              sport: sport,
              createdAt: createdAt,
              userId: userId,
            });
          });
        });
      setClientList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setOpenScanner(false);
    setScannedModal(true);
    console.log(data);
    const scannedUser = clientList.find((cod) => cod.userId === data);
    //  setScannedClient(scannedUser);

    // console.log(scannedClient);

    async function playSound() {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/loginTone.mp3")
      );
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    }
    async function playError() {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/errorBeep.mp3")
      );
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    }

    const date = moment().format("MM/DD/YYYY");
    console.log(date);
    if (date === scannedUser.lastSignIn) {
      playError();

      Alert.alert("Ya iniciaste tu sesion por hoy");
    } else {
      playSound();
      triggerNotificationHandler(scannedUser);
      await addPoints(scannedUser, date);
      logScan(scannedUser, date);
      navigation.navigate("Client", {
        data: scannedUser,
      });
    }
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: "https://drive.google.com/uc?export=download&id=1mpMVYsFp402M5WkNLjPtg6eNVZLW03Jv",
        }}
        style={styles.backgroundVideo}
        rate={1}
        shouldPlay={true}
        isLooping={true}
        volume={0}
        muted={true}
        resizeMode="cover"
      />
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            fetchClients();
          }}
          style={styles.panelButton}
        >
          {/* color={Colors.noExprimary} */}
          <Text style={styles.panelButtonTitle}>Refrescar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOpenScanner((prevState) => !prevState);
          }}
          style={styles.panelButton}
        >
          {/* color={Colors.noExprimary} */}
          <Text style={styles.panelButtonTitle}>
            {openScanner ? "Cancelar" : "Iniciar Sesion"}
          </Text>
        </TouchableOpacity>
        {/* <Modal animationType="slide" transparent={true} visible={scannedModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalEdit2}>
                Bienvenido {scannedClient.FirstName}
              </Text>
            </View>
          </View>
        </Modal> */}
      </View>
      {openScanner && (
        <View
          style={{
            height: "90%",
            width: "100%",
            marginBottom: 40,
            marginTop: 10,
          }}
        >
          <BarCodeScanner
            // barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            type={"front"}
          />
        </View>
      )}
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    width: "95%",
    margin: 20,
    backgroundColor: "#F5F3F3",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalEdit2: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    // fontWeight: "bold",
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 7,
    width: 350,
  },
  panelButtonTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
