import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface SpaceDescriptionSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const SpaceDescriptionSubstep: React.FC<SpaceDescriptionSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const MAX_DESCRIPTION_LENGTH = 2000;

  const handleNext = () => {
    // Validate if needed
    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Space Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} className="font-semibold">What can we call this space?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Space title"
              placeholderTextColor={colors.slate[500]}
              onChangeText={(text) =>
                setValue({
                  description: {
                    ...spaceForm.value.description,
                    title: text,
                  },
                })
              }
              value={spaceForm.value.description?.title || ""}
             className="w-[100%px] border-[1px] border-style-[solid]"/>
          </View>
          <Text style={styles.helperText}>
            Keep it short max "2 bedrooms in a suite apartments"
          </Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} className="font-semibold">Let's describe this space</Text>
          <View style={styles.textareaWrapper}>
            <TextInput
              style={styles.textarea}
              placeholder="Give a description of this space..."
              placeholderTextColor={colors.slate[500]}
              onChangeText={(text) =>
                setValue({
                  description: {
                    ...spaceForm.value.description,
                    description: text,
                  },
                })
              }
              value={spaceForm.value.description?.description || ""}
              multiline
              numberOfLines={8}
              maxLength={MAX_DESCRIPTION_LENGTH}
              textAlignVertical="top"
             className="w-[100%px] border-[1px] border-style-[solid]"/>
          </View>
          <View  className="flex-row justify-between items-center">
            <Pressable
              style={styles.charCountLabel}
              onPress={() =>
                setValue({
                  description: {
                    ...spaceForm.value.description,
                    description:
                      spaceForm.type === "event"
                        ? "Atraz Palace is a premium 500 capacity event space perfect for weddings, conferences, parties, and special occasions. With elegant interiors, ample parking, and flexible seating arrangements, it offers a seamless experience for both hosts and guests. The hall is fully air-conditioned, generator-powered, and located in a secure, accessible area.Z"
                        : "A clean, spacious 2-bedroom en-suite apartment with modern fittings, private bathrooms, spacious wardrobe,  and steady water and power. Located in a quiet, secure area, ideal for comfort and convenience.",
                  },
                })
              }
            >
              <Text style={styles.charCountText}>Use our suggestion?</Text>
            </Pressable>
            <Text style={styles.charCount}>
              Max {MAX_DESCRIPTION_LENGTH.toLocaleString()} characters
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={
            !spaceForm.value.description?.description ||
            !spaceForm.value.description?.title
          }
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    section: {
      marginBottom: RFValue(32),
    },
    sectionTitle: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(16)},
    inputWrapper: {
      marginBottom: RFValue(8),
    },
    textInput: {paddingVertical: RFValue(14),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300],
fontSize: RFValue(15),
color: colors.slate[650]},
    helperText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      lineHeight: RFValue(18),
    },
    textareaWrapper: {
      marginBottom: RFValue(8),
    },
    textarea: {minHeight: RFValue(150),
paddingVertical: RFValue(14),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300],
fontSize: RFValue(15),
color: colors.slate[650]},
    charCountContainer: {},
    charCountLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(16),
    },
    charCount: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    charCountText: {
      fontSize: RFValue(13),
      color: colors.slate[650],
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default SpaceDescriptionSubstep;
