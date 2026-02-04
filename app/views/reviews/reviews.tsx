import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import AppButton from "@/components/button";

type TabType = "Listings" | "Reviews";

// Mock Reviews Data
const reviewsData = [
  {
    id: "1",
    name: "Elizabeth Amiesiemeka",
    rating: 5,
    date: "2 days ago",
    comment:
      "This agent is very professional and down to earth. The images he uploaded depicts exactly what I saw and I appreciate his openness.",
    avatar: null,
    verified: true,
  },
  {
    id: "2",
    name: "John Zigban",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Compared to other agents, his rates are fair and he treated me with so much professionalism.",
    avatar: null,
    verified: false,
  },
  {
    id: "3",
    name: "Samuel Timitore",
    rating: 5,
    date: "2 months ago",
    comment:
      "I got the booking done with Ibe so quickly. I love what I saw and it was my perfect fit.",
    avatar: null,
    verified: false,
  },
  {
    id: "4",
    name: "Sarah Oduah",
    rating: 5,
    date: "2 months ago",
    comment:
      "I got the booking done with Ibe so quickly. I love what I saw and it was my perfect fit.",
    avatar: null,
    verified: true,
  },
  {
    id: "5",
    name: "Martha Imengite",
    rating: 5,
    date: "2 months ago",
    comment:
      "I got the booking done with Ibe so quickly. I love what I saw and it was my perfect fit.",
    avatar: null,
    verified: false,
  },
];

// Mock Listings Data
const listingsData = [
  {
    id: "1",
    title: "Self-contain in-suite apartment",
    location: "Orukwo Rd. Elimgbu, Port Harcourt",
    price: "₦250,000",
    period: "annum",
    rating: null,
    image: require("@/assets/images/SpacesNearbyImage1.png"),
    badge: "Available",
  },
  {
    id: "2",
    title: "Atraz Palace Event Hall",
    location: "Road 2, Tony Estate, Rumuewhere",
    price: "₦400,000",
    period: "day",
    rating: null,
    image: require("@/assets/images/featuredSpaceImage1.png"),
    badge: null,
  },
];

const ReviewsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selectedTab, setSelectedTab] = useState<TabType>("Reviews");
  const [showGiveReviewModal, setShowGiveReviewModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const renderStars = (rating: number, size: number = 14) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={{ fontSize: size }}>
            {star <= rating ? "⭐" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  const renderRatingStars = (currentRating: number) => {
    return (
      <View style={styles.ratingStarsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={{ fontSize: RFValue(32) }}>
              {star <= currentRating ? "⭐" : "☆"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const displayedReviews = showAllReviews
    ? reviewsData
    : reviewsData.slice(0, 2);

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: RFValue(12),
            width: RFValue(150),
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Image
              source={require("@/assets/icons/arrow-left-light.png")}
              style={styles.backIcon}
            />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Ibe Alex</Text>
            <View style={styles.headerRating}>
              <Text style={styles.headerRatingText}>⭐ 4.5</Text>
              <Text style={styles.headerReviewCount}>(15 reviews)</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image
              source={require("@/assets/icons/chat-white-inactive.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("@/assets/icons/more-2-line.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, selectedTab === "Listings" && styles.tabActive]}
          onPress={() => setSelectedTab("Listings")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Listings" && styles.tabTextActive,
            ]}
          >
            Listings
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Reviews" && styles.tabActive]}
          onPress={() => setSelectedTab("Reviews")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Reviews" && styles.tabTextActive,
            ]}
          >
            Reviews
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* REVIEWS TAB */}
        {selectedTab === "Reviews" && (
          <View style={styles.reviewsContainer}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/icons/activity-active.png")}
                    style={[styles.statIcon, { tintColor: colors.info[200] }]}
                  />
                </View>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: colors.error[100] },
                  ]}
                >
                  <Image
                    source={require("@/assets/icons/time-circle-bold.png")}
                    style={[styles.statIcon, { tintColor: colors.error[200] }]}
                  />
                </View>
                <Text style={styles.statValue}>2mins</Text>
                <Text style={styles.statLabel}>Average Response Time</Text>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: colors.success[100] },
                  ]}
                >
                  <Image
                    source={require("@/assets/icons/checkbox-circle-fill.png")}
                    style={[
                      styles.statIcon,
                      { tintColor: colors.success[200] },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>245</Text>
                <Text style={styles.statLabel}>Completed Bookings</Text>
              </View>
            </View>

            {/* Ratings Section */}
            <View style={styles.ratingsSection}>
              <Text style={styles.ratingsTitle}>Ratings</Text>
              <Text style={styles.ratingsSubtitle}>
                These ratings and reviews are verified from people who have
                transacted with the person who listed this property.
              </Text>

              <View style={styles.ratingsSummary}>
                <View style={styles.ratingScore}>
                  <Text style={styles.ratingScoreNumber}>4.5</Text>
                  {renderStars(4.5, 16)}
                </View>

                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarLabel}>{star}</Text>
                      <Image
                        source={require("@/assets/icons/star.png")}
                        style={styles.ratingBarStar}
                      />
                      <View style={styles.ratingBarContainer}>
                        <View
                          style={[
                            styles.ratingBarFill,
                            {
                              width:
                                star === 5 ? "90%" : star === 4 ? "10%" : "0%",
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Reviews List */}
            <View style={styles.reviewsListSection}>
              <View style={styles.reviewsListHeader}>
                <Text style={styles.reviewsListTitle}>Reviews (15)</Text>
                {!showAllReviews && (
                  <Pressable onPress={() => setShowAllReviews(true)}>
                    <Text style={styles.seeMoreText}>See more →</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.reviewsList}>
                {displayedReviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                          {review.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.reviewerInfo}>
                        <View style={styles.reviewerNameRow}>
                          <Text style={styles.reviewerName}>{review.name}</Text>
                          {review.verified && (
                            <Image
                              source={require("@/assets/icons/badge-check-green.png")}
                              style={styles.verifiedBadge}
                            />
                          )}
                        </View>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* LISTINGS TAB */}
        {selectedTab === "Listings" && (
          <View style={styles.listingsContainer}>
            {/* Stats Row (same as Reviews tab) */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image
                    source={require("@/assets/icons/activity-active.png")}
                    style={[styles.statIcon, { tintColor: colors.info[200] }]}
                  />
                </View>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: colors.error[100] },
                  ]}
                >
                  <Image
                    source={require("@/assets/icons/time-circle-bold.png")}
                    style={[styles.statIcon, { tintColor: colors.error[200] }]}
                  />
                </View>
                <Text style={styles.statValue}>2mins</Text>
                <Text style={styles.statLabel}>Average Response Time</Text>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: colors.success[100] },
                  ]}
                >
                  <Image
                    source={require("@/assets/icons/checkbox-circle-fill.png")}
                    style={[
                      styles.statIcon,
                      { tintColor: colors.success[200] },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>245</Text>
                <Text style={styles.statLabel}>Completed Bookings</Text>
              </View>
            </View>

            <Text style={styles.listingsTitle}>Ibe's Listings</Text>

            <View style={styles.listingsList}>
              {listingsData.map((listing) => (
                <View key={listing.id} style={styles.listingCard}>
                  <Image
                    source={listing.image}
                    style={styles.listingImage}
                    resizeMode="cover"
                  />
                  {listing.badge && (
                    <View style={styles.listingBadge}>
                      <Text style={styles.listingBadgeText}>
                        {listing.badge}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.listingBookmark}>
                    <Image
                      source={require("@/assets/icons/bookmark-inactive.png")}
                      style={styles.bookmarkIcon}
                    />
                  </TouchableOpacity>

                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{listing.title}</Text>
                    <View style={styles.listingLocationRow}>
                      <Image
                        source={require("@/assets/icons/location-1.png")}
                        style={styles.listingLocationIcon}
                      />
                      <Text style={styles.listingLocation} numberOfLines={1}>
                        {listing.location}
                      </Text>
                    </View>
                    <View style={styles.listingFooter}>
                      <Text style={styles.listingPrice}>
                        {listing.price}
                        <Text style={styles.listingPeriod}>
                          /{listing.period}
                        </Text>
                      </Text>
                      {listing.badge && (
                        <View style={styles.availablePill}>
                          <Text style={styles.availablePillText}>
                            Available
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.button}>
        <AppButton
          title="Give Review"
          variant="primary"
          onPress={() => setShowGiveReviewModal(true)}
        />
      </View>

      {/* Give Review Modal */}
      <Modal
        visible={showGiveReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGiveReviewModal(false)}
      >
        <Pressable
          style={styles.giveReviewOverlay}
          onPress={() => setShowGiveReviewModal(false)}
        >
          <Pressable
            style={styles.giveReviewSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <Text style={styles.giveReviewTitle}>Give review</Text>
            <Text style={styles.giveReviewSubtitle}>
              Please provide feedback about your experience and rate the person
              who listed this property.
            </Text>

            {/* Star Rating */}
            {renderRatingStars(rating)}

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Add Comment</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Give your feedback..."
                placeholderTextColor={colors.slate[450]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={reviewComment}
                onChangeText={setReviewComment}
              />
            </View>

            {/* Submit Button */}
            <AppButton
              title="Submit"
              onPress={() => {
                setShowGiveReviewModal(false);
                // Handle submit
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default ReviewsScreen;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerCenter: {
      flex: 1,
      alignItems: "flex-start",
    },
    headerTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    headerRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
      marginTop: RFValue(2),
    },
    headerRatingText: {
      fontSize: RFValue(13),
      fontWeight: "500",
      color: colors.slate[650],
    },
    headerReviewCount: {
      fontSize: RFValue(13),
      color: colors.info[200],
    },
    headerIcons: {
      flexDirection: "row",
      gap: RFValue(12),
    },
    headerIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    tabsContainer: {
      flexDirection: "row",
      paddingVertical: RFValue(12),
      gap: RFValue(8),
      width: RFValue(150),
    },
    tab: {
      flex: 1,
      paddingVertical: RFValue(8),
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabActive: {
      borderBottomColor: colors.slate[650],
    },
    tabText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[500],
    },
    tabTextActive: {
      color: colors.slate[650],
      fontWeight: "600",
    },
    scrollContent: {
      paddingVertical: RFValue(20),
      paddingBottom: RFValue(40),
    },
    // Stats Row
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: RFValue(24),
      gap: RFValue(8),
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: RFValue(6),
    },
    statIconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.info[100],
      alignItems: "center",
      justifyContent: "center",
    },
    statIcon: {
      width: RFValue(20),
      height: RFValue(20),
    },
    statValue: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    statLabel: {
      fontSize: RFValue(11),
      color: colors.slate[500],
      textAlign: "center",
    },
    // Reviews Tab
    reviewsContainer: {
      gap: RFValue(24),
    },
    ratingsSection: {
      gap: RFValue(12),
    },
    ratingsTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    ratingsSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      lineHeight: RFValue(18),
    },
    ratingsSummary: {
      flexDirection: "row",
      gap: RFValue(20),
      marginTop: RFValue(12),
    },
    ratingScore: {
      alignItems: "center",
      gap: RFValue(8),
    },
    ratingScoreNumber: {
      fontSize: RFValue(36),
      fontWeight: "700",
      color: colors.slate[650],
    },
    starsContainer: {
      flexDirection: "row",
      gap: RFValue(2),
    },
    ratingBars: {
      flex: 1,
      gap: RFValue(6),
    },
    ratingBarRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    ratingBarLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      width: RFValue(8),
    },
    ratingBarStar: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: "#FFA500",
    },
    ratingBarContainer: {
      flex: 1,
      height: RFValue(6),
      backgroundColor: colors.slate[250],
      borderRadius: RFValue(3),
      overflow: "hidden",
    },
    ratingBarFill: {
      height: "100%",
      backgroundColor: colors.slate[650],
    },
    reviewsListSection: {
      gap: RFValue(16),
    },
    reviewsListHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reviewsListTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    seeMoreText: {
      fontSize: RFValue(14),
      color: colors.info[200],
      fontWeight: "500",
    },
    reviewsList: {
      gap: RFValue(16),
    },
    reviewCard: {
      gap: RFValue(12),
    },
    reviewHeader: {
      flexDirection: "row",
      gap: RFValue(12),
    },
    reviewerAvatar: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.slate[300],
      alignItems: "center",
      justifyContent: "center",
    },
    reviewerInitial: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    reviewerInfo: {
      flex: 1,
      gap: RFValue(4),
    },
    reviewerNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
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
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    reviewComment: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    // Listings Tab
    listingsContainer: {
      gap: RFValue(24),
    },
    listingsTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
    },
    listingsList: {
      gap: RFValue(16),
    },
    listingCard: {
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      overflow: "hidden",
      position: "relative",
    },
    listingImage: {
      width: "100%",
      height: RFValue(180),
    },
    listingBadge: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      backgroundColor: colors.success[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
    },
    listingBadgeText: {
      fontSize: RFValue(11),
      fontWeight: "600",
      color: colors.success[300],
    },
    listingBookmark: {
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
      tintColor: colors.slate[650],
    },
    listingInfo: {
      padding: RFValue(12),
      gap: RFValue(6),
    },
    listingTitle: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    listingLocationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
    },
    listingLocationIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[500],
    },
    listingLocation: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      flex: 1,
    },
    listingFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listingPrice: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    listingPeriod: {
      fontSize: RFValue(13),
      fontWeight: "400",
      color: colors.slate[500],
    },
    availablePill: {
      backgroundColor: colors.success[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
    },
    availablePillText: {
      fontSize: RFValue(11),
      fontWeight: "600",
      color: colors.success[300],
    },
    // Give Review Modal
    giveReviewOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    giveReviewSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    giveReviewTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(8),
    },
    giveReviewSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(24),
    },
    ratingStarsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: RFValue(8),
      marginBottom: RFValue(24),
    },
    commentSection: {
      marginBottom: RFValue(24),
    },
    commentLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    button: {
      position: "fixed",
      bottom: RFValue(12),
    },
    commentInput: {
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
      minHeight: RFValue(120),
    },
  });
