import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
// import CategoryItem from "../components/CategoryItem";
import PromoDetailItem from "../components/PromoDetailItem";

const PromoDetailScreen = ({ route, navigation }) => {
  //   const [Level1, setLevel1] = useState([]);

  const { promoData } = route.params;
  //   console.log("this is promo Data", promoData);
  //   const data = classes;
  //   console.log("section", data);
  //   console.log("and this the key", classId);
  //   const selectedVideo = data.find((key) => key.key === classId);

  //   console.log(
  //     "did i find it?",
  //     data.find((key) => key.key === classId)
  //   );
  //   setLevel1(data);
  return (
    <PromoDetailItem
      image={promoData.userImg}
      title={promoData.Caption}
      subtitle={promoData.Subtitle}
      description={promoData.Description}
    />
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
});

export default PromoDetailScreen;
