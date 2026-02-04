import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { Notes, NotesTabs } from "@/constants/mockNotifications";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Notifications = () => {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = useMemo(
    () => Notes.filter((note) => note.unread).length,
    [],
  );
  const filteredNotes = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return Notes.filter((note) => note.unread);

      case "previous":
        return Notes.filter((note) => !note.unread);

      case "date":
        return [...Notes].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      case "all":
      default:
        return Notes;
    }
  }, [activeTab]);

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Notification" />
      <View>
        {/* <FlatList
          data={NotesTabs}
          contentContainerClassName="gap-4 "
          renderItem={({ item }) => (
             const isActive = activeTab === item.name
  const showBadge = item.name === "unread" && unreadCount > 0;
        
        
        return ( <Pressable onPress={() => setActiveTab(item.name)}>
              <View className="">
                <View style={custom.active} className=" rounded-full py-3 px-4 border border-gray-300 flex-row flex items-center gap-2">
                  {item.icons && (
                    <Image source={item.icons} className="size-5" />
                  )}
                  <Text
                    style={custom.smallDark}
                    className="capitalize font-medium "
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </Pressable> )
           
          )}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        /> */}
        <FlatList
          data={NotesTabs}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4"
          renderItem={({ item }) => {
            const isActive = activeTab === item.name;
            const showBadge = item.name === "unread" && unreadCount > 0;

            return (
              <Pressable onPress={() => setActiveTab(item.name)}>
                <View
                  style={{
                    borderColor: isActive
                      ? colors.slate[650]
                      : colors.slate[300],
                    backgroundColor: isActive
                      ? colors.slate[150]
                      : "transparent",
                  }}
                  className="rounded-full py-3 px-4 border flex-row items-center gap-2"
                >
                  {item.icons && (
                    <Image source={item.icons} className="size-5" />
                  )}

                  <Text
                    style={{
                      color: isActive ? colors.slate[650] : colors.slate[600],
                    }}
                    className="capitalize font-medium"
                  >
                    {item.name}
                  </Text>

                  {showBadge && (
                    <View
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 10 }}>
                        {unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <View className="flex flex-col gap-4 w-full h-full ">
        <FlatList
          data={filteredNotes}
          contentContainerClassName="gap-4 p-2 "
          //   renderItem={({ item }) => (
          //     <View className="flex flex-col gap-3">
          //       <View className="p-4 rounded-full">
          //         <Image
          //           source={
          //             item.type === "bell"
          //               ? require("@/assets/icons/notification.png")
          //               : "D"
          //           }
          //         />
          //       </View>
          //       <View>
          //         <View>
          //           <Text>{item.title} </Text>{" "}
          //           <View className="flex flex-row items-center gap-2">
          //             <Text>{item.date}</Text>
          //             {item.unread && (
          //               <View className="w-2 h-2 rounded-full bg-red-700" />
          //             )}
          //           </View>
          //         </View>
          //         <Text>{item.desc} </Text>
          //         <View>
          //           {" "}
          //           <Text>{item.action} </Text>{" "}
          //           <Image
          //             source={
          //               item.action === "Download receipt"
          //                 ? require("@/assets/icons/Download - Iconly Pro.png")
          //                 : require("@/assets/icons/arrow-left-dark.png")
          //             }
          //           />
          //         </View>
          //       </View>
          //     </View>
          //   )}
          renderItem={({ item }) => (
            <View
              style={[{ backgroundColor: colors.background }, custom.shadow]}
              className="flex flex-row gap-4 p-4 rounded-2xl  "
            >
              <View className="p-3 size-[50px] flex flex-row items-center justify-center rounded-full bg-gray-100">
                <Image
                  source={
                    item.type === "bell"
                      ? require("@/assets/icons/notification.png")
                      : require("@/assets/icons/Lock.png")
                  }
                />
              </View>

              <View className="flex-1 gap-3">
                <View>
                  <View className="flex flex-row items-center justify-between">
                    <Text style={custom.smallDark} className="font-semibold">
                      {item.title}
                    </Text>

                    <View className="flex flex-row items-center gap-2">
                      <Text
                        style={custom.tiny}
                        className="text-xs text-gray-500"
                      >
                        {item.date}
                      </Text>
                      {item.unread && (
                        <View className="w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </View>
                  </View>

                  <Text style={custom.smallDark} className="text-gray-600">
                    {item.desc}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <Text
                    style={custom.smallDark}
                    className="text-primary-600 font-medium"
                  >
                    {item.action}
                  </Text>

                  {isDarkMode ? (
                    <Image
                      source={
                        item.action === "Download receipt"
                          ? require("@/assets/icons/Download - Iconly Pro.png")
                          : require("@/assets/icons/arrow-right-light.png")
                      }
                      className="size-[20px]"
                    />
                  ) : (
                    <Image
                      source={
                        item.action === "Download receipt"
                          ? require("@/assets/icons/Download - Iconly Pro.png")
                          : require("@/assets/icons/arrow-right-dark.png")
                      }
                      className="size-[20px]"
                    />
                  )}
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Notifications;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    container2: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
    },
    big: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    smallDark: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
    shadow: {
      shadowColor: colors.slate[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
  });
