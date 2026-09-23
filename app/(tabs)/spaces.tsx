import { AppHeader } from "@/components/header";
import HeaderTabs from "@/components/headertab";
import SafeAreaViewContainer from "@/components/safeareaview";
import React, { useRef, useState } from "react";
import { Image, Pressable, View } from "react-native";
import SpacesDrafts from "../views/spaces/spacesDrafts";
import SpacesPosted from "../views/spaces/spacesPosted";

export default function Spaces() {
  const [activeTab, setActiveTab] = useState("inDrafts");
  const [layout, setLayout] = useState<"tiles" | "box">("box");
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
      case "inDrafts":
        return <SpacesDrafts layout={layout} />;
      case "posted":
        return <SpacesPosted layout={layout} />;
      default:
        return <SpacesDrafts layout={layout} />;
    }
  };
  return (
    <SafeAreaViewContainer disableBottom className="flex-1">
      <AppHeader title="My Spaces" />
      <HeaderTabs
        tabs={[
          { id: "inDrafts", label: "In Draft" },
          { id: "posted", label: "Posted" },
        ]}
        renderAfterIcon={
          <View>
            {layout === "box" ? (
              <Pressable
                onPress={() => setLayout("tiles")}
                hitSlop={8}
              >
                <Image
                  source={require("@/assets/icons/list.png")}
                  className="w-6 h-6"
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => setLayout("box")} hitSlop={8}>
                <Image
                  source={require("@/assets/icons/more-1-line.png")}
                  className="w-6 h-6"
                />
              </Pressable>
            )}
          </View>
        }
        initialActiveTab={activeTab}
        renderContent={renderContent}
        onTabChange={handleTabChange}
      />
    </SafeAreaViewContainer>
  );
}
