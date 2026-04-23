import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type ReportOption = {
  id: string;
  title: string;
};

type ReportBottomSheetProps = {
  type: "property" | "lister";
  onSubmit: (selectedOption: string) => void;
  onCancel?: () => void;
};

const REPORT_OPTIONS = {
  property: [
    { id: "1", title: "Wrong & incorrect information" },
    { id: "2", title: "Fake / Scam listing" },
    { id: "3", title: "Already rented out" },
    { id: "4", title: "Misleading photos and videos" },
    { id: "5", title: "Property is duplicated in the app" },
    { id: "6", title: "Inaccessible address" },
    { id: "7", title: "Others" },
  ],
  lister: [
    { id: "1", title: "Was rude and unprofessional" },
    { id: "2", title: "Unresponsive & poor communication" },
    { id: "3", title: "Didn't show up for inspection" },
    { id: "4", title: "Scam & suspicious behaviour" },
    { id: "5", title: "Fraudulent activity & extra charges" },
    { id: "6", title: "Gave out space already to someone" },
    { id: "7", title: "Collected payment outside DiPlace" },
  ],
};

const ReportBottomSheet: React.FC<ReportBottomSheetProps> = ({
  type,
  onSubmit,
  onCancel,
}) => {
  const { colors } = useTheme();
  const custom = styles(colors);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const title =
    type === "property" ? "Report this property" : "Report the lister";
  const description =
    type === "property"
      ? "Let us know what the case is with this listing."
      : "Let us know what the case is with the agent/space manager.";
  const options = REPORT_OPTIONS[type];

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  return (
    <View style={custom.container}>
      {/* Header */}
      <View style={custom.header}>
        <Text style={custom.title}>{title}</Text>
        <Text style={custom.description}>{description}</Text>
      </View>

      {/* Options List */}
      <ScrollView
        style={custom.optionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={custom.optionsContent}
      >
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={custom.optionItem}
            onPress={() => setSelectedOption(option.id)}
          >
            <View
              style={[
                custom.radioButton,
                selectedOption === option.id && custom.radioButtonSelected,
              ]}
            >
              {selectedOption === option.id && (
                <View style={custom.radioButtonInner} />
              )}
            </View>
            <Text style={custom.optionText}>{option.title}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <View style={custom.buttonContainer}>
        <AppButton
          title="Submit"
          onPress={handleSubmit}
          disabled={!selectedOption}
          fullwidth
        />
      </View>
    </View>
  );
};

export default ReportBottomSheet;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(10),
      paddingBottom: RFValue(20),
      flex: 1,
    },
    header: {
      alignItems: "center",
      marginBottom: RFValue(24),
      gap: RFValue(8),
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
      textAlign: "center",
    },
    description: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
      textAlign: "center",
    },
    optionsList: {
      flex: 1,
      marginBottom: RFValue(16),
    },
    optionsContent: {
      gap: RFValue(12),
      paddingBottom: RFValue(16),
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(4),
    },
    radioButton: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[300],
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonSelected: {
      borderColor: colors.slate[650],
    },
    radioButtonInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    optionText: {
      fontSize: RFValue(15),
      lineHeight: RFValue(22),
      color: colors.slate[650],
      flex: 1,
    },
    buttonContainer: {
      paddingTop: RFValue(8),
    },
  });
