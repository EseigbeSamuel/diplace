import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";

interface Review {
  id: number;
  name: string;
  verified: boolean;
  date: string;
  avatar: any;
  comment: string;
}

const ReviewsList = () => {
  const { colors } = useTheme();
  const reviewsListStyles = styles(colors);

  const reviews: Review[] = [
    {
      id: 1,
      name: "Elizabeth Anniesamka",
      verified: true,
      date: "2 days ago",
      avatar: require("@/assets/images/user.png"),
      comment:
        "This agent is very professional and down to earth. The images he uploads describes what I saw and I appreciate his openess.",
    },
    {
      id: 2,
      name: "John Zighan",
      verified: false,
      date: "3 weeks ago",
      avatar: require("@/assets/images/user.png"),
      comment:
        "Compared to other agents, his rates are fair and he treated me with alot of respect, I advocate.",
    },
    {
      id: 3,
      name: "Samuel Timipre",
      verified: false,
      date: "3 weeks ago",
      avatar: require("@/assets/images/user.png"),
      comment:
        "I got the booking done with so so quickly, love what I saw and it was my perfect fit.",
    },
    {
      id: 4,
      name: "Sarah Oloum",
      verified: true,
      date: "3 weeks ago",
      avatar: require("@/assets/images/user.png"),
      comment:
        "I got the booking done with so so quickly, love what I saw and it was my perfect fit.",
    },
    {
      id: 5,
      name: "Martha Inerighe",
      verified: false,
      date: "3 weeks ago",
      avatar: require("@/assets/images/user.png"),
      comment:
        "I got the booking done with so so quickly, love what I saw and it was my perfect fit.",
    },
  ];

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Reviews" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={reviewsListStyles.container}>
          <Text style={reviewsListStyles.reviewCount}>
            Reviews ({reviews.length})
          </Text>

          {reviews.map((review) => (
            <View key={review.id} style={reviewsListStyles.reviewCard}>
              <View style={reviewsListStyles.reviewHeader}>
                <Image
                  source={review.avatar}
                  style={reviewsListStyles.avatar}
                />
                <View style={reviewsListStyles.reviewerInfo}>
                  <View style={reviewsListStyles.reviewerNameRow}>
                    <Text style={reviewsListStyles.reviewerName}>
                      {review.name}
                    </Text>
                    {review.verified && (
                      <Image
                        source={require("@/assets/icons/badge-check-green.png")}
                        style={reviewsListStyles.verifiedBadge}
                      />
                    )}
                  </View>
                  <Text style={reviewsListStyles.reviewDate}>
                    {review.date}
                  </Text>
                </View>
              </View>
              <Text style={reviewsListStyles.reviewComment}>
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default ReviewsList;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: RFValue(16),
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
  });
