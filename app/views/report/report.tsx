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
    <View style={custom.container} className="flex-1">
      {/* Header */}
      <View style={custom.header} className="items-center">
        <Text style={custom.title} className="font-[InstrumentSansSemiBold] text-center">{title}</Text>
        <Text style={custom.description} className="text-center">{description}</Text>
      </View>

      {/* Options List */}
      <ScrollView
        style={custom.optionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={custom.optionsContent}
       className="flex-1">
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={custom.optionItem}
            onPress={() => setSelectedOption(option.id)}
           className="flex-row items-center">
            <View
              style={[
                custom.radioButton,
                selectedOption === option.id && custom.radioButtonSelected,
              ]}
             className="border-[2px] items-center justify-center">
              {selectedOption === option.id && (
                <View style={custom.radioButtonInner} />
              )}
            </View>
            <Text style={custom.optionText} className="flex-1">{option.title}</Text>
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
    container: {paddingHorizontal: RFValue(20),
paddingTop: RFValue(10),
paddingBottom: RFValue(20)},
    header: {marginBottom: RFValue(24),
gap: RFValue(8)},
    title: {fontSize: RFValue(20),
lineHeight: RFValue(28),
color: colors.slate[650]},
    description: {fontSize: RFValue(14),
lineHeight: RFValue(20),
color: colors.slate[600]},
    optionsList: {marginBottom: RFValue(16)},
    optionsContent: {
      gap: RFValue(12),
      paddingBottom: RFValue(16),
    },
    optionItem: {gap: RFValue(12),
paddingVertical: RFValue(12),
paddingHorizontal: RFValue(4)},
    radioButton: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[300]},
    radioButtonSelected: {
      borderColor: colors.slate[650],
    },
    radioButtonInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    optionText: {fontSize: RFValue(15),
lineHeight: RFValue(22),
color: colors.slate[650]},
    buttonContainer: {
      paddingTop: RFValue(8),
    },
  });
