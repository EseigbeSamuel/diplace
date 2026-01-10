// import AppButton from "@/components/button";
// import RadioCard from "@/components/radio-card/radioCard";
// import SafeAreaViewContainer from "@/components/safeareaview";
// import { useTheme } from "@/contexts/themeContext";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Alert, Text, View } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";

// export default function GetStarted() {
//   const { colors } = useTheme();

//   const route = useRouter();
//   const [selected, setSelected] = useState("");

//   const handleNavigation = () => {
//     if (selected === "renter") {
//       route.push("/onboarding/renter/renter");
//     } else if (selected === "agent") {
//       route.push("/onboarding/agent/agent");
//     } else {
//       Alert.alert("select an option");
//     }
//   };

//   return (
//     <SafeAreaViewContainer className="items-center justify-center gap-4">
//       <View className="items-center justify-center">
//         <View className="w-[230px] h-[290px] bg-[#F9F9FB]"></View>
//       </View>
//       <View className="w-full gap-2">
//         <Text
//           style={{ fontSize: RFValue(32), color: colors.slate[650] }}
//           className="font-bold"
//         >
//           Welcome! 👋 {"\n"}
//           Let’s help you tailor {"\n"} your experience.
//         </Text>
//         <Text
//           style={{
//             color: colors.slate[600],
//           }}
//           className="text-base"
//         >
//           What will you use DiPlace for? Let’s help you {"\n"} customize your
//           experience to meet your goals.
//         </Text>
//       </View>

//       <View className="w-full p-5">
//         <RadioCard
//           label="I am a Renter looking for a space"
//           value="renter"
//           selected={selected}
//           onSelect={setSelected}
//         />
//         <RadioCard
//           label="I am a space Agent / Manager / Owner"
//           value="agent"
//           selected={selected}
//           onSelect={setSelected}
//         />
//       </View>
//       <View className="w-full">
//         <AppButton
//           title="Get Started"
//           // onPress={() => route.push("/auth/login")}
//           onPress={handleNavigation}
//           fullwidth
//           disabled={!selected}
//         />
//       </View>
//     </SafeAreaViewContainer>
//   );
// }

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import RadioCard from "@/components/radio-card/radioCard";

const { width, height } = Dimensions.get("window");

const GetStarted: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("");

  const handleGetStarted = () => {
    if (selectedType === "renter") {
      router.push("/onboarding/renter/renter");
    } else if (selectedType === "agent") {
      router.push("/onboarding/agent/agent");
    } else {
      Alert.alert("select an option");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("@/assets/images/owner-right.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark Overlay Gradient */}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.3)",
            "rgba(0, 0, 0, 0.7)",
            "rgba(0, 0, 0, 0.9)",
          ]}
          style={styles.gradientOverlay}
        >
          <View style={styles.content}>
            {/* Welcome Text */}
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>
                Welcome! 👋{"\n"}
                Let's help you tailor your experience.
              </Text>
              <Text style={styles.descriptionText}>
                What will you use DRPlace for? Let's help you customize your
                experience to meet your goals.
              </Text>
            </View>

            {/* Selection Options */}
            <View style={styles.optionsContainer}>
              <RadioCard
                label="I am a Renter looking for a space"
                value="renter"
                selected={selectedType}
                onSelect={setSelectedType}
              />
              <RadioCard
                label="I am a space Agent / Manager / Owner"
                value="agent"
                selected={selectedType}
                onSelect={setSelectedType}
              />
            </View>

            {/* Get Started Button */}
            <View style={styles.buttonContainer}>
              <AppButton
                title="Get Started"
                onPress={handleGetStarted}
                size="large"
                fullwidth={true}
                disabled={!selectedType}
                variant={"secondary"}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      width: width,
      height: height,
    },
    gradientOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    content: {
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(40),
    },
    textContainer: {
      marginBottom: RFValue(40),
    },
    welcomeText: {
      fontSize: RFValue(28),
      fontWeight: "700",
      color: "#FFFFFF",
      lineHeight: RFValue(36),
      marginBottom: RFValue(16),
    },
    descriptionText: {
      fontSize: RFValue(14),
      color: "rgba(255, 255, 255, 0.85)",
      lineHeight: RFValue(22),
    },
    optionsContainer: {
      gap: RFValue(16),
      marginBottom: RFValue(32),
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: RFValue(12),
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    optionButtonSelected: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderColor: "#FFFFFF",
    },
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: "#FFFFFF",
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: "#FFFFFF",
    },
    optionText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.85)",
      flex: 1,
    },
    optionTextSelected: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    buttonContainer: {
      marginTop: RFValue(8),
    },
  });

export default GetStarted;
