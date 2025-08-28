import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { StyleSheet, Text } from "react-native";

const Activity = () => {
  return (
    <SafeAreaViewContainer>
      <AppHeader title={"Activity"} />
      <Text>Activity page</Text>
    </SafeAreaViewContainer>
  );
};

export default Activity;

const styles = StyleSheet.create({});
