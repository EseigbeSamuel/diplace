import { useTheme } from "@/contexts/themeContext";
import { HeaderTab } from "@/types";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface TabsProps {
  tabs: HeaderTab[];
  initialActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  renderContent?: (activeTab: string) => React.ReactNode;
  renderHeader?: React.ReactNode;
  renderAfterIcon?: React.ReactNode;
}

const HeaderTabs: React.FC<TabsProps> = ({
  tabs,
  initialActiveTab,
  onTabChange,
  renderContent,
  renderHeader,
  renderAfterIcon,
}) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);

  const getInitialTab = () => {
    if (initialActiveTab && tabs.some((tab) => tab.id === initialActiveTab)) {
      return initialActiveTab;
    }
    return tabs[0]?.id || "";
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const handleTabPress = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };
  return (
    <View className="flex-1 gap-4">
      <View className="flex flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={homeStyles.borderBlack}
              onPress={() => handleTabPress(tab.id)}
              className={`py-2 ${activeTab === tab.id ? "border-b-2 " : ""}`}
            >
              <Text
                style={{
                  color:
                    activeTab === tab.id
                      ? colors.slate[650]
                      : colors.slate[600],
                  fontSize: RFValue(16),
                  lineHeight: RFValue(20),
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>{renderAfterIcon && renderAfterIcon}</View>
      </View>
      {renderContent && renderContent(activeTab)}
    </View>
  );
};

export default HeaderTabs;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      color: colors.slate[650],
      lineHeight: RFValue(24),
    },
    borderBlack: {
      borderBlockColor: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    titlegray: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[600],
    },
    subTitlegray: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    subTitleblack: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
  });
