import React from "react";
import styled from "styled-components/native";
import { NotificationIcon } from "../../components/UI/icons";

const NotificationButton = (props) => (
  <Container>
    <NotificationIcon />
    <Bubble>
      <Text>{props.length}</Text>
    </Bubble>
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
  font-size: 12px;
  font-weight: 700;
`;
