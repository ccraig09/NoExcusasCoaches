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
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Input } from "react-native-elements";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../constants/Colors";
import { PanGestureHandler } from "react-native-gesture-handler";
// import BottomSheet from "reanimated-bottom-sheet";
import ActionSheet from "react-native-actions-sheet";
import InfoText from "../components/InfoText";
import Moment from "moment";
import { Picker } from "@react-native-picker/picker";

// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
import firebase from "../components/firebase";
import DateTimePicker from "react-native-modal-datetime-picker";
import { extendMoment } from "moment-range";

import * as ImagePicker from "expo-image-picker";

const actionSheetRef = createRef();

const EditEvalScreen = ({ navigation, route }) => {
  const { user, editEval } = useContext(AuthContext);
  const { evalId } = route.params;

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [EvalInfo, setEvalInfo] = useState([]);
  const [baseStartDate, setBaseStartDate] = useState(false);
  const [picked, setPicked] = useState();
  const [showPicker, setShowPicker] = useState(false);

  const dimensions = useWindowDimensions();
  const moment = extendMoment(Moment);

  let actionSheet;

  let genderArray = ["Eligir Género", "Masculino", "Femenino"];
  let genderOptions = genderArray;

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
          .collection("Members")
          .doc(user.uid)
          .collection("Member Evals")
          .doc(evalId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              setEvalInfo(doc.data());
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

  const submitChanges = async () => {
    await editEval(EvalInfo, evalId);

    Alert.alert(
      "Evaluacion Actualizado!",
      "Tu evaluacion se ha actualizado exitosamente!"
    );

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <InfoText text="Evaluacion" />

        <View style={styles.action}>
          <Input
            label="Peso"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"Peso"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={EvalInfo ? EvalInfo?.Peso : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Peso: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <View style={styles.action}>
          <Input
            label="IMC"
            leftIcon={{ type: "font-awesome", name: "line-chart" }}
            placeholder={"IMC"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={EvalInfo ? EvalInfo?.Imc : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Imc: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Grasa : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Grasa: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Musculo : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Musculo: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Basal : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Basal: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.GoalBasal : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, GoalBasal: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Agua : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Agua: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Proteina : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Proteina: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Osea : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Osea: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Metabolica : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Metabolica: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
            value={EvalInfo ? EvalInfo?.Viseral : ""}
            onChangeText={(text) =>
              setEvalInfo({ ...EvalInfo, Viseral: text ?? "" })
            }
            autoCorrect={false}
            keyboardType="number-pad"
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
      <Text style={{ alignSelf: "center", marginTop: 10 }}>
        {EvalInfo.userId}
      </Text>
      {/* </Animated.View> */}
    </SafeAreaView>
  );
};

export default EditEvalScreen;
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
