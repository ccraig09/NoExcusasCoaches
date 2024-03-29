import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import ClassItem from "../components/ClassItem";
import CategoryItem from "../components/CategoryItem";

const SectionScreen = ({ route, navigation }) => {
  const [Level1, setLevel1] = useState([]);

  const { classId, classes } = route.params;
  const data1 = classes.filter((item) => item.Caption === classId);
  const data = data1[0]?.Levels;
  console.log("section", data1);
  //   setLevel1(data);
  console.log(">>data", data);

  return (
    <View style={styles.FlatList}>
      {/* <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        {data1[0].Title}
      </Text> */}
      <Button
        title={"Agregar video"}
        onPress={() => {
          navigation.navigate("UploadScreen", {
            classId: classId,
            classes: data,
          });
        }}
      />
      <FlatList
        // horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(itemData) => (
          <CategoryItem
            image={itemData.item.coverImg}
            title={itemData.item.Title}
            logo={itemData.item.logo}
            caption={itemData.item.Caption}
            subtitle={itemData.item.Subtitle}
            difficulty={itemData.item.Difficulty}
            time={itemData.item.Time}
            description={itemData.item.description}
            onClassClick={() => {
              navigation.navigate("UploadScreen", {
                classId: classId,
                classes: data,
                video: {
                  title: itemData.item.Title,
                  coverImg: itemData.item.coverImg,
                  url:itemData.item.url,
                  points:itemData.item.points
                },
                classArrayIndex: itemData.index,
              });
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
});

export default SectionScreen;
