import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import React from "react";
import { StyleSheet, Text } from "react-native";

const Discover = () => {
  return (
    <SafeAreaViewContainer>
      <AppHeader title={"Discover"} />
      <Text>Discover page</Text>
    </SafeAreaViewContainer>
  );
};

export default Discover;

const styles = StyleSheet.create({});
