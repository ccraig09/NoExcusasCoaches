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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

const actionSheetRef = createRef();
const InformationScreen = ({ navigation }) => {
  const { user, logout, uploadPromo, deletePromoImage } =
    useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [type, setType] = useState("");
  const [notify, setNotify] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [promolist, setPromoList] = useState([]);
  const [premiolist, setPremioList] = useState([]);
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchPromos = async () => {
        setType("");
        setImage(null);
        setPromoData({});
        try {
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
                  Usuario,
                  userImg,
                  Extension,
                  Type,
                  Description,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Caption: Caption,
                  Subtitle: Subtitle,
                  Extension: Extension,
                  Description: Description,
                  Usuario: Usuario,
                  Type: Type,
                  userImg: userImg,
                });
              });
            });
          setPromoList(list.filter((data) => data.Type == "Promocion"));
          setPremioList(list.filter((data) => data.Type == "Premio"));
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
              Description: Description,
              Usuario: Usuario,
              Type: Type,
              userImg: userImg,
            });
          });
        });
      setPromoList(list.filter((data) => data.Type == "Promocion"));
      setPremioList(list.filter((data) => data.Type == "Premio"));
      setContactList(list.filter((data) => data.Type == "Contact"));
    } catch (e) {
      console.log(e);
    }
  };

  const triggerNotificationHandler = () => {
    const clients = clientList.map((code) => code.expoPushToken);
    console.log("Clients list", clients);
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "My first local notification",
    //     body: "this is the first local notification we are sending!",
    //     data: userInfo,
    //   },
    //   trigger: {
    //     seconds: 6,
    //   },
    // });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: clients,
        sound: "default",
        // data: { extraData: scannedUser },
        title: "Nueva Promocion!",
        body: `Tenemos una nueva promocion! Abrir la app para ver los detallas`,
      }),
    });
  };

  const clientNotificationHandler = async () => {
    await clientNotification();
    Alert.alert("Notification Enviado!", "");
    setNotify(false);
    setNotifyTitle("");
    setNotifySubtitle("");
  };

  const clientNotification = () => {
    const clients = clientList.map((code) => code.expoPushToken);
    console.log("Clients list", clients);
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "My first local notification",
    //     body: "this is the first local notification we are sending!",
    //     data: userInfo,
    //   },
    //   trigger: {
    //     seconds: 6,
    //   },
    // });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: clients,
        sound: "default",
        // data: { extraData: scannedUser },
        title: `${notifyTitle}`,
        body: `${notifySubtitle}`,
      }),
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
    const storageRef = firebase
      .storage()
      .ref()
      .child("PromoImages/" + `${promoData.Title}/` + "PromoImage");

    const task = storageRef.put(blob);

    // Set transferred state
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
      setTransferred(
        (
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
        ).toFixed(0)
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
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
                    text: "Premio",
                    style: "default",
                    onPress: () => {
                      setType("Premio");
                      actionSheetRef.current?.setModalVisible();
                    },
                  },
                ]);
              }}
            />
            <Button
              title="Enviar Notificacion"
              onPress={() => {
                setNotify(true);
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
                deletePromoHandler(itemData.item.key, itemData.item.Caption);
              }}
            />
          )}
        />
        <Subtitle>{"Premios".toUpperCase()}</Subtitle>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={premiolist}
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
