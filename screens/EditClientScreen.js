import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  createRef,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Button,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Moment from "moment";
import localization from "moment/locale/es-us";
import "moment/locale/es";
import { extendMoment } from "moment-range";
import InfoText from "../components/InfoText";
import { Input } from "react-native-elements";

import { AuthContext } from "../navigation/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import DateTimePicker from "react-native-modal-datetime-picker";
import ActionSheet from "react-native-actions-sheet";

import Colors from "../constants/Colors";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
// import BottomSheet from "reanimated-bottom-sheet";

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import firebase from "../components/firebase";

import * as ImagePicker from "expo-image-picker";

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};
const actionSheetRef = createRef();

const EditClientScreen = ({ navigation, route }) => {
  const { user, editClient, logout } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [baseStartDate, setBaseStartDate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [picked, setPicked] = useState();
  const [notes, setNotes] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height);
  const selectedClient = route.params;
  let actionSheet;

  const moment = extendMoment(Moment);

  let catArray = ["Eligir Plan", "3 dias", "6 dias"];
  let catOptions = catArray;
  const dateHandlerBaseStart = useCallback(async (date) => {
    setBaseStartDate(false);
    var dateChanged = moment(date).format("DD-MM-YYYY");
    setUserInfo({ ...userInfo, BaseStartDate: dateChanged });
  });

  const dateHandlerStart = useCallback(async (date) => {
    setStartDate(false);
    var dateChanged = moment(date).format("DD-MM-YYYY");
    setUserInfo({ ...userInfo, startDate: dateChanged });
  });
  const dateHandlerEnd = useCallback(async (date) => {
    setEndDate(false);
    var dateChanged = moment(date).format("DD-MM-YYYY");
    setUserInfo({ ...userInfo, endDate: dateChanged });
  });

  useEffect(() => {
    (async () => {
      // if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "¡Permisos insuficientes!",
          "Lo siento, necesitamos permiso para acceder a la cámara.",
          [{ text: "Listo" }]
        );
      }
      // }
    })();
    console.log("this the selected", selectedClient.clientData);
    setUserInfo(selectedClient.clientData);
    setImage(selectedClient.clientData.userImg);

    // const fetchMemberDetails = async () => {
    //   try {
    //     await firebase
    //       .firestore()
    //       .collection("Coaches")
    //       .doc(user.uid)
    //       .get()
    //       .then((doc) => {
    //         if (doc.exists) {
    //           // console.log("Document data:", doc.data());
    //           setUserInfo(doc.data());
    //         } else {
    //           // doc.data() will be undefined in this case
    //           console.log("No such document!");
    //         }
    //       });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    // fetchMemberDetails();
  }, []);
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
    console.log(imageUrl);
    if (imageUrl == null && userInfo.userImg) {
      imageUrl = userInfo.userImg;
    }
    if (imageUrl == null && userInfo.userImg == null) {
      imageUrl = null;
    }

    editClient(userInfo, imageUrl, notes);
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
      .child("UserProfileImages/" + `${user.uid}/` + "ProfileImage");

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
      Alert.alert(
        "Cliente Actualizado!",
        "El Cliente se ha actualizado exitosamente!"
      );

      navigation.goBack();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActionSheet ref={actionSheetRef} bounceOnOpen={true}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.panelTitle}>Subir Foto</Text>
          <Text style={styles.panelSubtitle}>Eligir Foto de Perfil</Text>
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

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            actionSheetRef.current?.setModalVisible();
          }}
        >
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={{ uri: `${image}` }}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  size={35}
                  color="#fff"
                  style={{
                    opacity: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#fff",
                    borderRadius: 10,
                  }}
                />
                {image == null && <Text>Agregar Foto</Text>}
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
          {userInfo
            ? typeof userInfo.FirstName === "undefined"
              ? ""
              : userInfo.FirstName
            : ""}
          <Text> </Text>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {userInfo
              ? typeof userInfo.LastName === "undefined"
                ? ""
                : userInfo.LastName
              : ""}
          </Text>
        </Text>
      </View>
      <ScrollView>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.FirstName : ""}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, FirstName: text })
            }
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.LastName : ""}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, LastName: text })
            }
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="phone" size={20} />
          <TextInput
            placeholder={"Celular"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Phone : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Phone: text })}
            autoCorrect={false}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" size={20} />
          <TextInput
            placeholder="Correo"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.email : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="check" size={20} />
          <TextInput
            placeholder="Metas"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.goal : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, goal: text })}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="hospital-o" size={20} />
          <TextInput
            placeholder="Historia Clinica"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.history : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, history: text })}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="soccer-ball-o" size={20} />
          <TextInput
            placeholder="Deporte"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.sport : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, sport: text })}
            autoCorrect={false}
          />
        </View>
        {/* <View style={styles.action}> */}
        <TouchableOpacity
          onPress={() => {
            setShowPicker((prevState) => !prevState);
          }}
          style={styles.action}
        >
          <FontAwesome name="calendar" size={20} />
          <Text style={styles.textInput}>
            Plan: {userInfo ? userInfo.plan : ""}
          </Text>

          {showPicker && (
            <View
              style={{
                // flex: 1,
                width: "90%",
                // height: "50%",
                marginRight: 10,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={picked}
                mode="dropdown"
                value={userInfo ? userInfo.plan : ""}
                style={{
                  // height: 30,
                  // marginTop: 20,
                  marginBottom: 30,
                  width: "100%",
                  justifyContent: "center",
                }}
                itemStyle={{ fontSize: 16 }}
                onValueChange={(picked) =>
                  setUserInfo({ ...userInfo, plan: picked })
                }
                // setShowPicker(false);
              >
                {catOptions.map((item, index) => {
                  return <Picker.Item label={item} value={item} key={index} />;
                })}
              </Picker>
              <Button
                style={{ marginTop: 20 }}
                title="Guardar"
                onPress={() => setShowPicker(false)}
              />
            </View>
          )}
        </TouchableOpacity>
        {/* </View> */}
        <TouchableOpacity
          style={styles.action}
          onPress={() => {
            setStartDate((prevState) => !prevState);
          }}
        >
          <FontAwesome name="calendar-check-o" size={20} />
          <Text style={styles.textInput}>
            Fecha de Inicio: {userInfo ? userInfo.startDate : ""}
          </Text>

          {startDate && (
            <View>
              <DateTimePicker
                mode="date"
                isVisible={startDate}
                locale="es-ES"
                onConfirm={
                  (date) => {
                    dateHandlerStart(date);
                  }
                  // this.handleDatePicked(date, "start", "showStart")
                }
                onCancel={() => {
                  setStartDate(false);
                }}
                cancelTextIOS={"Cancelar"}
                confirmTextIOS={"Confirmar"}
                headerTextIOS={"Elige una fecha"}
              />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action}
          onPress={() => {
            setEndDate((prevState) => !prevState);
          }}
        >
          <FontAwesome name="calendar-times-o" size={20} />
          <Text style={styles.textInput}>
            Fecha de Vencimiento: {userInfo ? userInfo.endDate : ""}
          </Text>

          {endDate && (
            <View>
              <DateTimePicker
                mode="date"
                isVisible={endDate}
                locale="es-ES"
                onConfirm={
                  (date) => {
                    dateHandlerEnd(date);
                  }
                  // this.handleDatePicked(date, "start", "showStart")
                }
                onCancel={() => {
                  setEndDate(false);
                }}
                cancelTextIOS={"Cancelar"}
                confirmTextIOS={"Confirmar"}
                headerTextIOS={"Elige una fecha"}
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.action}>
          <Input
            label="Notas"
            leftIcon={{ type: "font-awesome", name: "sticky-note-o" }}
            placeholder={selectedClient.notes ? selectedClient.notes : notes}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            autoCorrect={false}
            returnKeyType="done"
            multiline
          />
        </View>

        <InfoText text="Informacion Basico" />
        <View style={styles.action}>
          <Input
            label="Edad"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            placeholder={"Edad"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Age : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Age: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Estatura"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            placeholder={"Estatura"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Height : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Height: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Peso"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            placeholder={"Peso"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Weight : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Weight: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowPicker((prevState) => !prevState);
          }}
          style={styles.action}
        >
          <FontAwesome name="calendar" size={20} />
          <Text style={styles.textInput}>
            Género: {userInfo ? userInfo.Gender : ""}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <View
            style={{
              // flex: 1,
              width: "90%",
              // height: "50%",
              marginRight: 10,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Picker
              selectedValue={picked}
              mode="dropdown"
              value={userInfo ? userInfo.Gender : ""}
              style={{
                // height: 50,
                // marginTop: 20,
                marginBottom: 10,
                width: "100%",
                justifyContent: "center",
              }}
              itemStyle={{ fontSize: 16 }}
              onValueChange={(picked) =>
                setUserInfo({ ...userInfo, Gender: picked })
              }
              // setShowPicker(false);
            >
              {/* {genderOptions.map((item, index) => { */}
              <Picker.Item label="Elige un género" color="grey" value="N/A" />
              <Picker.Item label="Masculino" color="blue" value="M" />
              <Picker.Item label="Femenino" color="red" value="F" />
            </Picker>
            <Button
              style={{ marginTop: 20 }}
              title="Guardar"
              onPress={() => setShowPicker(false)}
            />
          </View>
        )}
        {/* </TouchableOpacity> */}
        <InfoText text="Evaluacion" />
        <TouchableOpacity
          style={styles.action}
          onPress={() => {
            setBaseStartDate((prevState) => !prevState);
          }}
        >
          <FontAwesome name="calendar-check-o" size={20} />
          <Text style={styles.textInput}>
            Fecha de Inicio: {userInfo ? userInfo.BaseStartDate : ""}
          </Text>

          {baseStartDate && (
            <View>
              <DateTimePicker
                mode="date"
                isVisible={baseStartDate}
                locale="es-ES"
                onConfirm={
                  (date) => {
                    dateHandlerBaseStart(date);
                  }
                  // this.handleDatePicked(date, "start", "showStart")
                }
                onCancel={() => {
                  setBaseStartDate(false);
                }}
                cancelTextIOS={"Cancelar"}
                confirmTextIOS={"Confirmar"}
                headerTextIOS={"Elige una fecha"}
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.action}>
          <Input
            label="IMC"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"IMC"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Imc : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Imc: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Grasa"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Grasa"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Grasa : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Grasa: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Musculo"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Musculo"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Musculo : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Musculo: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Metabolismo Basal"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Metabolismo Basal"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Basal : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Basal: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Meta Metabolismo Basal"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Meta Metabolismo Basal"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.GoalBasal : ""}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, GoalBasal: text })
            }
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Agua"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Agua"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Agua : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Agua: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Proteina"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Proteina"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Proteina : ""}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, Proteina: text })
            }
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Masa Osea"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Masa Osea"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Osea : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Osea: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Edad Metabolica"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Edad Metabolica"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Metabolica : ""}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, Metabolica: text })
            }
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Grasa Viseral"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Grasa Viseral"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={userInfo ? userInfo.Viseral : ""}
            onChangeText={(text) => setUserInfo({ ...userInfo, Viseral: text })}
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
      </ScrollView>

      {uploading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>{transferred}% Completado</Text>
          <ActivityIndicator size="large" color="0000ff" />
        </View>
      ) : (
        <TouchableOpacity style={styles.commandButton} onPress={submitChanges}>
          <Text style={styles.panelButtonTitle}>Guardar</Text>
        </TouchableOpacity>
      )}

      {/* </Animated.View> */}
      <Text style={{ alignSelf: "center" }}>User Id: {userInfo.userId}</Text>
    </SafeAreaView>
  );
};

export default EditClientScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
    marginTop: 10,
    marginBottom: 10,
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
