import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  Fragment,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
  Modal,
  Alert,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { ListItem, Avatar } from "react-native-elements";
import { Input } from "react-native-elements";
import { AuthContext } from "../navigation/AuthProvider";
import EvalBlock from "../components/EvalBlock";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from "moment";
import { extendMoment } from "moment-range";

import * as DocumentPicker from "expo-document-picker";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const ClientDetailsScreen = ({ route, navigation }) => {
  const { userNotificationReceipt, addPdfDoc, newEval, deleteEval } =
    useContext(AuthContext);

  const { id, data } = route.params;
  const [notify, setNotify] = useState(false);
  const [selectedClient, setSelectedClient] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifySubtitle, setNotifySubtitle] = useState("");
  const [fileName, setFileName] = useState();
  const [blobFile, setBlobFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const [userEvals, setUserEvals] = useState([]);
  const [evalDateModal, setEvalDateModal] = useState(false);

  const storage = getStorage();
  const moment = extendMoment(Moment);

  // const selectedClient = data.find((key) => key.userId === id);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("loading home and user", user);
      const fetchClientDetails = async () => {
        try {
          await firebase
            .firestore()
            .collection("Members")
            .doc(id)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data());
                setSelectedClient(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };
      const fetchMemberEvals = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(id)
            .collection("Member Evals")
            .orderBy("title", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, ownerId, timeStamp } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  ownerId: ownerId,
                  timeStamp: timeStamp,
                });
              });
            });
          setUserEvals(list);
        } catch (e) {
          console.log(e);
        }
      };
      fetchClientDetails();
      fetchMemberEvals();
    }, [])
  );

  const list = [
    //map out details?
    {
      title: "Plan:",
      data: selectedClient.plan,
    },
    {
      title: "Fecha de inicio:",
      data: selectedClient.startDate,
    },
    {
      title: "Fecha de vencimiento:",
      data: selectedClient.endDate,
    },
    {
      title: "Notas:",
      data: selectedClient.notes,
    },
    {
      title: "Metas:",
      data: selectedClient.goal,
    },
    {
      title: "Oficio:",
      data: selectedClient.sport,
    },
    {
      title: "History clinica:",
      data: selectedClient.history,
    },
  ];

  const selectEvalHandler = (id, title, time) => {
    navigation.navigate("Eval", {
      Age: selectedClient.Age,
      Gender: selectedClient.Gender,
      evalId: id,
      evalTitle: title,
      evalDate: time,
    });
  };

  const addPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result != null) {
      const r = await fetch(result.uri);
      const b = await r.blob();
      setFileName(result.name);
      setBlobFile(b);
    }
    let pdfDoc = await uploadFile();
    console.log(">>>>>pdf doc", pdfDoc);
  };

  const postPdf = async () => {
    console.log("url", pdfLink);
    await addPdfDoc(selectedClient, pdfLink);
    Alert.alert("PDF Subido!", "El PDF se ha Subido exitosamente!");
  };

  const uploadFile = async () => {
    const storageRef = ref(
      storage,
      "UserPDF/" + `${selectedClient.userId}/` + "PDFDoc"
    );

    const task = uploadBytes(storageRef, blobFile).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      try {
        task;

        const url = getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPdfDoc(downloadURL);
          return downloadURL;
        });
        return url;
      } catch (e) {
        console.log(">>error:", e);
        return null;
      }
    });
  };

  const triggerNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: selectedClient.expoPushToken,
        sound: "default",
        // data: { extraData: scannedUser },
        title: `${notifyTitle}`,
        body: `${notifySubtitle}`,
      }),
    });
    userNotificationReceipt(
      notifyTitle,
      notifySubtitle,
      selectedClient.expoPushToken,
      selectedClient.FirstName,
      selectedClient.LastName,
      selectedClient
    );
    Alert.alert("Notification Enviado!", "");
    setNotify(false);
    setNotifyTitle("");
    setNotifySubtitle("");
  };

  const fetchMemberEvals = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(id)
        .collection("Member Evals")
        .orderBy("title", "asc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { title, ownerId, timeStamp } = doc.data();
            list.push({
              key: doc.id,
              title: title,
              ownerId: ownerId,
              timeStamp: timeStamp,
            });
          });
        });
      setUserEvals(list);
    } catch (e) {
      console.log(e);
    }
  };

  const dateHandler = useCallback(async (date) => {
    setEvalDateModal(false);
    var dateChanged = moment(date).format("DD-MM-YYYY");
    addEvalHandler(dateChanged);
    setEvalDateModal(false);
  });

  const addEvalHandler = async (dateChanged) => {
    await newEval(dateChanged, selectedClient.userId);
    fetchMemberEvals();
  };

  const deleteHandler = async (docId) => {
    Alert.alert("Borrar Evaluacion?", "Quiere borrar este evaluación?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          await deleteEval(docId, selectedClient.userId);
          fetchMemberEvals();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Edit");
          }}
        >
          <Avatar
            rounded
            // avatarStyle={styles.userImg}
            size={150}
            icon={{ name: "user", type: "font-awesome" }}
            source={{ uri: selectedClient.userImg }}
            onPress={() => {
              navigation.navigate("EditClient", {
                clientData: selectedClient,
              });
            }}
          >
            <Avatar.Accessory
              name="pencil-outline"
              type="material-community"
              size={40}
              onPress={() => {
                navigation.navigate("EditClient", {
                  clientData: selectedClient,
                });
              }}
              // color="black"
            />
          </Avatar>
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>
        {selectedClient.FirstName} {selectedClient.LastName}
      </Text>
      <Text style={styles.userInfoTitle}>{selectedClient.Phone}</Text>
      <Text style={styles.userInfoTitle}>{selectedClient.email}</Text>
      <View style={styles.userBtnWrapper}>
        <Button
          title={"Enviar notificacion"}
          onPress={() => {
            setNotify(true);
          }}
        />
      </View>
      {notify && (
        <View>
          <View style={styles.action}>
            <Input
              label="Titulo"
              leftIcon={{ type: "font-awesome", name: "edit" }}
              placeholder="Titulo"
              placeholderTextColor="#666666"
              style={styles.textInput}
              value={notifyTitle}
              onChangeText={(text) => setNotifyTitle(text)}
              autoCorrect={false}
            />
          </View>
          <View style={styles.action}>
            <Input
              label="Subtitulo"
              leftIcon={{ type: "font-awesome", name: "edit" }}
              placeholder="Subtitulo"
              placeholderTextColor="#666666"
              style={styles.textInput}
              value={notifySubtitle}
              onChangeText={(text) => setNotifySubtitle(text)}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={
              notifyTitle === "" || notifySubtitle === ""
                ? styles.commandButtonDsiabled
                : styles.commandButton
            }
            onPress={() => {
              triggerNotificationHandler();
            }}
            disabled={
              notifyTitle === "" || notifySubtitle === "" ? true : false
            }
          >
            <Text style={styles.panelButtonTitle}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => {
              setNotify(false);
              setNotifyTitle("");
              setNotifySubtitle("");
            }}
          >
            <Text style={styles.panelButtonTitle}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <Text style={styles.userInfoPoints}>
          Puntos Acumulados: {selectedClient.points}
        </Text>
        <Button
          title={"Agregar Pdf"}
          onPress={() => {
            setPdfModal(true);
          }}
        />
        {pdfModal && (
          <>
            <View style={styles.action}>
              <Input
                label="Enlace"
                leftIcon={{ type: "font-awesome", name: "edit" }}
                placeholder="Enlace"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={pdfLink}
                onChangeText={(text) => setPdfLink(text)}
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={
                pdfLink === ""
                  ? styles.commandButtonDsiabled
                  : styles.commandButton
              }
              onPress={() => {
                postPdf();
              }}
              disabled={pdfLink === "" ? true : false}
            >
              <Text style={styles.panelButtonTitle}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => {
                setPdfModal(false);
              }}
            >
              <Text style={styles.panelButtonTitle}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Nuevo Evaluacion",
            "Quisieras agregar una nueva evaluacion?",
            [
              {
                text: "Si",
                onPress: () => setEvalDateModal(true),
              },
              {
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]
          );
        }}
        style={{ marginRight: 20 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 10, color: "silver" }}>
              Agregar Evaluación{" "}
            </Text>
          </View>
          <View
            style={{
              width: 35,
              height: 30,
              borderColor: Colors.noExBright,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
            }}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-add" : "ios-add"}
              size={20}
              color="grey"
            />
          </View>
        </View>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Evals:</Text>

      {userEvals.length === 0 ? (
        <View
          style={{
            height: 200,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              padding: 10,
              fontSize: 15,
              textAlign: "center",
              color: "#b8bece",
            }}
          >
            Oprime el {<Text style={{ fontSize: 25 }}>'+'</Text>} para crear tu
            primer evaluación.
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={userEvals}
          keyExtractor={(item) => item.key}
          renderItem={(itemData) => (
            <EvalBlock
              title={itemData.item.title}
              onSelect={() => {
                selectEvalHandler(
                  itemData.item.key,
                  itemData.item.title,
                  itemData.item.timeStamp
                );
              }}
              longPress={() => {
                deleteHandler(itemData.item.key);
              }}
            />
          )}
        />
      )}
      {evalDateModal && (
        <View>
          <DateTimePicker
            mode="date"
            isVisible={evalDateModal}
            locale="es-ES"
            onConfirm={
              (date) => {
                dateHandler(date);
              }
              // this.handleDatePicked(date, "start", "showStart")
            }
            onCancel={() => {
              setEvalDateModal(false);
            }}
            cancelTextIOS={"Cancelar"}
            confirmTextIOS={"Confirmar"}
            headerTextIOS={"Elige una fecha"}
          />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainbox}>
          {list.map((l, i) => (
            <ListItem key={i} bottomDivider>
              {/* <Avatar source={{ uri: l.avatar_url }} /> */}
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>
                  {l.title}
                </ListItem.Title>

                <ListItem.Subtitle>{l.data}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>

        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitleId}>{selectedClient.userId}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImg: {
    marginTop: 20,
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  border: {
    flexDirection: "row",
    width: Dimensions.get("window").width / 1.2,
    borderWidth: 0.7,
    borderColor: "black",
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
    marginVertical: 10,
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
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: "center",
    padding: 10,
  },
  userInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoPoints: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: Colors.noExprimary,
  },
  userInfoTitleId: {
    color: "silver",
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
  action: {
    flexDirection: "row",
    // marginTop: 5,
    // marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  commandButtonDsiabled: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "silver",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
});
