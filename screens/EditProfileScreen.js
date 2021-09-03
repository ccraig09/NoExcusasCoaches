import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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
import { AuthContext } from "../navigation/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../constants/Colors";
import { PanGestureHandler } from "react-native-gesture-handler";
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

const EditProfileScreen = ({ navigation }) => {
  const { user, editProfile, logout } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height);
  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
    };
  });
  const getsureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd() {
      //Dismissing snap point
      if (top.value > dimensions.height / 2 + 200) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2;
      }
    },
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

    const fetchMemberDetails = async () => {
      try {
        await firebase
          .firestore()
          .collection("Coaches")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // console.log("Document data:", doc.data());
              setUserInfo(doc.data());
              setImage(doc.data().userImg);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchMemberDetails();
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
      top.value = dimensions.height;
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
      top.value = dimensions.height;
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

    editProfile(userInfo, imageUrl);
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
        "Perfil Actualizado!",
        "Tu perfil se ha actualizado exitosamente!"
      );

      navigation.goBack();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  // const renderInner = () => (
  //   <View style={styles.panel}>
  //     <View style={{ alignItems: "center" }}>
  //       <Text style={styles.panelTitle}>Subir Foto</Text>
  //       <Text style={styles.panelSubtitle}>Eligir Foto de Perfil</Text>
  //     </View>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       onPress={takePhotoFromCamera}
  //     >
  //       <Text style={styles.panelButtonTitle}>Abrir Camara</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       onPress={choosePhotoFromLibrary}
  //     >
  //       <Text style={styles.panelButtonTitle}>Abrir Galeria</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       // onPress={() => bs.current.snapTo(1)}
  //     >
  //       <Text style={styles.panelButtonTitle}>Cancelar</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
  // const renderHeader = () => (
  //   <View style={styles.header}>
  //     <View style={styles.panelHeader}>
  //       <View style={styles.panelHandle}></View>
  //     </View>
  //   </View>
  // );

  // bs = React.createRef();
  // fall = new Animated.Value(1);
  return (
    <SafeAreaView style={styles.container}>
      {/* <BottomSheet
        // ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={0}
        callbackNode={fall}
        enabledGestureInteraction={true}
      /> */}
      <PanGestureHandler onGestureEvent={getsureHandler}>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
            },
            style,
          ]}
        >
          {/* <View style={styles.header}> */}
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
              // if (top.value > dimensions.height / 2 + 200) {
              top.value = dimensions.height;
              // } else {
              // top.value = dimensions.height / 2;
              // }
            }}
          >
            <Text style={styles.panelButtonTitle}>Cancelar</Text>
          </TouchableOpacity>
          {/* </View> */}
        </Animated.View>
      </PanGestureHandler>

      {/* <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(
            0.1,
            Animated.multiply(new Animated.Value(1), 1.0)
          ),
        }}
      > */}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            top.value = withSpring(
              dimensions.height / 2, //Half screen    (for full screen, animate to 0)
              SPRING_CONFIG
            );
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
      <View style={styles.action}>
        <FontAwesome name="user-o" size={20} />
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#666666"
          style={styles.textInput}
          value={userInfo ? userInfo.FirstName : ""}
          onChangeText={(text) => setUserInfo({ ...userInfo, FirstName: text })}
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
          onChangeText={(text) => setUserInfo({ ...userInfo, LastName: text })}
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
        <FontAwesome name="flag" size={20} />
        <TextInput
          placeholder="Pais"
          placeholderTextColor="#666666"
          style={styles.textInput}
          value={userInfo ? userInfo.country : ""}
          onChangeText={(text) => setUserInfo({ ...userInfo, country: text })}
          autoCorrect={false}
        />
      </View>

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
      <Button
        title="Cerrar sesión"
        onPress={() => {
          Alert.alert("Cerrar sesión?", "", [
            {
              text: "No",
              style: "default",
            },
            {
              text: "Si",
              style: "destructive",
              onPress: () => {
                logout();
              },
            },
          ]);
        }}
      />
      {/* </Animated.View> */}
    </SafeAreaView>
  );
};

export default EditProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
