import React, { useState, useEffect, createRef, useContext } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
// import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../navigation/AuthProvider";

// import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import ActionSheet from "react-native-actions-sheet";
import Toast from "react-native-toast-message";

import Image from "react-native-image-progress";
// import * as updateActions from "../store/actions/evalUpdate";
// import * as detailsActions from "../store/actions/membersDetails";
import ImageView from "react-native-image-viewing";

import Colors from "../constants/Colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const ImgPicker = (props) => {
  const { user, deleteImage, deleteEvalImage } = useContext(AuthContext);
  const actionSheetRef = createRef();

  const [pickedImage, setPickedImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState();

  const images = [
    {
      uri: props.source,
    },
  ];

  const verifyPermissions = async () => {
    // (async () => {
    //   if (Platform.OS !== "web") {
    //     const { status } =
    //       (await ImagePicker.requestCameraRollPermissionsAsync()) &
    //       (await ImagePicker.getCameraRollPermissionsAsync());

    //     if (status !== "granted") {
    //       alert("Lo siento, necesitamos permiso para acceder a la cámara");
    //     }
    //   }
    // })();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "¡Permisos insuficientes!",
        "Lo siento, necesitamos permiso para acceder a la cámara.",
        [{ text: "Listo" }]
      );
    }
    return true;
  };

  useEffect(() => {
    setZoom(false);
  }, [setZoom]);

  const takePhotoFromCamera = async () => {
    console.log("opening Camara");

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      props.onImageTaken(result.uri);
      actionSheetRef.current?.hide();
    }
  };

  // const takeImageHandler = async () => {
  //   const hasPermission = await verifyPermissions();
  //   if (!hasPermission) {
  //     return;
  //   }
  //   const image = await ImagePicker.launchCameraAsync({
  //     // allowsEditing: true,
  //     // aspect: [16, 9],
  //     quality: 0.5,
  //   });
  //   setIsOpen(false);

  //   props.onImageTaken(image.uri);
  // };

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
      props.onImageTaken(result.uri);
      actionSheetRef.current?.hide();
    }
  };

  // const selectImageHandler = async () => {
  //   const hasPermission = await verifyPermissions();
  //   if (!hasPermission) {
  //     return;
  //   }

  //   const image = await ImagePicker.launchImageLibraryAsync({
  //     // allowsEditing: true,
  //     // aspect: [16, 9],
  //     quality: 0.5,
  //   });
  //   setIsOpen(false);

  //   props.onImageTaken(image.uri);
  // };

  const deleteImageHandler = (Eid, title, docId) => {
    // console.log("props for docId", props.docId);
    Alert.alert("¿Usted esta seguro?", "Quiere borrar esta foto?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          setZoom(false);
          Toast.show({
            type: "info",
            autoHide: false,
            text1: "Borrando foto",
          });
          if (title === "Imagen Frontal") {
            await deleteImage("FrontImage");
          }
          if (title === "Imagen Lateral") {
            await deleteImage("SideImage");
          }
          if (title === "Lateral") {
            await deleteEvalImage("SideImage", Eid, docId);
          }
          if (title === "Frontal") {
            await deleteEvalImage("FrontImage", Eid, docId);
          }

          Toast.hide();
          props.refresh();
        },
      },
    ]);
  };

  return (
    <View style={styles.imagePicker}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: "600" }}>
          {props.title}
        </Text>
      </View>

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
      <TouchableOpacity
        style={styles.imagePreview}
        onPress={() => {
          setZoom(true);
        }}
        disabled={props.source ? false : true}
        onLongPress={deleteImageHandler.bind(
          this,
          props.Eid,
          props.title,
          props.docId
        )}
      >
        {!props.source ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Añade tu foto aqui.</Text>

              <View
                style={{
                  width: 35,
                  height: 30,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={Platform.OS === "android" ? "md-add" : "ios-add"}
                  size={30}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            {/* <View
              style={{
                padding: 2,
                marginBottom: 5,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 100,
              }}
            >
              <Text style={{ fontSize: 10 }}>No Carga la foto?</Text>
              <TouchableOpacity onPress={props.refresh}>
                <Text style={{ fontSize: 12, color: "blue" }}>Refrescar</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        ) : zoom === false ? (
          <Image
            style={styles.image}
            source={props.source ? { uri: props.source } : null}
          />
        ) : (
          <ImageView
            images={images}
            imageIndex={0}
            visible={zoom}
            onRequestClose={() => setZoom(false)}
            FooterComponent={({ imageIndex }) => (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
                onPress={deleteImageHandler.bind(
                  this,
                  props.Eid,
                  props.title,
                  props.docId
                )}
              >
                <Ionicons name="ios-trash" size={50} color="white" />
              </TouchableOpacity>
              // <ImageFooter imageIndex={imageIndex} imagesCount={images.length} />
            )}
          />
        )}
      </TouchableOpacity>
      <Toast position="bottom" bottomOffset={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    width: "50%",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  imagePreview: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 5,
    marginTop: 5,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 8,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ImgPicker;
