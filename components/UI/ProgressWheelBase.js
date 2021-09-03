import React from "react";
import { View, Text, Platform } from "react-native";
import AnimatedProgressWheel from "react-native-progress-wheel";
import ProgressCircle from "./ProgressCircle";
import MetaFormula from "../../components/MetaFormula";

const ProgressWheel = (props, { value }) => {
  const goal = () => {
    if (props.title === "IMC") {
      return "21.6";
    }
    if (props.title === "Grasa") {
      return fatRes();
    }
    if (props.title === "Grasa Viseral") {
      return "5";
    }
    if (props.title === "Músculo") {
      return muscleRes();
    }
    if (props.title === "Metabolica") {
      return props.age;
    }
  };

  const fatRes = () => {
    if (props.gender === "F" && props.age >= "20" && props.age <= "39") {
      return "26.9";
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      return "28.4";
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "79") {
      return "29.9";
    }
    if (props.gender === "M" && props.age >= "20" && props.age <= "39") {
      return "13.9";
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      return "16.5";
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "79") {
      return "18.9";
    }
  };

  const muscleRes = () => {
    if (props.gender === "F" && props.age >= "18" && props.age <= "39") {
      return "27.3";
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      return "27.1";
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "80") {
      return "26.9";
    }

    if (props.gender === "M" && props.age >= "18" && props.age <= "39") {
      return "36.3";
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      return "36.1";
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "80") {
      return "35.9";
    }
  };

  const A = props.current;
  // const B = goal();
  const P = Math.abs(props.update);
  const C = (A - goal()).toFixed(2);
  const D = P / C;
  const X = isNaN(D) ? 0 : Math.abs(D.toFixed(2));
  // console.log("this is the goal ", B);

  let result;
  if (X * 100 < 25) {
    result = "red";
  }
  if (X * 100 >= 25 && X * 100 <= 75) {
    result = "yellow";
  }
  if (X * 100 > 75) {
    result = "#00ff00";
  }
  // console.log("x is equal to", Math.abs(X));
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffc733",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <ProgressCircle
        value={X}
        size={80}
        thickness={12}
        color={result}
        animationMethod="spring"
        animationConfig={{ delay: 1000, stiffness: 30 }}
        unfilledColor="grey"
        shouldAnimateFirstValue={true}
        onChange={props.onChange}
      >
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          {props.composition}
        </Text>
        <Text
          style={{
            color: result,
            fontSize: 10,
            fontFamily: "aliens",
            fontWeight: "bold",
          }}
        >
          {(X * 100).toFixed(2)} %
        </Text>
      </ProgressCircle>
    </View>
  );
};

export default ProgressWheel;
