import {
  Button,
  StyleSheet,
  Text,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { CheckBox, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import firebase from "../components/firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { AuthContext } from "../navigation/AuthProvider";

const UploadScreen = ({ route, navigation }) => {
  const { classId, classes, classArrayIndex } = route.params;
  const { uploadTrainingVideo } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [curentLevels, setCurentLevels] = useState(classes);
  console.log("logging levels", classes);
  const storage = getStorage();

  useEffect(() => {
    setCurentLevels(classes);
    console.log("effect classes", classes);
  }, []);

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
  });

  console.log("params", route.params);
  const chooseVideoFromLibrary = async () => {
    console.log("opening gallery");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    console.log(result);

    if (!result.cancelled) {
      setVideoUrl(result.uri);
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
    }
  };

  const submitHandler = async () => {
    // let videoUrl = await uploadVideo();
    // console.log("video?", videoUrl);
    const newVideo = [
      {
        // Title: title,
        // Time: time,
        // Difficulty: difficulty,
        coverImg: image,
        url: url,
      },
    ];

    uploadTrainingVideo(newVideo, classId);
    // if (type === "Promocion") {
    //   triggerNotificationHandler();
    // }
    Alert.alert(`Video Subido!`, `Tu video se ha subido exitosamente!`);
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    // const uploadUri = image;
    const response = await fetch(image);
    const blob = await response.blob();
    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    // setUploading(true);
    // setTransferred(0);
    const storageRef = ref(storage, "TrainingImages/" + title);

    // const storageRef = firebase
    //   .storage()
    //   .ref()
    //   .child("TrainingImages/" + title);

    // const task = storageRef.put(blob);
    const task = uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    // Set transferred state
    // task.on("state_changed", (taskSnapshot) => {
    //   console.log(
    //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
    //   );
    //   setTransferred(
    //     (
    //       (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
    //       100
    //     ).toFixed(0)
    //   );
    // });

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

  const uploadVideo = async () => {
    if (videoUrl === null) {
      return null;
    }
    // const uploadUri = image;
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    setUploading(true);
    setTransferred(0);

    const storageRef = ref(storage, "TrainingVideos/" + title);

    // const storageRef = firebase
    //   .storage()
    //   .ref()
    //   .child("TrainingVideos/" + title);

    // const task = storageRef.put(blob);

    const task = uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setTransferred(progress);
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    });

    // Set transferred state
    // task.on("state_changed", (taskSnapshot) => {
    //   console.log(
    //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
    //   );
    //   setTransferred(
    //     (
    //       (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
    //       100
    //     ).toFixed(0)
    //   );
    // });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      console.log("downloadurl", url);

      setUploading(false);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
          value={checked}
          onValueChange={setChecked}
          style={styles.checkbox}
          
        /> */}
        {/* <CheckBox
          title="Calentamiento?"
          iconRight
          checked={checked}
          onPress={() => {
            setChecked(!checked);
          }}
        /> */}
        <View style={styles.action}>
          <Input
            label="Enlace"
            leftIcon={{ type: "font-awesome", name: "edit" }}
            placeholder="Enlace"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={url}
            onChangeText={(text) => setUrl(text)}
            autoCorrect={false}
          />
        </View>
        {/* <View style={styles.action}>
          <Input
            label="Tiempo"
            leftIcon={{ type: "font-awesome", name: "clock-o" }}
            placeholder="Tiempo"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={time}
            onChangeText={(text) => setTime(text)}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <Input
            label="Dificultad"
            leftIcon={{ type: "font-awesome", name: "fire" }}
            placeholder="Dificultad"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={difficulty}
            onChangeText={(text) => setDifficulty(text)}
            autoCorrect={false}
          />
        </View> */}

        {/* <Button
          title={"Elegir Video"}
          onPress={() => {
            chooseVideoFromLibrary();
          }}
        />
        <Text>{videoUrl}</Text> */}
        <Button
          title={"Elegir Imagen"}
          onPress={() => {
            choosePhotoFromLibrary();
          }}
        />
        <Text>{image}</Text>
        {uploading && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>{transferred}% Completado</Text>
            <ActivityIndicator size="large" color="0000ff" />
          </View>
        )}
        <Button
          title={"Subir"}
          onPress={() => {
            submitHandler();
          }}
        />
      </View>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
});
