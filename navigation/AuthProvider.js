import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import firebase from "../components/firebase";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gUser, setGUser] = useState(null);
  const db = firebase.firestore().collection("Members");
  const dbP = firebase.firestore().collection("Products");
  const dbC = firebase.firestore().collection("Coaches");

  //  const userId = firebase.auth().currentUser.uid;
  // KZhQMNuejvhZwAxtQeNBsdwmdep1

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                dbC.doc(firebase.auth().currentUser.uid).set({
                  userId: firebase.auth().currentUser.uid,
                  FirstName: "",
                  LastName: "",
                  Phone: "",
                  email: email,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  userImg: null,
                });
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            console.log(e);
          }
          try {
            await AsyncStorage.clear();
          } catch (e) {
            // clear error
          }
        },
        forgotPassword: async (email) => {
          try {
            await firebase.auth().sendPasswordResetEmail(email);
            Alert.alert("Correo Enviado");
          } catch (e) {
            console.log(e);
          }
        },

        signInWithGoogle: async () => {
          const config = {
            iosClientId: `989650982349-lpv8mh9npj3grvvlt3etpm3904rkegcq.apps.googleusercontent.com`,
            androidClientId: `989650982349-9nkggscnb4a0jjji9ufani659rjkebvm.apps.googleusercontent.com`,
            scopes: ["profile", "email"],
          };

          Google.logInAsync(config)
            .then((logInResult) => {
              // const { type, user } = result;
              if (logInResult.type === "success") {
                const { idToken, accessToken } = logInResult;
                console.log("g2g", logInResult);
                const credential = firebase.auth.GoogleAuthProvider.credential(
                  idToken,
                  accessToken
                );

                return firebase.auth().signInWithCredential(credential);
                // Successful sign in is handled by firebase.auth().onAuthStateChanged
              } else {
                console.log("failed");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
        signUpWithGoogle: async () => {
          const config = {
            iosClientId: `989650982349-lpv8mh9npj3grvvlt3etpm3904rkegcq.apps.googleusercontent.com`,
            androidClientId: `989650982349-9nkggscnb4a0jjji9ufani659rjkebvm.apps.googleusercontent.com`,
            scopes: ["profile", "email"],
          };

          Google.logInAsync(config)
            .then((logInResult) => {
              // const { type, user } = result;
              if (logInResult.type === "success") {
                const { idToken, accessToken } = logInResult;

                AsyncStorage.setItem(
                  "userData",
                  JSON.stringify({
                    // avatar: logInResult.user.avatar.toString(),
                    // token: token,
                    // userId: userId,
                    givenName: logInResult.user.givenName.toString(),
                  })
                );

                const credential = firebase.auth.GoogleAuthProvider.credential(
                  idToken,
                  accessToken
                );

                return firebase
                  .auth()
                  .signInWithCredential(credential)
                  .then(() => {
                    console.log(
                      "loading current deets",
                      firebase.auth().currentUser
                    );
                    dbC.doc(firebase.auth().currentUser.uid).set({
                      userId: firebase.auth().currentUser.uid,
                      FirstName: logInResult.user.givenName.toString(),
                      LastName: logInResult.user.familyName.toString(),
                      Phone: "",
                      email: firebase.auth().currentUser.providerData[0].email,
                      country: "",
                      createdAt:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      userImg: logInResult.user.photoUrl.toString(),
                    });
                  });
                // Successful sign in is handled by firebase.auth().onAuthStateChanged
              } else {
                console.log("failed");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },

        deleteProduct: async (key) => {
          try {
            console.log("Firebase Delete product", key);
            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(key)
              .delete();
          } catch (e) {
            console.log(e);
          }
        },
        addMemProd: async (Title, Price, Category, Size, Brand, Code) => {
          const increment = firebase.firestore.FieldValue.increment(1);

          try {
            console.log("adding product to member");
            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(Code)
              .set(
                {
                  Title,
                  Price: parseInt(Price),
                  Category,
                  Quantity: increment,
                  Size,
                  Brand,
                  Code,
                  isChecked: false,
                  ownerId: user.uid,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
          } catch (e) {
            console.log(e);
          }
        },
        createProduct: async (
          newProduct,
          newSize,
          newPrice,
          newCategory,
          newBrand,
          code
        ) => {
          try {
            console.log("creating an available product");
            await dbP.doc(code).set(
              {
                Product: newProduct,
                Size: newSize,
                Price: parseInt(newPrice),
                Category: newCategory,
                Brand: newBrand,
                code,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        },
        editProfile: async (userInfo, userImg) => {
          try {
            await dbC.doc(user.uid).set(
              {
                FirstName: userInfo.FirstName,
                LastName: userInfo.LastName,
                Phone: userInfo.Phone,
                email: userInfo.email,
                country: userInfo.country,
                userImg,
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        },
        editClient: async (userInfo, userImg) => {
          try {
            await db.doc(userInfo.userId).set(
              {
                FirstName: userInfo.FirstName,
                LastName: userInfo.LastName,
                Phone: userInfo.Phone,
                email: userInfo.email,
                userImg,
                plan: userInfo.plan,
                startDate: userInfo.startDate,
                endDate: userInfo.endDate,
                goal: userInfo.goal,
                history: userInfo.history,
                sport: userInfo.sport,
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        },
        addPoints: async (userInfo, lastSignIn) => {
          const increment = firebase.firestore.FieldValue.increment(1);

          try {
            await db.doc(userInfo.userId).set(
              {
                lastSignIn: lastSignIn,
                points: increment,
                lastSignInTime: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        },

        qUpdate: async (newQ, code) => {
          try {
            console.log("updating quantity amount to Firebase");

            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(code)
              .update(
                {
                  Quantity: newQ,

                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }
                // { merge: true }
              );
          } catch (e) {
            console.log(e);
          }
        },
        orderQuantityUpdate: async (cartItem) => {
          console.log("check cartitem", cartItem.quantity);
          const subNum = cartItem.quantity;
          const Code = cartItem.productcode;
          const increment = firebase.firestore.FieldValue.increment(-subNum);

          try {
            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(Code)
              .update(
                {
                  Quantity: increment,

                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }
                // { merge: true }
              );
          } catch (err) {
            if (err.message === "Requested entity was not found.") {
              console.log("so far we noting something");
              // Alert.alert(
              //   "Product no esta registrado",
              //   "Este producto era vendido sin estar registrado, agregarlo ahora?",
              //   [
              //     {
              //       text: "Todavia",
              //       onPress: () => console.log("Cancel Pressed"),
              //       style: "cancel",
              //     },
              //     { text: "Sí", onPress: () => addMemProd() },
              //   ]
              // );
            } else {
              console.log(err.message);
            }
          }
        },

        updateChecked: async (newCart, id) => {
          try {
            await db.doc(user.uid).collection("Orders").doc(id).update(
              {
                cartItems: newCart,

                timestampUpdate1:
                  firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (err) {
            console.log(err.message);
          }
        },

        iconCheck: async (id) => {
          try {
            await db.doc(user.uid).collection("Orders").doc(id).update(
              {
                checked: true,

                timestampUpdated2:
                  firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (err) {
            console.log(err.message);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
