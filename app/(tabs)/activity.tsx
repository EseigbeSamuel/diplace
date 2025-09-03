import { AppHeader } from "@/components/header";
import HeaderTabs from "@/components/headertab";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import ActiveActivity from "../views/activities/active";
import ActivityHistory from "../views/activities/history";

const Activity = () => {
  const [activeTab, setActiveTab] = useState("active");
  const isInitialMount = useRef(true);
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
        return <ActiveActivity />;
      case "history":
        return <ActivityHistory />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaViewContainer>
      <AppHeader title="Activity" />
      <HeaderTabs
        tabs={[
          { id: "active", label: "Active" },
          { id: "history", label: "History" },
        ]}
        initialActiveTab={activeTab}
        renderContent={renderContent}
        onTabChange={handleTabChange}
      />
    </SafeAreaViewContainer>
  );
};

export default Activity;
const styles = StyleSheet.create({});
