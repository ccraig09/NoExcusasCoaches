import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  View,
  Alert,
  Text,
} from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "../components/ImagePicker";
import Toast from "react-native-toast-message";
import { Button } from "react-native-elements";

// import * as yup from "yup";

// import ProgressWheel from "../components/UI/ProgressWheel";
// import UpdateDT from "../components/UpdateTable";
// import DataModal from "../components/DataModal";
import Colors from "../constants/Colors";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import SegmentBar from "../components/SegmentBar";
import firebase from "../components/firebase";
import { AuthContext } from "../navigation/AuthProvider";

import moment from "moment";
import localization from "moment/locale/es-us";
import { useFocusEffect } from "@react-navigation/native";

let screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

StatusBar.setHidden(true);

const EvalScreen = ({ navigation: { goBack }, navigation, route }) => {
  const { user, newEval, deleteEval } = useContext(AuthContext);
  const { evalId, evalTitle, Age, Gender } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [showEval, setShowEval] = useState(true);
  const [showDatos, setShowDatos] = useState(true);
  //   const docId = props.navigation.getParam("docTitle");
  const [showProgreso, setShowProgreso] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [userEvals, setUserEvals] = useState([]);
  const [showImagen, setShowImagen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const EId = evalId;
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const db = firebase.firestore().collection("Members");

  useFocusEffect(
    React.useCallback(() => {
      const fetchMemberDetails = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("Member Evals")
            .doc(evalId)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data());
                setUserInfo(doc.data());
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
    }, [])
  );
  const fetchMemberDetails = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .collection("Member Evals")
        .doc(evalId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setUserInfo(doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  const frontImageTakenHandler = useCallback(async (uri) => {
    if (uri == null) {
      return null;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    setUploading(true);
    setTransferred(0);
    Toast.show({
      type: "info",
      autoHide: false,
      text1: "Subiendo Foto",
    });
    // setFImage(uri);
    const storageRef = firebase
      .storage()
      .ref()
      .child(
        "UserBaseImages/" + `${user.uid}/` + `${evalTitle}/` + "FrontImage"
      );
    const task = storageRef.put(blob);
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
      await db.doc(user.uid).collection("Member Evals").doc(evalId).set(
        {
          FrontImage: url,
        },
        { merge: true }
      );

      setUploading(false);
      Toast.hide();

      Alert.alert("Foto Subido!", "Tu foto ha subido exitosamente!");
      fetchMemberDetails();

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  });

  const sideImageTakenHandler = useCallback(async (uri) => {
    if (uri == null) {
      return null;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    setUploading(true);
    setTransferred(0);
    Toast.show({
      type: "info",
      autoHide: false,
      text1: "Subiendo Foto",
    });
    // setFImage(uri);
    const storageRef = firebase
      .storage()
      .ref()
      .child(
        "UserBaseImages/" + `${user.uid}/` + `${evalTitle}/` + "SideImage"
      );
    const task = storageRef.put(blob);
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
      await db.doc(user.uid).collection("Member Evals").doc(evalId).set(
        {
          SideImage: url,
        },
        { merge: true }
      );

      setUploading(false);
      Toast.hide();

      Alert.alert("Foto Subido!", "Tu foto ha subido exitosamente!");
      fetchMemberDetails();

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  });

  const deleteHandler = async (docId) => {
    Alert.alert("Borrar Evaluacion?", "Quiere borrar este evaluación?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          await deleteEval(evalId);
          goBack();
          //add toast
        },
      },
    ]);
  };

  return (
    <RootView>
      <Container>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          //   refreshControl={
          //     <RefreshControl refreshing={isRefreshing} onRefresh={loadDetails} />
          //   }
        >
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.evalTitle}>{evalTitle}</Text>
          </View>
          <View style={styles.titleBar}>
            <View
              style={{
                marginRight: 20,
                marginBottom: 20,
                flexDirection: "row",
                justifyContent: "space-around",
                flex: 1,
              }}
            >
              <Button
                title="Volver"
                buttonStyle={{
                  borderRadius: 12,
                  backgroundColor: "green",
                }}
                onPress={() => {
                  goBack();
                }}
              />
              <Button
                title="Editar Eval"
                buttonStyle={{
                  borderRadius: 12,
                  backgroundColor: "orange",
                }}
                onPress={() => {
                  navigation.navigate("Edit Eval", { evalId: evalId });
                }}
              />
              <Button
                title="Borrar"
                buttonStyle={{
                  borderRadius: 12,
                  backgroundColor: "red",
                }}
                onPress={() => {
                  deleteHandler();
                }}
              />
            </View>
          </View>
          {showProgreso && (
            <View>
              <View style={{ padding: 6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
                >
                  Peso: {userInfo?.Peso}
                </Text>
                <View>
                  <SegmentBar
                    type="IMC"
                    value={userInfo.Imc}
                    gender={Gender}
                    age={Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Grasa"
                    value={userInfo.Grasa}
                    gender={Gender}
                    age={Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Musculo"
                    value={userInfo.Musculo}
                    gender={Gender}
                    age={Age}
                  />
                </View>

                <View>
                  <SegmentBar
                    type="Agua"
                    value={userInfo.Agua}
                    gender={Gender}
                    age={Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Proteina"
                    value={userInfo.Proteina}
                    gender={Gender}
                    age={Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Osea"
                    value={userInfo.Osea}
                    gender={Gender}
                    age={Age}
                  />
                </View>

                <View>
                  <SegmentBar
                    type="Viseral"
                    value={userInfo.Viseral}
                    gender={Gender}
                    age={Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Metabolismo Basal"
                    value={userInfo.Basal}
                    goal={userInfo.GoalBasal}
                    gender={Gender}
                    age={Age}
                  />
                </View>
              </View>
            </View>
          )}
          <View>
            <View style={styles.edit}>
              <TouchableOpacity
                onPress={() => {
                  setShowImagen((prevState) => !prevState);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Subtitle>{"progress imagen".toUpperCase()}</Subtitle>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Ionicons
                      name={
                        showImagen
                          ? "ios-arrow-down-circle"
                          : "ios-arrow-up-circle"
                      }
                      size={20}
                      color={Colors.noExBright}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {showImagen && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 30,
                  marginRight: 30,
                }}
              >
                <ImagePicker
                  onImageTaken={frontImageTakenHandler}
                  title="Frontal"
                  source={userInfo.FrontImage}
                  refresh={() => fetchMemberDetails()}
                  Eid={evalTitle}
                  docId={evalId}
                />
                <ImagePicker
                  onImageTaken={sideImageTakenHandler}
                  title="Lateral"
                  source={userInfo.SideImage}
                  refresh={() => fetchMemberDetails()}
                  Eid={evalTitle}
                  docId={evalId}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </Container>
      <Toast position="bottom" bottomOffset={20} />
    </RootView>
  );
};
export default EvalScreen;

const styles = StyleSheet.create({
  evalTitle: {
    color: "black",
    fontWeight: "800",
    fontSize: 25,
    marginLeft: 20,
    marginTop: 55,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  titleBar: {
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  wheel: {
    backgroundColor: "#ffc733",
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    width: 150,
  },
  wheelBlock: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  edit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const RootView = styled.View`
  background: black;
  /* margin-top: 80px; */
  flex: 1;
`;
const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 25px;
  margin-left: 20px;
  margin-top: 55px;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const Content = styled.View`
  height: ${screenHeight}px;
  width: ${screenWidth}px;
  background: #f0f3f5;
  margin: -15px;
  padding: 50px;
`;
const DataContainer = styled.View`
  background: #fcc454;
  height: 375px;
  width: 350px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  justify-content: center;
  align-self: center;
  padding: 15px;
`;

const CloseView = styled.View`
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  justify-content: center;
  align-items: center;
`;
