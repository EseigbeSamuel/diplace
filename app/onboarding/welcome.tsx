import AppButton from "@/components/button";
import Selector, { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser, useSetUserType } from "@/hooks";
import { UserType } from "@/types";
import { ColorScheme } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const GetStarted: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const { currentUser } = useGetCurrentUser();

  const { setUserTypeMutation, setUserTypeMutationPending } = useSetUserType();

  const handleGetStarted = () => {
    if (!currentUser || !selectedType) return;

    setUserTypeMutation({
      user_type: selectedType,
      email: currentUser.email,
    });
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
                Let&apos;s help you tailor your experience.
              </Text>
              <Text style={styles.descriptionText}>
                What will you use DiPlace for? Let&apos;s help you customize
                your experience to meet your goals.
              </Text>
            </View>

            {/* Selection Options */}
            <View style={styles.optionsContainer}>
              <Pressable onPress={() => setSelectedType("renter")}>
                <View
                  className="p-4 flex-row w-full items-center gap-4 rounded-xl"
                  style={
                    selectedType === "renter"
                      ? styles.borderDarkGray
                      : styles.borderLightGray
                  }
                >
                  <Image
                    source={
                      selectedType === "renter"
                        ? require("@/assets/icons/checkbox-circle-fill.png")
                        : require("@/assets/icons/checkbox-blank-circle-outline.png")
                    }
                    style={styles.checkbox}
                    className="w-6 h-6"
                  />
                  <Text style={styles.subTitle}>
                    I am a Renter looking for a space
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setSelectedType("agent")}>
                <View
                  className="p-4 flex-row w-full items-center gap-4 rounded-xl"
                  style={
                    selectedType === "agent"
                      ? styles.borderDarkGray
                      : styles.borderLightGray
                  }
                >
                  <Image
                    source={
                      selectedType === "agent"
                        ? require("@/assets/icons/checkbox-circle-fill.png")
                        : require("@/assets/icons/checkbox-blank-circle-outline.png")
                    }
                    style={styles.checkbox}
                    className="w-6 h-6"
                  />
                  <Text style={styles.subTitle}>
                    I am a space Agent / Manager / Owner
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Get Started Button */}
            <View style={styles.buttonContainer}>
              <AppButton
                title="Get Started"
                onPress={handleGetStarted}
                size="large"
                fullwidth={true}
                disabled={!selectedType || setUserTypeMutationPending}
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
    checkbox: {
      tintColor: "#FFFFFF",
    },
    borderDarkGray: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#FFFFFF",
      borderRadius: RFValue(12),
    },
    borderLightGray: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: RFValue(12),
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: "#FFFFFF",
    },
  });

export default GetStarted;
