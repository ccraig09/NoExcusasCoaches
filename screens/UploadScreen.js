import {
  Button,
  StyleSheet,
  Text,
  Alert,
  View,
  ActivityIndicator,
  Image,
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
  getDownloadURL,
} from "firebase/storage";
import { AuthContext } from "../navigation/AuthProvider";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

const UploadScreen = ({ route, navigation }) => {
  const { classId, classes, classArrayIndex, video } = route.params;
  const { uploadTrainingVideo } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");
  const [points, setPoints] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);
  const [imageShow, setImageShow] = useState(null);
  const [curentLevels, setCurentLevels] = useState(null);
  const storage = getStorage();

  useEffect(() => {
    setCurentLevels(classes);
    let currentClass;
    if (video) {
      setTitle(video.title);
      setImageShow(video.coverImg);
      setImage(video.coverImg);
      setUrl(video.url);
      setPoints(video.points);
    }
    console.log("effect classes", video);
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
    console.log(">>>> assets", result.assets[0].uri);

    if (!result.canceled) {
      setImageShow(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const submitHandler = async () => {
    const newVideo = [
      {
        Title: title,
        coverImg: image,
        url: url,
        points: points,
      },
    ];
    let updatedArrary;
    if (video) {
      updatedArrary = curentLevels.map((item, i) => {
        if (i === classArrayIndex) {
          console.log("index ran");
          return newVideo[0];
        }
        console.log("vid ran");
        return item;
      });
    } else {
      updatedArrary = [...curentLevels, newVideo[0]];
      console.log("we here");
    }

    uploadTrainingVideo(updatedArrary, classId);
    Alert.alert(`Video Subido!`, `Tu video se ha subido exitosamente!`);
    navigation.navigate("Information");
  };

  const onDelete = async () => {
    const deleteHandler = () => {
      const updatedArrary = curentLevels.filter(
        (item, i) => i !== classArrayIndex
      );
      uploadTrainingVideo(updatedArrary, classId);
      Alert.alert(`Video Borrado`, `Tu video se ha borrado exitosamente!`);
      navigation.navigate("Information");
    };

    Alert.alert("¿Estás seguro que quieres borrar este vídeo?", "", [
      {
        text: "Borrar",
        onPress: () => deleteHandler(),
        style: "destructive",
      },
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
      },
    ]);
  };

  const uploadImage = async (photo) => {
    if (photo == null) {
      return null;
    }
    // const uploadUri = photo;
    console.log("checkpoint1");
    const response = await fetch(photo);
    console.log("checkpoint2");

    const blob = await response.blob();
    console.log("checkpoint3");

    // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    setUploading(true);
    console.log("checkpoint4");

    // setTransferred(0);
    const storageRef = ref(storage, "TrainingImages/" + photo);
    console.log("checkpoint5");

    // const storageRef = firebase
    //   .storage()
    //   .ref()
    //   .child("TrainingImages/" + title);

    // const task = storageRef.put(blob);
    const task = uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("checkpoint6");

      console.log("Uploaded a blob or file!");

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
        task;
        console.log("checkpoint7");

        const url = getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("checkpoint8");

          console.log("File available at", downloadURL);
          return setImage(downloadURL);
        });

        setUploading(false);

        return url;
      } catch (e) {
        console.log(e);
        return null;
      }
    });
  };

  // const uploadVideo = async () => {
  //   if (videoUrl === null) {
  //     return null;
  //   }
  //   // const uploadUri = image;
  //   const response = await fetch(videoUrl);
  //   const blob = await response.blob();
  //   // let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

  //   setUploading(true);
  //   setTransferred(0);

  //   const storageRef = ref(storage, "TrainingVideos/" + title);

  //   // const storageRef = firebase
  //   //   .storage()
  //   //   .ref()
  //   //   .child("TrainingVideos/" + title);

  //   // const task = storageRef.put(blob);

  //   const task = uploadBytes(storageRef, blob).then((snapshot) => {
  //     console.log("Uploaded a blob or file!", snapshot);
  //   });

  //   const uploadTask = uploadBytesResumable(storageRef, blob);

  //   uploadTask.on("state_changed", (snapshot) => {
  //     // Observe state change events such as progress, pause, and resume
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     setTransferred(progress);
  //     console.log("Upload is " + progress + "% done");
  //     switch (snapshot.state) {
  //       case "paused":
  //         console.log("Upload is paused");
  //         break;
  //       case "running":
  //         console.log("Upload is running");
  //         break;
  //     }
  //   });

  //   // Set transferred state
  //   // task.on("state_changed", (taskSnapshot) => {
  //   //   console.log(
  //   //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
  //   //   );
  //   //   setTransferred(
  //   //     (
  //   //       (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
  //   //       100
  //   //     ).toFixed(0)
  //   //   );
  //   // });

  //   try {
  //     await task;

  //     const url = await storageRef.getDownloadURL();
  //     console.log("downloadurl", url);

  //     setUploading(false);

  //     return url;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // };

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
        <View style={styles.action}>
          <Input
            label="Puntos"
            leftIcon={{ type: "font-awesome", name: "edit" }}
            placeholder="Puntos"
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={points}
            onChangeText={(text) => setPoints(text)}
            autoCorrect={false}
            keyboardType="number-pad"
            returnKeyType="done"
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
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={{ uri: imageShow }} />
        </View>
        {uploading && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {/* <Text>{transferred}% Completado</Text> */}
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
        <Button
          disabled={!title || !url || !image}
          title={"Subir"}
          onPress={() => {
            submitHandler();
          }}
        />
        <View style={{ marginTop: 30 }}>
          <Button
            title={"Borrar"}
            color={"red"}
            onPress={() => {
              onDelete();
            }}
          />
        </View>
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
    paddingTop: 20,
    // justifyContent: "center",
  },
  imgContainer: {
    height: 150,
    width: 150,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
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
