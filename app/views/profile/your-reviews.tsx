import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";

const YourReviews = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const reviewStyles = styles(colors);

  const stats = [
    {
      icon: require("@/assets/icons/activity-active.png"),
      value: "85%",
      label: "Success",
      color: colors.info[200],
    },
    {
      icon: require("@/assets/icons/Time Circle - Iconly Pro-1.png"),
      value: "2mins",
      label: "Average Response\nTime",
      color: colors.error[300],
    },
    {
      icon: require("@/assets/icons/success.png"),
      value: "245",
      label: "Completed\nBookings",
      color: colors.success[200],
    },
  ];

  const ratingData = [
    { stars: 5, count: 150, percentage: 90 },
    { stars: 4, count: 80, percentage: 60 },
    { stars: 3, count: 30, percentage: 30 },
    { stars: 2, count: 10, percentage: 15 },
    { stars: 1, count: 5, percentage: 8 },
  ];

  const reviews = [
    {
      id: 1,
      name: "Elizabeth Anniesamka",
      verified: true,
      date: "2 days ago",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      comment:
        "This agent is very professional and down to earth. The images he uploads describes what I saw and I appreciate his openess.",
    },
  ];

  const handleSeeMore = () => {
    router.push("/views/profile/review-list");
  };

  const renderStars = (rating: number) => {
    return (
      <View style={reviewStyles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Image
            key={star}
            source={
              star <= rating
                ? require("@/assets/icons/star.png")
                : require("@/assets/icons/Star - Iconly Pro.png")
            }
            style={reviewStyles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Your Reviews" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={reviewStyles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={reviewStyles.statCard}>
              <View
                style={[
                  reviewStyles.statIconContainer,
                  { backgroundColor: stat.color + "20" },
                ]}
              >
                <Image
                  source={stat.icon}
                  style={[reviewStyles.statIcon, { tintColor: stat.color }]}
                />
              </View>
              <Text style={reviewStyles.statValue}>{stat.value}</Text>
              <Text style={reviewStyles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Ratings Section */}
        <View style={reviewStyles.section}>
          <Text style={reviewStyles.sectionTitle}>Ratings</Text>
          <Text style={reviewStyles.sectionDescription}>
            These ratings and reviews are verified from people who have
            transacted with you
          </Text>

          {/* Average Rating */}
          <View style={reviewStyles.averageRatingContainer}>
            <Text style={reviewStyles.averageRating}>4.5</Text>
            {renderStars(4)}
          </View>

          {/* Rating Bars */}
          <View style={reviewStyles.ratingBarsContainer}>
            {ratingData.map((rating) => (
              <View key={rating.stars} style={reviewStyles.ratingRow}>
                <Text style={reviewStyles.ratingNumber}>{rating.stars}</Text>
                <Image
                  source={require("@/assets/icons/star.png")}
                  style={reviewStyles.smallStarIcon}
                />
                <View style={reviewStyles.ratingBarBackground}>
                  <View
                    style={[
                      reviewStyles.ratingBarFill,
                      { width: `${rating.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={reviewStyles.section}>
          <View style={reviewStyles.reviewsHeader}>
            <Text style={reviewStyles.sectionTitle}>Reviews (15)</Text>
            <Pressable onPress={handleSeeMore}>
              <View style={reviewStyles.seeMoreButton}>
                <Text style={reviewStyles.seeMoreText}>See more</Text>
                <Image
                  source={require("@/assets/icons/arrow-right-dark.png")}
                  style={reviewStyles.arrowIcon}
                />
              </View>
            </Pressable>
          </View>

          {/* Review Cards */}
          {reviews.map((review) => (
            <View key={review.id} style={reviewStyles.reviewCard}>
              <View style={reviewStyles.reviewHeader}>
                <Image
                  source={{ uri: review.avatar }}
                  style={reviewStyles.avatar}
                />
                <View style={reviewStyles.reviewerInfo}>
                  <View style={reviewStyles.reviewerNameRow}>
                    <Text style={reviewStyles.reviewerName}>{review.name}</Text>
                    {review.verified && (
                      <Image
                        source={require("@/assets/icons/badge-check-green.png")}
                        style={reviewStyles.verifiedBadge}
                      />
                    )}
                  </View>
                  <Text style={reviewStyles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <Text style={reviewStyles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default YourReviews;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(20),
      gap: RFValue(12),
    },
    statCard: {
      flex: 1,
      alignItems: "center",
    },
    statIconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(8),
    },
    statIcon: {
      width: RFValue(20),
      height: RFValue(20),
    },
    statValue: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    statLabel: {
      fontSize: RFValue(11),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(14),
    },
    section: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(20),
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    sectionTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    sectionDescription: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      lineHeight: RFValue(18),
      marginBottom: RFValue(16),
    },
    averageRatingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(20),
    },
    averageRating: {
      fontSize: RFValue(32),
      fontWeight: "700",
      color: colors.slate[650],
      marginRight: RFValue(12),
    },
    starsContainer: {
      flexDirection: "row",
      gap: RFValue(4),
    },
    starIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: "#FFA500",
    },
    ratingBarsContainer: {
      gap: RFValue(12),
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
    },
    ratingNumber: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      width: RFValue(12),
    },
    smallStarIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: "#FFA500",
    },
    ratingBarBackground: {
      flex: 1,
      height: RFValue(8),
      backgroundColor: colors.slate[250],
      borderRadius: RFValue(4),
      overflow: "hidden",
    },
    ratingBarFill: {
      height: "100%",
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(4),
    },
    reviewsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: RFValue(16),
    },
    seeMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
    },
    seeMoreText: {
      fontSize: RFValue(14),
      color: colors.info[200],
    },
    arrowIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.info[200],
    },
    reviewCard: {
      marginBottom: RFValue(16),
    },
    reviewHeader: {
      flexDirection: "row",
      marginBottom: RFValue(12),
    },
    avatar: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      marginRight: RFValue(12),
    },
    reviewerInfo: {
      flex: 1,
    },
    reviewerNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      marginBottom: RFValue(2),
    },
    reviewerName: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    verifiedBadge: {
      width: RFValue(16),
      height: RFValue(16),
    },
    reviewDate: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    reviewComment: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
  });
