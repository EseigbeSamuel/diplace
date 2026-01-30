import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import ViewHeader from "@/components/view-header";

// Mock Bookmarks Data
const bookmarksData = [
  {
    id: "1",
    title: "4 Bedroom bungalow",
    location: "23 Woji Rd. Rumukunushi, Port Harcourt",
    price: "₦1,500,000",
    period: "annum",
    image: require("@/assets/images/SpacesNearbyImage1.png"),
    badge: "DiPlace",
  },
  {
    id: "2",
    title: "Echelon Event Centre",
    location: "34 Stadium Rd. Port Harcourt",
    price: "₦300,000",
    period: "day",
    image: require("@/assets/images/featuredSpaceImage1.png"),
    badge: null,
  },
  {
    id: "3",
    title: "Echelon Event Centre",
    location: "34 Stadium Rd. Port Harcourt",
    price: "₦300,000",
    period: "day",
    image: require("@/assets/images/featuredSpaceImage1.png"),
    badge: null,
  },
  {
    id: "4",
    title: "Echelon Event Centre",
    location: "34 Stadium Rd. Port Harcourt",
    price: "₦300,000",
    period: "day",
    image: require("@/assets/images/featuredSpaceImage1.png"),
    badge: null,
  },
];

const BookmarksScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [bookmarks, setBookmarks] = useState(bookmarksData);

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <ViewHeader title="Bookmarks" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {bookmarks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No bookmarks yet</Text>
            </View>
          ) : (
            <View style={styles.bookmarksList}>
              {bookmarks.map((bookmark) => (
                <View key={bookmark.id} style={styles.bookmarkCard}>
                  <Image
                    source={bookmark.image}
                    style={styles.bookmarkImage}
                    resizeMode="cover"
                  />

                  {/* Bookmark Remove Button */}
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => handleRemoveBookmark(bookmark.id)}
                  >
                    <Image
                      source={require("@/assets/icons/bookmark-light-active.png")}
                      style={styles.bookmarkIcon}
                    />
                  </TouchableOpacity>

                  <View style={styles.bookmarkInfo}>
                    <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>

                    <View style={styles.bookmarkLocationRow}>
                      <Image
                        source={require("@/assets/icons/location.png")}
                        style={styles.locationIcon}
                      />
                      <Text style={styles.bookmarkLocation} numberOfLines={1}>
                        {bookmark.location}
                      </Text>
                    </View>

                    <View style={styles.bookmarkFooter}>
                      <Text style={styles.bookmarkPrice}>
                        {bookmark.price}
                        <Text style={styles.bookmarkPeriod}>
                          /{bookmark.period}
                        </Text>
                      </Text>
                      {bookmark.badge && (
                        <View style={styles.badgeContainer}>
                          <Image
                            source={require("@/assets/icons/Shield Done.png")}
                            style={styles.badgeIcon}
                          />
                          <Text style={styles.badgeText}>{bookmark.badge}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default BookmarksScreen;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      paddingVertical: RFValue(10),
      gap: RFValue(12),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
      marginLeft: RFValue(8),
    },
    scrollContent: {
      paddingBottom: RFValue(40),
    },
    container: {
      flex: 1,
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    bookmarksList: {
      gap: RFValue(16),
    },
    bookmarkCard: {
      borderColor: colors.slate[100],
      overflow: "hidden",
      backgroundColor: colors.background,
      position: "relative",
    },
    bookmarkImage: {
      width: "100%",
      height: RFValue(180),
      borderRadius: RFValue(12),
    },
    bookmarkButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      width: RFValue(32),
      height: RFValue(32),
      borderRadius: RFValue(16),
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      alignItems: "center",
      justifyContent: "center",
    },
    bookmarkIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.error[200],
    },
    bookmarkInfo: {
      paddingVertical: RFValue(12),
      gap: RFValue(6),
    },
    bookmarkTitle: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    bookmarkLocationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
    },
    locationIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[500],
    },
    bookmarkLocation: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      flex: 1,
    },
    bookmarkFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: RFValue(4),
    },
    bookmarkPrice: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    bookmarkPeriod: {
      fontSize: RFValue(13),
      fontWeight: "400",
      color: colors.slate[500],
    },
    badgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.warning[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
      gap: RFValue(4),
    },
    badgeIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.warning[300],
    },
    badgeText: {
      fontSize: RFValue(11),
      fontWeight: "600",
      color: colors.warning[300],
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(80),
    },
    emptyStateText: {
      fontSize: RFValue(16),
      color: colors.slate[500],
    },
  });
