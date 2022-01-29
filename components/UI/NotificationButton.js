import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { NotificationIcon } from "../../components/UI/icons";

const NotificationButton = (props) => (
  <Container>
    <NotificationIcon />
    <View
      style={{
        width: 20,
        height: 20,
        backgroundColor: props.length > 0 ? "red" : "#3c4560",
        position: "absolute",
        top: 0,
        right: 5,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        border: 1,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: "white",
        }}
      >
        {props.length}
      </Text>
    </View>
  </Container>
);

export default NotificationButton;

const Container = styled.View`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const Bubble = styled.View`
  width: 20px;
  height: 20px;
  background: red;
  position: absolute;
  top: 0px;
  right: 5px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
`;

// const Text = styled.Text`
//   color: white;
//   font-size: 12px;
//   font-weight: 700;
// `;
