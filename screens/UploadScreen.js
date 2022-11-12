import { Button, StyleSheet, Text, Alert, View } from "react-native";
import React, { useState, useContext } from "react";
import { CheckBox, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import firebase from "../components/firebase";
import { AuthContext } from "../navigation/AuthProvider";

const UploadScreen = ({ route, navigation }) => {
  const { uploadTrainingVideo } = useContext(AuthContext);

  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [curentLevels, setCurentLevels] = useState([]);
  const { classId, classes, classArrayIndex } = route.params;

  console.log("params", classArrayIndex);
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

  const submitHandler = async () => {
    let videoUrl = await uploadImage();
    console.log("video?", videoUrl);
    var newVideo = [{ title: title }, { time: time }, { url: videoUrl }];

    // await uploadTrainingVideo(videoUrl, title, time, classId, classArrayIndex);
    // if (type === "Promocion") {
    //   triggerNotificationHandler();
    // }
    Alert.alert(`Video Subido!`, `Tu video se ha subido exitosamente!`);
  };

  const uploadImage = async () => {
    if (videoUrl === null) {
      return null;
    }
    // const uploadUri = image;
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    // setUploading(true);
    // setTransferred(0);
    const storageRef = firebase
      .storage()
      .ref()
      .child("TrainingVideos/" + title);

    const task = storageRef.put(blob);

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
      // await task;

      const url = await storageRef.getDownloadURL();
      console.log("downloadurl", url);

      // setUploading(false);

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
        <CheckBox
          title="Calentamiento?"
          iconRight
          checked={checked}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <View style={styles.action}>
          <Input
            label="Titulo"
            leftIcon={{ type: "font-awesome", name: "edit" }}
            placeholder="Titulo"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={title}
            onChangeText={(text) => setTitle(text)}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
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

        <Button
          title={"Elegir Video"}
          onPress={() => {
            chooseVideoFromLibrary();
          }}
        />
        <Text>{videoUrl}</Text>
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
