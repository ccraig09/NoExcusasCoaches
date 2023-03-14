import React, { useState } from "react";
import { View, Text } from "react-native";
import SegmentedProgressBar from "react-native-segmented-progress-bar";

const SegmentBar = (props) => {
  let indexValues;
  let indexLables;
  let colorIndex;
  let value;
  let gender;
  let goal;

  const res = () => {
    if (props.type === "Musculo") {
      return musculoRes();
    }
    if (props.type === "Viseral") {
      return viseralRes();
    }
    if (props.type === "Grasa") {
      return grasaRes();
    }
    if (props.type === "IMC") {
      return imcRes();
    }
    if (props.type === "Metabolismo Basal") {
      return basalRes();
    }
    if (props.type === "Proteina") {
      return proteinaRes();
    }
    if (props.type === "Osea") {
      return oseaRes();
    }

    if (props.type === "Agua") {
      return aguaRes();
    }
  };

  const viseralRes = () => {
    if (props.type === "Viseral") {
      indexValues = [2, 10, 15, 20];
      indexLables = ["Normal", "Alto", "Muy alto"];
      colorIndex = ["#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
  };

  const musculoRes = () => {
    if (props.age >= "18" && props.age <= "39") {
      indexValues = [15, 33.3, 39.3, 44, 55];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      indexValues = [15, 33.1, 39.1, 43.8, 60];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "80") {
      indexValues = [15, 32.9, 38.9, 43.6, 60];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "F" && props.age >= "18" && props.age <= "39") {
      indexValues = [15, 24.3, 30.3, 35.3, 45];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      indexValues = [15, 24.1, 30.1, 35.1, 45];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "80") {
      indexValues = [15, 23.9, 29.9, 34.9, 45];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
  };

  const imcRes = () => {
    {
      indexValues = [15, 18.5, 25, 30, 40];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
  };

  const grasaRes = () => {
    if (props.gender === "M" && props.age >= "20" && props.age <= "39") {
      indexValues = [0, 8, 20, 25, 45];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      indexValues = [0, 11, 22, 28, 50];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "79") {
      indexValues = [0, 13, 25, 30, 50];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }

    if (props.gender === "F" && props.age >= "20" && props.age <= "39") {
      indexValues = [0, 21, 33, 39, 50];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      indexValues = [0, 23, 34, 40, 60];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "79") {
      indexValues = [0, 24, 36, 42, 60];
      indexLables = ["Bajo", "Normal", "Alto", "Muy alto"];
      colorIndex = ["#007BEA", "#05B21B", "#FAC014", "#FE3227"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
  };

  const basalRes = () => {
    value = props.value;
    goal = props.goal;
    return (
      <View style={{ marginTop: 30 }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>{props.type} </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Actual: </Text>
            <Text style={{ fontWeight: "bold", color: "orange" }}>
              {value} kcal
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Meta: </Text>
          <Text style={{ fontWeight: "bold", color: "green" }}>
            {" "}
            {goal} kcal
          </Text>
        </View>
      </View>
    );
  };

  const proteinaRes = () => {
    return (
      <View>
        <Text style={{ fontWeight: "bold" }}>
          {props.type} {props.value}
        </Text>
        <SegmentedProgressBar
          showSeparatorValue
          borderRadius={3}
          values={[6, 16, 20, 25]}
          colors={["orange", "#05B21B", "green"]}
          labels={["Insuficiente", "Normal", "Genial"]}
          position={props.value}
        />
      </View>
    );
  };
  const oseaRes = () => {
    if (props.type === "Osea" && props.gender === "M") {
      indexValues = [0, 1.9, 4.1, 5];
      indexLables = ["Insuficiente", "Normal", "Genial"];
      colorIndex = ["orange", "#05B21B", "green"];
      value = props.value;

      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }

    if (props.gender === "F") {
      indexValues = [0, 1.8, 3.9, 5];
      indexLables = ["Insuficiente", "Normal", "Genial"];
      colorIndex = ["orange", "#05B21B", "green"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={props.value}
          />
        </View>
      );
    }
  };

  const aguaRes = () => {
    if (props.gender === "F") {
      indexValues = [30, 45, 60.1, 80];
      indexLables = ["Insuficiente", "Normal", "Genial"];
      colorIndex = ["orange", "#05B21B", "green"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
    if (props.gender === "M") {
      indexValues = [30, 55, 65.1, 80];
      indexLables = ["Insuficiente", "Normal", "Genial"];
      colorIndex = ["orange", "#05B21B", "green"];
      value = props.value;
      gender = props.gender;
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {props.type} {props.value}
          </Text>
          <SegmentedProgressBar
            showSeparatorValue
            borderRadius={3}
            values={indexValues}
            colors={colorIndex}
            labels={indexLables}
            position={value}
          />
        </View>
      );
    }
  };

  return <View>{res()}</View>;
};

export default SegmentBar;
