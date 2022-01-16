import React from "react";
import styled from "styled-components/native";
import { NotificationIcon } from "../../components/UI/icons";

const NotificationButtonHistory = () => (
  <Container>
    <NotificationIcon />
    <Bubble>
      <Text>🕒</Text>
    </Bubble>
  </Container>
);

export default NotificationButtonHistory;

const Container = styled.View`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const Bubble = styled.View`
  width: 18px;
  height: 18px;
  background: #3c4560;
  position: absolute;
  top: 0px;
  right: 5px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
`;

const Text = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: 700;
`;
