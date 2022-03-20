import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import Moment from "moment";
import { extendMoment } from "moment-range";

const ClientAvatar = (props) => {
  let logoimg = "../assets/icon-noexlogo.png";

  const moment = extendMoment(Moment);

  var date1 = moment().startOf("day");
  var date2 = moment(props.endDate, "DD-MM-YYYY");
  const dateDiff = moment.duration(date2.diff(date1)).asDays();

  //   console.log(dateDiff);
  const minDays = () => {
    if (dateDiff > 5) dateDiff = 0;
  };

  return (
    <View>
      {!isNaN(dateDiff) && (
        <Text style={{ fontSize: 12, color: "grey", fontWeight: "bold" }}>
          Plan hasta {props.endDate}
        </Text>
      )}
      <View style={{ flexDirection: "row" }}>
        {!isNaN(dateDiff) && (
          <Text style={{ fontSize: 12, color: "grey", fontWeight: "bold" }}>
            {dateDiff < 0 ? "Hace " : "En "}
          </Text>
        )}
        <Text
          style={{
            color: isNaN(dateDiff)
              ? "orange"
              : dateDiff < 0
              ? "red"
              : dateDiff < 3
              ? "#E0B90A"
              : "green",

            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {isNaN(dateDiff) ? "Actualizar plan" : Math.abs(dateDiff)}
        </Text>
        {!isNaN(dateDiff) && (
          <Text style={{ fontSize: 12, color: "grey", fontWeight: "bold" }}>
            {" "}
            Dias
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    width: 315,
    height: 280,
    shadowColor: "blue",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 14,
    backgroundColor: "black",
    margin: 20,
  },
  wrapper: {
    marginLeft: 10,
  },
  logo: {
    width: 44,
    height: 44,
  },
  touchable: {
    borderRadius: 14,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 400,
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardTitle: {
    color: Colors.noExprimary,
    fontSize: 24,
    position: "absolute",

    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    width: 190,
  },
  caption: {
    fontSize: 15,
    color: "white",
    // fontFamily: "open-sans-bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "#b8bece",
    fontWeight: "600",
    fontSize: 15,
    textTransform: "uppercase",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    paddingLeft: 20,
  },
});

export default ClientAvatar;
