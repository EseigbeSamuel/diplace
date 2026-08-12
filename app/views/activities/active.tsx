import ActiveActivityCard from "@/components/ActiveActivityCard";
import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useGetActiveActivities } from "@/hooks";
import { ActiveActivityItem } from "@/types";
import { ColorScheme } from "@/utils";

const ActiveActivity = () => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);
  const { data: activeActivities, isLoading } = useGetActiveActivities();

  const renderSection = (
    title: string,
    data: ActiveActivityItem[] | undefined,
    icon: any,
    status: string,
    buttonTitle: string = "View",
    datePrefix: string = "",
  ) => {
    if (!data || data.length === 0) return null;

    return (
      <View style={s.sectionContainer}>
        <Text style={s.sectionTitle}>{title}</Text>
        <View className="gap-4">
          {data.map((item, index) => (
            <ActiveActivityCard
              key={item.booking_id || item.inspection_id || index}
              buttonTitle={buttonTitle}
              date={item.due_date ? `${datePrefix}${item.due_date}` : undefined}
              title={item.property.title}
              image={icon}
              location={item.property.location}
              onPress={() =>
                router.push({
                  pathname: "/views/activities/activity-schedule/[index]",
                  params: {
                    index: item.booking_id || item.inspection_id,
                    role: "renter",
                    status: status,
                    title: item.property.title,
                  },
                })
              }
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={s.todayCard} className="flex flex-row gap-4 p-4 border rounded-lg m-4">
        <Image
          source={require("@/assets/icons/calender-dark.png")}
          className="w-9 h-9"
        />
        <View>
          <Text style={s.todayTitle}>Today's Activity</Text>
          <Text style={s.todayBody} className="break-words w-[80%] font-medium">
            Check your today's schedule for upcoming events.
          </Text>
          <View className="flex flex-row items-center gap-2">
            <Text
              style={s.viewLink}
              className="pt-7"
              onPress={() => router.push("/views/activities/todayActivity")}
            >
              View schedule
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.slate[650]} className="mt-10" />
      ) : activeActivities ? (
        <>
          {renderSection(
            "Scheduled",
            activeActivities.scheduled,
            isDarkMode
              ? require("@/assets/icons/calender-white.png")
              : require("@/assets/icons/calendar.png"),
            "scheduled",
          )}
          {renderSection(
            "Reserved",
            activeActivities.reserved,
            isDarkMode
              ? require("@/assets/icons/lock-light.png")
              : require("@/assets/icons/Lock.png"),
            "reserved",
            "View",
            "Due: ",
          )}
          {renderSection(
            "Booked",
            activeActivities.booked,
            isDarkMode
              ? require("@/assets/icons/lock-light.png")
              : require("@/assets/icons/Lock.png"),
            "booked",
            "View",
          )}
          {renderSection(
            "Inspected",
            activeActivities.inspected,
            isDarkMode
              ? require("@/assets/icons/lock-light.png")
              : require("@/assets/icons/Lock.png"),
            "inspected",
            "Book",
          )}

          {!activeActivities.scheduled?.length &&
            !activeActivities.reserved?.length &&
            !activeActivities.booked?.length &&
            !activeActivities.inspected?.length && (
              <Text style={s.emptyText}>No active activities found.</Text>
            )}
        </>
      ) : null}
    </ScrollView>
  );
};

export default ActiveActivity;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    todayCard: {
      borderColor: colors.slate[300],
      backgroundColor: colors.slate[150],
    },
    todayTitle: {
      color: colors.slate[650],
      fontSize: 18,
      fontWeight: "600",
    },
    todayBody: {
      color: colors.slate[650],
    },
    viewLink: {
      color: colors.slate[650],
    },
    sectionContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    sectionTitle: {
      color: colors.slate[650],
      paddingBottom: 16,
      fontSize: 18,
      fontWeight: "600",
    },
    emptyText: {
      color: colors.slate[500],
      textAlign: "center",
      marginTop: 20,
    },
  });
