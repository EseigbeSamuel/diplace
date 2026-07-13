import React from "react";
import {
  ActivityIndicator,
  Image,
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
import { useListReviews } from "@/hooks";
import { PropertyReviewItem } from "@/types";

const getReviewerUser = (review: PropertyReviewItem) => {
  if ("user" in review.reviewer) return review.reviewer.user;
  return review.reviewer;
};

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ReviewsList = () => {
  const { colors } = useTheme();
  const reviewsListStyles = styles(colors);
  const { reviews, reviewsTotal, isReviewsLoading, reviewsError } =
    useListReviews({
      params: {
        current_user: true,
        status: "active",
        limit: 100,
      },
    });

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Reviews" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={reviewsListStyles.container}>
          <Text style={reviewsListStyles.reviewCount}>
            Reviews ({reviewsTotal})
          </Text>

          {isReviewsLoading ? (
            <ActivityIndicator size="small" color={colors.slate[650]} />
          ) : reviewsError ? (
            <Text style={reviewsListStyles.emptyText}>
              Unable to load reviews.
            </Text>
          ) : reviews.length ? (
            reviews.map((review) => {
              const reviewer = getReviewerUser(review);
              const reviewerName =
                [reviewer.first_name, reviewer.last_name]
                  .filter(Boolean)
                  .join(" ") || "User";

              return (
                <View key={review.public_id} style={reviewsListStyles.reviewCard}>
                  <View style={reviewsListStyles.reviewHeader}>
                    <Image
                      source={
                        reviewer.profile_picture
                          ? { uri: reviewer.profile_picture }
                          : require("@/assets/images/user.png")
                      }
                      style={reviewsListStyles.avatar}
                    />
                    <View style={reviewsListStyles.reviewerInfo}>
                      <View style={reviewsListStyles.reviewerNameRow}>
                        <Text style={reviewsListStyles.reviewerName}>
                          {reviewerName}
                        </Text>
                        {review.status === "verified" && (
                          <Image
                            source={require("@/assets/icons/badge-check-green.png")}
                            style={reviewsListStyles.verifiedBadge}
                          />
                        )}
                      </View>
                      <Text style={reviewsListStyles.reviewDate}>
                        {formatReviewDate(review.date_created)}
                      </Text>
                    </View>
                  </View>
                  <Text style={reviewsListStyles.reviewComment}>
                    {review.comment}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={reviewsListStyles.emptyText}>No reviews yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default ReviewsList;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: RFValue(3),
      paddingTop: RFValue(16),
    },
    reviewCount: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    reviewCard: {
      paddingVertical: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
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
      backgroundColor: colors.slate[300],
    },
    reviewerInfo: {
      flex: 1,
      justifyContent: "center",
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
