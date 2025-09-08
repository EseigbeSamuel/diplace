import { HeaderTab } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TabsProps {
  tabs: HeaderTab[];
  initialActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  renderContent?: (activeTab: string) => React.ReactNode;
}

const HeaderTabs: React.FC<TabsProps> = ({
  tabs,
  initialActiveTab,
  onTabChange,
  renderContent,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    () => initialActiveTab || tabs[0]?.id || ""
  );

  useEffect(() => {
    if (
      initialActiveTab &&
      initialActiveTab !== activeTab &&
      tabs.some((tab) => tab.id === initialActiveTab)
    ) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab, activeTab, tabs]);

  const handleTabPress = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id ? "border-b-2 border-black" : ""
            }`}
          >
            <Text
              className={`text-base ${
                activeTab === tab.id ? "font-semibold" : "font-normal"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent && renderContent(activeTab)}
    </View>
  );
};

export default HeaderTabs;
