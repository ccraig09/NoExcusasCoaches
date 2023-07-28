import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import ClassItem from "../components/ClassItem";
import styled from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";

const AddVideoScreen = ({ navigation }) => {
  const [fitnessClasses, setFitnessClasses] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [kidsClasses, setKidsClasses] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchClasses = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Classes")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Image,
                  Time,
                  Subtitle,
                  Caption,
                  Category,
                  Levels,
                  Difficulty,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: Title,
                  Image: Image,
                  Time: Time,
                  Subtitle: Subtitle,
                  Caption: Caption,
                  Category: Category,
                  Levels: Levels,
                  Difficulty: Difficulty,
                });
              });
            });
          console.log(
            "classes",
            list.filter((data) => data.Category == "fitness")
          );
          setFitnessClasses(
            list
              .filter((data) => data.Category == "fitness")
              .sort((a, b) => (a.order < b.order ? 1 : -1))
          );
          setSportsClasses(list.filter((data) => data.Category == "sports"));
          setKidsClasses(list.filter((data) => data.Category == "kids"));
          // console.log("this the user?", user);
          // console.log(fitnessClasses);
          // setLevel1(fitnessClasses[0].Level1);
        } catch (e) {
          console.log(e);
        }
      };

      fetchClasses();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Subtitle>{"Entrenamientos".toUpperCase()}</Subtitle>
      <FlatList
        // horizontal={true}
        showsVerticalScrollIndicator={false}
        data={fitnessClasses}
        renderItem={(itemData) => (
          <ClassItem
            image={itemData.item.Image}
            title={itemData.item.Title}
            logo={itemData.item.logo}
            caption={itemData.item.Caption}
            subtitle={itemData.item.Subtitle}
            onClassClick={() => {
              navigation.navigate("SectionScreen", {
                classId: itemData.item.key,
                classes: fitnessClasses,
              });
            }}
          />
        )}
      />
      {/* <Subtitle>{"Deportes".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={sportsClasses}
          renderItem={(itemData) => (
            <ClassItem
              image={itemData.item.Image}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("SectionScreen", {
                  classId: itemData.item.key,
                  classes: sportsClasses,
                });
              }}
            />
          )}
        />
        <Subtitle>{"Niños".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={kidsClasses}
          renderItem={(itemData) => (
            <ClassItem
              image={itemData.item.Image}
              title={itemData.item.Title}
              //   price={itemData.item.price}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              //   image={itemData.item.image}
              onClassClick={() => {
                navigation.navigate("SectionScreen", {
                  classId: itemData.item.key,
                  classes: kidsClasses,
                });
              }}
            />
          )}
        /> */}
    </View>
  );
};

export default AddVideoScreen;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 800;
  font-size: 25px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
