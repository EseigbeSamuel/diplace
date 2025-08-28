import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import React from "react";
import { StyleSheet, Text } from "react-native";

const Chats = () => {
  return (
    <SafeAreaViewContainer>
      <AppHeader title={"Chats"} />
      <Text>Chats page</Text>
    </SafeAreaViewContainer>
  );
};

export default Chats;

const styles = StyleSheet.create({});
