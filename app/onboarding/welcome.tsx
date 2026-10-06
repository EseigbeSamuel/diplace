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
    <View  className="flex-1">
      {/* Background Image */}
      <ImageBackground
        source={require("@/assets/images/owner-right.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
       className="flex-1">
        {/* Dark Overlay Gradient */}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.3)",
            "rgba(0, 0, 0, 0.7)",
            "rgba(0, 0, 0, 0.9)",
          ]}

         className="flex-1 justify-end">
          <View style={styles.content}>
            {/* Welcome Text */}
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText} className="font-bold text-[#FFFFFF]">
                Welcome! 👋{"\n"}
                Let&apos;s help you tailor your experience.
              </Text>
              <Text style={styles.descriptionText} className="text-[rgba(255, 255, 255, 0.85)]">
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

                    className="w-6 h-6 tint-[#FFFFFF]"
                  />
                  <Text style={styles.subTitle} className="text-[#FFFFFF]">
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

                    className="w-6 h-6 tint-[#FFFFFF]"
                  />
                  <Text style={styles.subTitle} className="text-[#FFFFFF]">
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
    container: {},
    backgroundImage: {width: width,
height: height},
    gradientOverlay: {},
    content: {
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(40),
    },
    textContainer: {
      marginBottom: RFValue(40),
    },
    welcomeText: {fontSize: RFValue(28),
lineHeight: RFValue(36),
marginBottom: RFValue(16)},
    descriptionText: {fontSize: RFValue(14),
lineHeight: RFValue(22)},
    optionsContainer: {
      gap: RFValue(16),
      marginBottom: RFValue(32),
    },
    optionButton: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
borderRadius: RFValue(12)},
    optionButtonSelected: {},
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10)},
    radioOuterSelected: {},
    radioInner: {width: RFValue(10),
height: RFValue(10),
borderRadius: RFValue(5)},
    optionText: {fontSize: RFValue(15)},
    optionTextSelected: {},
    buttonContainer: {
      marginTop: RFValue(8),
    },
    checkbox: {},
    borderDarkGray: {borderRadius: RFValue(12)},
    borderLightGray: {borderRadius: RFValue(12)},
    subTitle: {fontSize: RFValue(14),
lineHeight: RFValue(20)},
  });

export default GetStarted;
