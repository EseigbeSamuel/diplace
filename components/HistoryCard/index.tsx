import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const HistoryCard = ({
  badgeType,
  date,
  title,
  description,
  action,
}: {
  badgeType?: "reserved" | "inprogress" | "successful";
  date: string;
  title: string;
  description: string;
  action: string;
}) => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const renderBadge = () => {
    switch (badgeType) {
      case "reserved":
        return (
          <View className=" px-2 py-1 border border-red-500 rounded-full bg-red-400/40">
            <Text className="text-red-600">Reserved</Text>
          </View>
        );
      case "inprogress":
        return (
          <View className=" px-2 py-1 border border-orange-500 rounded-full bg-orange-400/40">
            <Text className="text-orange-600">In Progress</Text>
          </View>
        );
      case "successful":
        return (
          <View className="px-2 py-1 border border-green-500 rounded-full bg-green-400/40">
            <Text className="text-green-600">Successful</Text>
          </View>
        );
    }
  };
  return (
    <View className="py-4 flex flex-row gap-4">
      <View
        style={homeStyles.graybg}
        className="rounded-[999px] h-12 w-12 flex justify-center items-center p-3"
      >
        {isDarkMode ? (
          <Image
            source={require("@/assets/icons/history-light.png")}
            className="w-6 h-6"
          />
        ) : (
          <Image
            source={require("@/assets/icons/history-dark.png")}
            className="w-6 h-6"
          />
        )}
      </View>
      <View className="flex-1">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-2 items-center">
            <Text style={homeStyles.subTitle}>{date}</Text>
            <Text>
              <Image
                source={require("@/assets/icons/Ellipse.png")}
                className="w-2 h-2"
              />
            </Text>
            <Text style={homeStyles.subTitle}>{action}</Text>
          </View>
          <View>{renderBadge()}</View>
        </View>
        <View>
          <Text style={homeStyles.title} className=" font-semibold">
            {title}
          </Text>
          <View className="">
            <Text style={homeStyles.text} className="">
              {description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.slate[300],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    graybg: {
      backgroundColor: colors.slate[150],
    },
  });
