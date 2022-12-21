// import * as firebase from "firebase";
// import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";

// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC7T1dVJFpMAu8YT64sA1IjDduZc2dkV2M",
  authDomain: "no-excusas.firebaseapp.com",
  databaseURL: "https://no-excusas.firebaseio.com",
  projectId: "no-excusas",
  storageBucket: "no-excusas.appspot.com",
  messagingSenderId: "734413363397",
  appId: "1:734413363397:web:dac9605a445fa0402df8ac",
  measurementId: "G-0EMD528XFE",
};
// if (!firebase.apps.length) {
// firebase.initializeApp(firebaseConfig);
// }

let app;

// if (firebase.apps.length === 0) {
app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);
// } else {
// app = firebase.app();
// }
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default firebase;
