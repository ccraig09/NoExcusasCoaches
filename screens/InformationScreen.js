import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createRef,
} from "react";
import {
  View,
  StyleSheet,
  Button,
  RefreshControl,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import ClassItem from "../components/ClassItem";
import { Input } from "react-native-elements";
import PromoItem from "../components/PromoItem";
import { extendMoment } from "moment-range";
import Moment from "moment";
import * as Notifications from "expo-notifications";
import { AuthContext } from "../navigation/AuthProvider";
import styled from "styled-components";
import ActionSheet from "react-native-actions-sheet";
import * as ImagePicker from "expo-image-picker";
import firebase from "../components/firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

const actionSheetRef = createRef();
const InformationScreen = ({ navigation }) => {
  const { uploadPromo, deletePromoImage, storeNotification } =
    useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [type, setType] = useState("");
  const [notify, setNotify] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [promolist, setPromoList] = useState([]);
  const [premio3erlist, setPremio3erList] = useState([]);
  const [premioNoExlist, setPremioNoExList] = useState([]);
  const [contactlist, setContactList] = useState([]);
  const [promoData, setPromoData] = useState([]);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifySubtitle, setNotifySubtitle] = useState("");
  const [baseStartDate, setBaseStartDate] = useState(false);
  const [picked, setPicked] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const storage = getStorage();

  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }

  // const clients = clientList.map((code) => code.expoPushToken);
  // const half_length = Math.ceil(clients.length / 2);
  // var leftSide = clients.splice(0, half_length);
  // let leftSide, rightSide;

  // console.log("left", leftSide);
  // console.log("right", rightSide);
  // console.log("Clients list", leftSide);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPromos = async () => {
        setType("");
        setImage(null);
        setPromoData({});
        try {
          const list = [];
          let sorted;
          await firebase
            .firestore()
            .collection("Promos")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Caption,
                  Subtitle,
                  Usuario,
                  userImg,
                  Extension,
                  Points,
                  Type,
                  Description,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Caption: Caption,
                  Subtitle: Subtitle,
                  Extension: Extension,
                  Points: Points,
                  Description: Description,
                  Usuario: Usuario,
                  Type: Type,
                  userImg: userImg,
                });
                sorted = list.sort((a, b) => (a[Points] < b[Points] ? 1 : -1));
              });
            });
          setPromoList(list.filter((data) => data.Type == "Promocion"));
          setPremio3erList(
            sorted
              .filter((data) => data.Type == "Premio3er")
              .sort((a, b) => (a.Points > b.Points ? 1 : -1))
          );
          setPremioNoExList(
            sorted
              .filter((data) => data.Type == "PremioNoEx")
              .sort((a, b) => (a.Points > b.Points ? 1 : -1))
          );
          setContactList(list.filter((data) => data.Type == "Contact"));
        } catch (e) {
          console.log(e);
        }
      };
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
                  points,
                  startDate,
                  endDate,
                  expoPushToken,
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
                  plan: plan,
                  points: points,
                  startDate: startDate,
                  endDate: endDate,
                  goal: goal,
                  expoPushToken: expoPushToken,
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
      fetchPromos();
    }, [])
  );

  const fetchPromos = async () => {
    console.log("loading promos");
    setType("");
    setImage(null);
    setPromoData({});
    try {
      let sorted;
      const list = [];
      await firebase
        .firestore()
        .collection("Promos")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              Caption,
              Subtitle,
              Extension,
              Points,
              Usuario,
              userImg,
              Type,
              Description,
            } = doc.data();
            list.push({
              key: doc.id,
              Caption: Caption,
              Subtitle: Subtitle,
              Extension: Extension,
              Points: Points,
              Description: Description,
              Usuario: Usuario,
              Type: Type,
              userImg: userImg,
            });
            sorted = list.sort((a, b) => (a[Points] > b[Points] ? 1 : -1));
          });
        });
      setPromoList(list.filter((data) => data.Type == "Promocion"));
      setPremio3erList(
        sorted
          .filter((data) => data.Type == "Premio3er")
          .sort((a, b) => (a.Points > b.Points ? 1 : -1))
      );
      setPremioNoExList(
        sorted
          .filter((data) => data.Type == "PremioNoEx")
          .sort((a, b) => (a.Points > b.Points ? 1 : -1))
      );
      setContactList(list.filter((data) => data.Type == "Contact"));
    } catch (e) {
      console.log(e);
    }
  };

  const triggerNotificationHandler = async () => {
    await storeNotification(
      "Nueva Promocion!",
      "Tenemos una nueva promocion! Abrir la app para ver los detalles"
    );
    const clients = clientList.map((code) => code.expoPushToken);

    const filteredClients = clients.filter(
      (element) => ![undefined].includes(element)
    );
    // var splitClients = splitArrayIntoChunksOfLen(
    //   filteredClients,
    //   filteredClients.length / 5
    // );

    filteredClients.forEach((element) => {
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
          // data: { extraData: scannedUser },
          title: "Nueva Promocion!",
          body: `Tenemos una nueva promocion! Abrir la app para ver los detallas`,
        }),
      });
    });


  const clientNotificationHandler = async () => {
    await storeNotification(notifyTitle, notifySubtitle);
    await clientNotification();
    Alert.alert("Notification Enviado!", "");
    setNotify(false);
    setNotifyTitle("");
    setNotifySubtitle("");
  };

  const clientNotification = () => {
    const clients = clientList.map((code) => code.expoPushToken);

    const filteredClients = clients.filter(
      (element) => ![undefined].includes(element)
    );

    filteredClients.forEach((element) => {
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
          // data: { extraData: scannedUser },
          title: `${notifyTitle}`,
          body: `${notifySubtitle}`,
        }),
      });
    });
  };

  const deletePromoHandler = (key, title) => {
    Alert.alert("Borrar Promo?", "", [
      {
        text: "No",
        style: "destructive",
      },
      {
        text: "Si",
        style: "default",
        onPress: async () => {
          await deletePromoImage(key, title);
          fetchPromos();
        },
      },
    ]);
  };
  const cancelUploadHandler = () => {
    Alert.alert("Borrar Promo?", "", [
      {
        text: "No",
        style: "destructive",
      },
      {
        text: "Si",
        style: "default",
        onPress: () => {
          setImage(null);
          setPromoData({});
        },
      },
    ]);
  };

  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      actionSheetRef.current?.hide();
    }
  };

  const choosePhotoFromLibrary = async () => {
    console.log("opening gallery");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      actionSheetRef.current?.hide();
    }
  };

  const submitChanges = async () => {
    let imageUrl = await uploadImage();
    console.log("image?", imageUrl);
    // if (imageUrl == null && userInfo.userImg) {
    //   imageUrl = userInfo.userImg;
    // }
    // if (imageUrl == null && userInfo.userImg == null) {
    //   imageUrl = null;
    // }

    await uploadPromo(promoData, imageUrl, type);
    setUploading(false);

    if (type === "Promocion") {
      triggerNotificationHandler();
    }
    Alert.alert(`${type} Subido!`, `Tu ${type} se ha subido exitosamente!`);
    fetchPromos();
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    // const uploadUri = image;
    const response = await fetch(image);
    const blob = await response.blob();
    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    setUploading(true);
    setTransferred(0);
    const storageRef = ref(
      storage,
      "PromoImages/" + `${promoData.Subtitle}/` + "PromoImage"
    );

    const task = uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      // });

      // const uploadTask = uploadBytesResumable(storageRef, blob);

      // // Set transferred state
      // uploadTask.on("state_changed", (snapshot) => {
      //   // Observe state change events such as progress, pause, and resume
      //   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   setTransferred(progress);
      //   console.log("Upload is " + progress + "% done");
      //   switch (snapshot.state) {
      //     case "paused":
      //       console.log("Upload is paused");
      //       break;
      //     case "running":
      //       console.log("Upload is running");
      //       break;
      //   }
      // });

      try {
        task;

        const url = getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL;
        });

        return url;
      } catch (e) {
        console.log(e);
        return null;
      }
    });
  };

  const loadDetails = () => {
    fetchPromos();
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={["#FF4949", "#FF4949"]}
            // refreshing={isRefreshing}
            onRefresh={loadDetails}
          />
        }
      >
        <ActionSheet ref={actionSheetRef} bounceOnOpen={true}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.panelTitle}>Subir Foto</Text>
            <Text style={styles.panelSubtitle}>Eligir Foto</Text>
          </View>

          <TouchableOpacity
            style={styles.panelButton}
            onPress={takePhotoFromCamera}
          >
            <Text style={styles.panelButtonTitle}>Abrir Camara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={choosePhotoFromLibrary}
          >
            <Text style={styles.panelButtonTitle}>Abrir Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => {
              actionSheetRef.current?.hide();
            }}
          >
            <Text style={styles.panelButtonTitle}>Cancelar</Text>
          </TouchableOpacity>
        </ActionSheet>

        {image == null && (
          <View>
            <Button
              title="Subir Promocion o Premio"
              onPress={() => {
                Alert.alert("Elige un opcion?", "", [
                  {
                    text: "Promocion",
                    style: "default",
                    onPress: () => {
                      setType("Promocion");
                      actionSheetRef.current?.setModalVisible();
                    },
                  },
                  {
                    text: "Premio Tercera",
                    style: "default",
                    onPress: () => {
                      setType("Premio3er");
                      actionSheetRef.current?.setModalVisible();
                    },
                  },
                  {
                    text: "Premio por gym",
                    style: "default",
                    onPress: () => {
                      setType("PremioNoEx");
                      actionSheetRef.current?.setModalVisible();
                    },
                  },
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
                ]);
              }}
            />
            {/* <Button
              title="test"
              onPress={() => {
                clientNotification();
              }}
            /> */}
            <Button
              title="Enviar Notificacion"
              onPress={() => {
                setNotify(true);
              }}
            />
            <Button
              title="Agregar Video"
              onPress={() => {
                navigation.navigate("AddVideoScreen");
              }}
            />
            <Button
              title="Subir Contacto info"
              onPress={() => {
                Alert.alert(
                  "Subir informacion por la secion de Contacto?",
                  "",
                  [
                    {
                      text: "Cancelar",
                      style: "destructive",
                    },
                    {
                      text: "Si",
                      style: "default",
                      onPress: () => {
                        // setNotify(true);
                        setType("Contact");
                        actionSheetRef.current?.setModalVisible();
                      },
                    },
                  ]
                );
              }}
            />
          </View>
        )}
        <View
          style={{
            // height: 200,
            // width: ,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 40,
          }}
        >
          <Image
            source={{ uri: `${image}` }}
            style={{ height: 200, width: 200 }}
            imageStyle={{ borderRadius: 15 }}
          ></Image>
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
                  clientNotificationHandler();
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
          {image !== null && (
            <View>
              <View style={styles.action}>
                <Input
                  label="Titulo"
                  leftIcon={{ type: "font-awesome", name: "edit" }}
                  placeholder="Titulo"
                  placeholderTextColor="#666666"
                  style={styles.textInput}
                  value={promoData.Title ? promoData.Title : ""}
                  onChangeText={(text) =>
                    setPromoData({ ...promoData, Title: text })
                  }
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
                  value={promoData.Subtitle ? promoData.Subtitle : ""}
                  onChangeText={(text) =>
                    setPromoData({ ...promoData, Subtitle: text })
                  }
                  autoCorrect={false}
                />
              </View>
              <View style={styles.action}>
                {type === "PremioNoEx" && (
                  <Input
                    label="Puntos"
                    leftIcon={{ type: "font-awesome", name: "edit" }}
                    placeholder="Puntos"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    style={styles.textInput}
                    value={promoData.Points ? promoData.Points : ""}
                    onChangeText={(text) =>
                      setPromoData({ ...promoData, Points: text })
                    }
                    autoCorrect={false}
                  />
                )}
                {type === "Premio3er" && (
                  <Input
                    label="Puntos"
                    leftIcon={{ type: "font-awesome", name: "edit" }}
                    placeholder="Puntos"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    style={styles.textInput}
                    value={promoData.Points ? promoData.Points : ""}
                    onChangeText={(text) =>
                      setPromoData({ ...promoData, Points: text })
                    }
                    autoCorrect={false}
                  />
                )}
              </View>
              <View style={styles.action}>
                <Input
                  label="Descripcion"
                  leftIcon={{ type: "font-awesome", name: "edit" }}
                  placeholder="Descripcion"
                  placeholderTextColor="#666666"
                  style={styles.textInput}
                  value={promoData.Description ? promoData.Description : ""}
                  onChangeText={(text) =>
                    setPromoData({ ...promoData, Description: text })
                  }
                  autoCorrect={false}
                />
              </View>
              <View style={styles.action}>
                <Input
                  label="si hay una Extension"
                  leftIcon={{ type: "font-awesome", name: "edit" }}
                  placeholder="e.j pagina web, google maps, instagram etc"
                  placeholderTextColor="#666666"
                  style={styles.textInput}
                  value={promoData.Extension ? promoData.Extension : ""}
                  onChangeText={(text) =>
                    setPromoData({ ...promoData, Extension: text })
                  }
                  autoCorrect={false}
                />
              </View>
            </View>
          )}
          {image !== null &&
            (uploading ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text>{transferred}% Completado</Text>
                <ActivityIndicator size="large" color="0000ff" />
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.commandButton}
                  onPress={cancelUploadHandler}
                >
                  <Text style={styles.panelButtonTitle}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.commandButton}
                  onPress={submitChanges}
                >
                  <Text style={styles.panelButtonTitle}>Subir</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
        <Subtitle>{"Promociones".toUpperCase()}</Subtitle>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={promolist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              extension={itemData.item.Extension}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
              onLongPress={() => {
                deletePromoHandler(itemData.item.key, itemData.item.Subtitle);
              }}
            />
          )}
        />
        <Subtitle>{"Premios".toUpperCase()}</Subtitle>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={premio3erlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              extension={itemData.item.Extension}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
              onLongPress={() => {
                deletePromoHandler(itemData.item.key, itemData.item.Caption);
              }}
            />
          )}
        />
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={premioNoExlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              extension={itemData.item.Extension}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
              onLongPress={() => {
                deletePromoHandler(itemData.item.key, itemData.item.Caption);
              }}
            />
          )}
        />
        <Subtitle>{"Contacto".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={contactlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              extension={itemData.item.Extension}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
              onLongPress={() => {
                deletePromoHandler(itemData.item.key, itemData.item.Caption);
              }}
            />
          )}
        />
      </ScrollView>
    </View>
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
  screen: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 7,
    width: 200,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});

export default InformationScreen;
