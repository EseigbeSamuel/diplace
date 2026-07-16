import React, { useMemo } from "react";
import {
  ActivityIndicator,
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
import ViewHeader from "@/components/view-header";
import { useListReviews } from "@/hooks";
import { PropertyReviewItem } from "@/types";

const getReviewerUser = (review: PropertyReviewItem) => {
  if ("user" in review.reviewer) return review.reviewer.user;
  return review.reviewer;
};

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const YourReviews = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const reviewStyles = styles(colors);
  const { reviews, reviewsTotal, isReviewsLoading, reviewsError } =
    useListReviews({
      params: {
        current_user: true,
        status: "active",
        limit: 100,
      },
    });

  const reviewSummary = useMemo(() => {
    const total = reviews.length;
    const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((review) => Math.round(review.rating) === stars)
        .length,
    }));
    const average =
      total > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
        : 0;

    return {
      average,
      roundedAverage: Math.round(average),
      ratingData: ratingCounts.map((item) => ({
        ...item,
        percentage: total ? Math.round((item.count / total) * 100) : 0,
      })),
    };
  }, [reviews]);

  const stats = [
    {
      icon: require("@/assets/icons/activity-active.png"),
      value: reviewsTotal ? "100%" : "0%",
      label: "Success",
      color: colors.info[200],
    },
    {
      icon: require("@/assets/icons/Time Circle - Iconly Pro-1.png"),
      value: "--",
      label: "Average Response\nTime",
      color: colors.error[300],
    },
    {
      icon: require("@/assets/icons/checkbox-circle-fill.png"),
      value: String(reviewsTotal),
      label: "Completed\nBookings",
      color: colors.success[200],
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
      <ViewHeader title="Your Reviews" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={reviewStyles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={reviewStyles.statCard}>
              <View style={[reviewStyles.statIconContainer]}>
                <Image
                  source={stat.icon}
                  style={[reviewStyles.statIcon, { tintColor: stat.color }]}
                />
                <Text style={reviewStyles.statValue}>{stat.value}</Text>
              </View>

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
            <Text style={reviewStyles.averageRating}>
              {reviewSummary.average.toFixed(1)}
            </Text>
            {renderStars(reviewSummary.roundedAverage)}
          </View>

          {/* Rating Bars */}
          <View style={reviewStyles.ratingBarsContainer}>
            {reviewSummary.ratingData.map((rating) => (
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
            <Text style={reviewStyles.sectionTitle}>
              Reviews ({reviewsTotal})
            </Text>
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
          {isReviewsLoading ? (
            <ActivityIndicator size="small" color={colors.slate[650]} />
          ) : reviewsError ? (
            <Text style={reviewStyles.emptyText}>Unable to load reviews.</Text>
          ) : reviews.length ? (
            reviews.slice(0, 3).map((review) => {
              const reviewer = getReviewerUser(review);
              const reviewerName =
                [reviewer.first_name, reviewer.last_name]
                  .filter(Boolean)
                  .join(" ") || "User";

              return (
                <View key={review.public_id} style={reviewStyles.reviewCard}>
                  <View style={reviewStyles.reviewHeader}>
                    <Image
                      source={
                        reviewer.profile_picture
                          ? { uri: reviewer.profile_picture }
                          : require("@/assets/images/user.png")
                      }
                      style={reviewStyles.avatar}
                    />
                    <View style={reviewStyles.reviewerInfo}>
                      <View style={reviewStyles.reviewerNameRow}>
                        <Text style={reviewStyles.reviewerName}>
                          {reviewerName}
                        </Text>
                        {review.status === "verified" && (
                          <Image
                            source={require("@/assets/icons/badge-check-green.png")}
                            style={reviewStyles.verifiedBadge}
                          />
                        )}
                      </View>
                      <Text style={reviewStyles.reviewDate}>
                        {formatReviewDate(review.date_created)}
                      </Text>
                    </View>
                  </View>
                  <Text style={reviewStyles.reviewComment}>
                    {review.comment}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={reviewStyles.emptyText}>No reviews yet.</Text>
          )}
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
      paddingVertical: RFValue(16),
      gap: RFValue(12),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(16),
    },
    statCard: {
      flex: 1,
      alignItems: "center",
    },
    statIconContainer: {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "row",
      gap: RFValue(4),
    },
    statIcon: {
      width: RFValue(20),
      height: RFValue(20),
    },
    statValue: {
      fontSize: RFValue(16),
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
      paddingHorizontal: RFValue(3),
      paddingVertical: RFValue(20),
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
      color: colors.slate[650],
    },
    arrowIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    reviewCard: {
      marginBottom: RFValue(16),
      borderBottomColor: colors.slate[300],
      borderBottomWidth: 1,
      paddingBottom: RFValue(16),
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
    emptyText: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      paddingVertical: RFValue(12),
    },
  });
