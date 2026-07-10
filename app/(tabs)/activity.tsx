import { AppHeader } from "@/components/header";
import HeaderTabs from "@/components/headertab";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import ActiveActivity from "../views/activities/active";
import AgentActiveActivity from "../views/activities/agentActive";
import ActivityHistory from "../views/activities/history";
import { useUser } from "@/contexts/user-context";
import React from "react";

const Activity = () => {
  const [activeTab, setActiveTab] = useState("active");
  const isInitialMount = useRef(true);
  const { userType } = useUser();

  const handleTabChange = (tabId: string) => {
    if (!isInitialMount.current) {
      setActiveTab(tabId);
    } else {
      isInitialMount.current = false;
    }
  };

  const renderContent = (activeTab: string) => {
    switch (activeTab) {
      case "active":
        return userType === "renter" ? <ActiveActivity /> : <AgentActiveActivity />;
      case "history":
        return <ActivityHistory />;
      default:
        return null;
    }
  };

  const headerTitle = userType === "renter" ? "Activity" : "Bookings";

  return (
    <SafeAreaViewContainer disableBottom>
      <AppHeader title={headerTitle} />
      <View className="flex-1">
        <HeaderTabs
          tabs={[
            { id: "active", label: "Active" },
            { id: "history", label: "History" },
          ]}
          initialActiveTab={activeTab}
          renderContent={renderContent}
          onTabChange={handleTabChange}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Activity;
