import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppButton from "@/components/button";
import {
  useListAgentReviewsByAgent,
  useCreateAgentReview,
  useUpdateAgentReview,
  useDeleteAgentReview,
  useListProperties,
  useGetCurrentUser,
  useReportReasons,
  useReportAgent,
} from "@/hooks";
import { imageSourceFilter } from "@/lib/imageSourceFilter";
import { AgentReviewItem } from "@/types";

type TabType = "Listings" | "Reviews";

const ReviewsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { lister_id } = useLocalSearchParams<{ lister_id?: string; property_id?: string }>();
  const agentId = Array.isArray(lister_id) ? lister_id[0] : lister_id;
  const { currentUser } = useGetCurrentUser();

  const [selectedTab, setSelectedTab] = useState<TabType>("Reviews");

  // ── Options menu ──────────────────────────────────────────────────
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // ── Report lister ─────────────────────────────────────────────────
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState("");

  const { reasons: reportReasons, isReasonsLoading: isLoadingReasons } =
    useReportReasons({ enabled: showReportModal });
  const { reportAgentMutation, isReportAgentPending } = useReportAgent();

  const handleSubmitReport = async () => {
    if (!agentId || !selectedReasonId) return;
    try {
      await reportAgentMutation({
        userId: agentId,
        payload: { reason_id: selectedReasonId, details: reportDetails.trim() },
      });
      setShowReportModal(false);
      setSelectedReasonId(null);
      setReportDetails("");
    } catch { /* toast in hook */ }
  };

  // ── Reviews data ──────────────────────────────────────────────────
  const {
    agentReviews,
    agentReviewsTotal,
    isAgentReviewsLoading,
  } = useListAgentReviewsByAgent({ agentId, enabled: !!agentId });

  // ── Agent listings ────────────────────────────────────────────────
  const { properties: agentListings, isPropertiesLoading: isListingsLoading } =
    useListProperties({
      params: { lister_id: agentId, limit: 20, sort_order: "desc" } as any,
      enabled: !!agentId && selectedTab === "Listings",
    });

  // ── Give/Edit review ──────────────────────────────────────────────
  const [showGiveReviewModal, setShowGiveReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<AgentReviewItem | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { createAgentReviewMutation, isCreateAgentReviewPending } = useCreateAgentReview();
  const { updateAgentReviewMutation, isUpdateAgentReviewPending } = useUpdateAgentReview();
  const { deleteAgentReviewMutation, isDeleteAgentReviewPending } = useDeleteAgentReview();
  const isSubmittingReview = isCreateAgentReviewPending || isUpdateAgentReviewPending;

  const openGiveReview = () => {
    setEditingReview(null); setRating(0); setReviewComment("");
    setShowGiveReviewModal(true);
  };
  const openEditReview = (review: AgentReviewItem) => {
    setEditingReview(review); setRating(review.rating);
    setReviewComment(review.comment ?? "");
    setShowGiveReviewModal(true);
  };
  const handleSubmitReview = async () => {
    if (!agentId || rating === 0) return;
    try {
      if (editingReview) {
        await updateAgentReviewMutation({ reviewId: editingReview.public_id, payload: { rating, comment: reviewComment.trim() } });
      } else {
        await createAgentReviewMutation({ agentId, payload: { rating, comment: reviewComment.trim() } });
      }
      setShowGiveReviewModal(false); setEditingReview(null); setRating(0); setReviewComment("");
    } catch { /* toast in hook */ }
  };
  const handleDeleteReview = async (reviewId: string) => {
    try { await deleteAgentReviewMutation(reviewId); } catch { /* toast in hook */ }
  };

  // ── Computed ──────────────────────────────────────────────────────
  const avgRating = useMemo(() => {
    if (!agentReviews.length) return 0;
    return Math.round((agentReviews.reduce((a, r) => a + r.rating, 0) / agentReviews.length) * 10) / 10;
  }, [agentReviews]);

  const ratingCounts = useMemo(() => {
    const c: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    agentReviews.forEach((r) => { const k = Math.round(r.rating); if (k >= 1 && k <= 5) c[k]++; });
    return c;
  }, [agentReviews]);
  const maxRatingCount = useMemo(() => Math.max(...Object.values(ratingCounts), 1), [ratingCounts]);

  const agentName = useMemo(() => {
    const a = agentReviews[0]?.agent;
    if (!a) return "Agent";
    if (a.business_name) return a.business_name;
    const u = a.user;
    return u ? [u.first_name, u.last_name].filter(Boolean).join(" ") : "Agent";
  }, [agentReviews]);

  const agentPhone = (agentReviews[0]?.agent?.user as any)?.phone_number ?? "";

  const myReview = useMemo(
    () => currentUser ? agentReviews.find((r) => r.reviewer?.user_id === currentUser.public_id) ?? null : null,
    [agentReviews, currentUser],
  );

  const postedAtLabel = (dateStr: string) => {
    const days = Math.floor(Math.max(0, Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days < 1) return "Today";
    if (days < 30) return `${days}d ago`;
    const m = Math.floor(days / 30);
    return m < 12 ? `${m}mo ago` : `${Math.floor(m / 12)}y ago`;
  };

  const renderStars = (count: number, size = 14) => (
    <View style={styles.starsContainer} className="flex-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: size }}>{s <= count ? "⭐" : "☆"}</Text>
      ))}
    </View>
  );

  const renderInteractiveStars = (current: number) => (
    <View style={styles.ratingStarsContainer} className="flex-row justify-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => setRating(s)}>
          <Text style={{ fontSize: RFValue(32) }}>{s <= current ? "⭐" : "☆"}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <View style={styles.header} className="flex-row items-center justify-between">
        <View style={styles.headerLeft} className="flex-row items-center flex-1">
          <Pressable onPress={() => router.back()}>
            <Image source={require("@/assets/icons/arrow-left-light.png")} style={styles.backIcon} />
          </Pressable>
          <View  className="flex-1 items-start">
            <Text style={styles.headerTitle} className="font-semibold">{isAgentReviewsLoading ? "Loading..." : agentName}</Text>
            <View style={styles.headerRating} className="flex-row items-center">
              <Text style={styles.headerRatingText} className="font-medium">⭐ {avgRating || "–"}</Text>
              <Text style={styles.headerReviewCount}>({agentReviewsTotal} {agentReviewsTotal === 1 ? "review" : "reviews"})</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowOptionsMenu(true)}>
          <Image source={require("@/assets/icons/more-2-line.png")} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer} className="flex-row">
        {(["Listings", "Reviews"] as TabType[]).map((tab) => (
          <Pressable key={tab} style={[styles.tab, selectedTab === tab && styles.tabActive]} onPress={() => setSelectedTab(tab)} className="flex-1 items-center border-bottom-[2px] border-bottom-color-[transparent]">
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]} className="font-medium">{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── REVIEWS TAB ── */}
        {selectedTab === "Reviews" && (
          <View style={styles.reviewsContainer}>
            {/* Ratings Summary */}
            <View style={styles.ratingsSection}>
              <Text style={styles.ratingsTitle} className="font-semibold">Ratings</Text>
              <Text style={styles.ratingsSubtitle}>Verified ratings from people who have transacted with this agent.</Text>
              <View style={styles.ratingsSummary} className="flex-row">
                <View style={styles.ratingScore} className="items-center">
                  <Text style={styles.ratingScoreNumber} className="font-bold">{avgRating || "–"}</Text>
                  {renderStars(Math.round(avgRating), 16)}
                </View>
                <View style={styles.ratingBars} className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBarRow} className="flex-row items-center">
                      <Text style={styles.ratingBarLabel}>{star}</Text>
                      <Image source={require("@/assets/icons/star.png")} style={styles.ratingBarStar}  className="tint-[#FFA500]"/>
                      <View style={styles.ratingBarContainer} className="flex-1 overflow-hidden">
                        <View style={[styles.ratingBarFill, { width: `${agentReviewsTotal > 0 ? Math.round(((ratingCounts[star] ?? 0) / maxRatingCount) * 100) : 0}%` }]}  className="h-[100%px]"/>
                      </View>
                      <Text style={styles.ratingBarCount} className="text-right">{ratingCounts[star] ?? 0}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Reviews List */}
            <View style={styles.reviewsListSection}>
              <View  className="flex-row justify-between items-center">
                <Text style={styles.reviewsListTitle} className="font-semibold">Reviews ({agentReviewsTotal})</Text>
                {isAgentReviewsLoading && <ActivityIndicator size="small" color={colors.slate[500]} />}
              </View>
              {isAgentReviewsLoading ? (
                <View style={styles.loadingContainer} className="items-center"><ActivityIndicator size="large" color={colors.slate[500]} /></View>
              ) : agentReviews.length === 0 ? (
                <View style={styles.emptyContainer} className="items-center"><Text style={styles.emptyText}>No reviews yet. Be the first!</Text></View>
              ) : (
                <View style={styles.reviewsList}>
                  {agentReviews.map((review) => {
                    const u = review.reviewer?.user;
                    const reviewerName = u ? [u.first_name, u.last_name].filter(Boolean).join(" ") : "User";
                    const isMyReview = review.reviewer?.user_id === currentUser?.public_id;
                    const avatarUri = (u as any)?.profile_picture ?? undefined;
                    return (
                      <View key={review.public_id} style={styles.reviewCard} className="border-b">
                        <View style={styles.reviewHeader} className="flex-row items-start">
                          <View style={styles.reviewerAvatarWrapper} className="overflow-hidden">
                            <Image source={imageSourceFilter(avatarUri)}  resizeMode="cover"  className="w-[100%px] h-[100%px]"/>
                          </View>
                          <View style={styles.reviewerInfo} className="flex-1">
                            <Text style={styles.reviewerName} className="font-semibold">{reviewerName}</Text>
                            {renderStars(review.rating, 12)}
                            <Text style={styles.reviewDate}>{postedAtLabel(review.date_created)}</Text>
                          </View>
                          {isMyReview && (
                            <View style={styles.myReviewActions} className="flex-row">
                              <TouchableOpacity onPress={() => openEditReview(review)} style={styles.reviewActionBtn}>
                                <Text style={styles.reviewActionEdit} className="font-semibold">Edit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => handleDeleteReview(review.public_id)} disabled={isDeleteAgentReviewPending} style={styles.reviewActionBtn}>
                                <Text style={styles.reviewActionDelete} className="font-semibold">Delete</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── LISTINGS TAB ── */}
        {selectedTab === "Listings" && (
          <View style={styles.listingsContainer}>
            <Text style={styles.listingsTitle} className="font-semibold">{agentName}'s Listings</Text>
            {isListingsLoading ? (
              <View style={styles.loadingContainer} className="items-center"><ActivityIndicator size="large" color={colors.slate[500]} /></View>
            ) : agentListings.length === 0 ? (
              <View style={styles.emptyContainer} className="items-center"><Text style={styles.emptyText}>No listings found.</Text></View>
            ) : (
              <View style={styles.listingsList}>
                {agentListings.map((listing) => {
                  const imgUri = listing.media?.[0]?.file_url ?? undefined;
                  const addr = [listing.address?.street, listing.address?.city, listing.address?.state].filter(Boolean).join(", ");
                  const price = `₦${new Intl.NumberFormat("en-NG").format(listing.price || 0)}`;
                  const period = listing.cost_frequency.replace(/^per_/, "").replace(/_/g, " ");
                  return (
                    <Pressable key={listing.public_id} style={styles.listingCard} onPress={() => router.push({ pathname: "/views/place-details/[id]", params: { id: listing.public_id } })} className="border-[1px] overflow-hidden">
                      <Image source={imageSourceFilter(imgUri)} style={styles.listingImage} resizeMode="cover"  className="w-[100%px]"/>
                      <View style={styles.listingInfo}>
                        <Text style={styles.listingTitle} numberOfLines={1} className="font-semibold">{listing.title}</Text>
                        <View style={styles.listingLocationRow} className="flex-row items-center">
                          <Image source={require("@/assets/icons/location-1.png")} style={styles.listingLocationIcon} />
                          <Text style={styles.listingLocation} numberOfLines={1} className="flex-1">{addr || "Unknown location"}</Text>
                        </View>
                        <View  className="flex-row justify-between items-center">
                          <Text style={styles.listingPrice} className="font-bold">{price}<Text style={styles.listingPeriod} className="font-normal">/{period}</Text></Text>
                          <View style={styles.availablePill}>
                            <Text style={styles.availablePillText} className="font-semibold">{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Give Review Button */}
      <View style={styles.button}>
        <AppButton
          title={myReview ? "Edit My Review" : "Give Review"}
          variant="primary"
          onPress={myReview ? () => openEditReview(myReview) : openGiveReview}
        />
      </View>

      {/* ── Options Menu ── */}
      <Modal visible={showOptionsMenu} transparent animationType="fade" onRequestClose={() => setShowOptionsMenu(false)}>
        <Pressable style={styles.optionsOverlay} onPress={() => setShowOptionsMenu(false)} className="flex-1 bg-[rgba(0,0,0,0.4)] justify-start items-end">
          <Pressable style={styles.optionsContainer} onPress={(e) => e.stopPropagation()} className="overflow-hidden shadow-color-[#000] shadow-opacity-[0.15px] shadow-radius-[8px] elevation-[8px]">
            <TouchableOpacity style={styles.optionsItem} onPress={() => { setShowOptionsMenu(false); if (agentPhone) Linking.openURL(`tel:${agentPhone}`); }} className="flex-row items-center">
              <Image source={require("@/assets/icons/calling.png")} style={[styles.optionsIcon, { tintColor: colors.slate[650] }]} />
              <Text style={styles.optionsText} className="font-medium">Call who listed</Text>
            </TouchableOpacity>
            <View style={styles.optionsDivider}  className="h-[1px]"/>
            <TouchableOpacity style={styles.optionsItem} onPress={() => { setShowOptionsMenu(false); setShowReportModal(true); }} className="flex-row items-center">
              <Image source={require("@/assets/icons/flag-red.png")} style={styles.optionsIcon} />
              <Text style={[styles.optionsText, { color: colors.error[200] }]} className="font-medium">Report this lister</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Report Lister Modal ── */}
      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <Pressable  onPress={() => setShowReportModal(false)} className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
          <Pressable style={styles.reportSheet} onPress={(e) => e.stopPropagation()} className="max-h-[80%px]">
            <View style={styles.modalHandle}  className="self-center"/>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.reportBody}>
                <Text style={styles.reportTitle} className="font-bold">Report this lister</Text>
                <Text style={styles.reportSubtitle}>Select a reason that best describes the issue.</Text>
                {isLoadingReasons ? (
                  <ActivityIndicator size="small" color={colors.slate[500]} style={{ marginVertical: RFValue(16) }} />
                ) : (
                  <View style={styles.reportReasonsList}>
                    {reportReasons.filter((r) => r.applies_to_agent).map((reason) => {
                      const isSelected = selectedReasonId === reason.public_id;
                      return (
                        <TouchableOpacity key={reason.public_id} style={[styles.reportReasonRow, isSelected && styles.reportReasonRowSelected]} onPress={() => setSelectedReasonId(reason.public_id)} className="flex-row items-center border-[1px]">
                          <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]} className="border-[2px] items-center justify-center">
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <Text style={styles.reportReasonText} className="flex-1">{reason.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <Text style={styles.commentLabel} className="font-medium">Additional details (optional)</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Describe the issue..."
                  placeholderTextColor={colors.slate[450]}
                  multiline numberOfLines={4} textAlignVertical="top"
                  value={reportDetails} onChangeText={setReportDetails}
                 className="border-[1px]"/>
                <View style={{ marginTop: RFValue(16) }}>
                  <AppButton title={isReportAgentPending ? "Submitting..." : "Submit"} disabled={isReportAgentPending || !selectedReasonId} fullwidth onPress={handleSubmitReport} />
                </View>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Give/Edit Review Modal ── */}
      <Modal visible={showGiveReviewModal} transparent animationType="slide" onRequestClose={() => setShowGiveReviewModal(false)}>
        <Pressable  onPress={() => setShowGiveReviewModal(false)} className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable style={styles.giveReviewSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle}  className="self-center"/>
            <Text style={styles.giveReviewTitle} className="font-bold text-center">{editingReview ? "Edit Review" : "Give Review"}</Text>
            <Text style={styles.giveReviewSubtitle} className="text-center">Please provide feedback about your experience with this agent.</Text>
            {renderInteractiveStars(rating)}
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel} className="font-medium">Add Comment</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Give your feedback..."
                placeholderTextColor={colors.slate[450]}
                multiline numberOfLines={6} textAlignVertical="top"
                value={reviewComment} onChangeText={setReviewComment}
               className="border-[1px]"/>
            </View>
            <AppButton
              title={isSubmittingReview ? "Submitting..." : editingReview ? "Update Review" : "Submit"}
              disabled={isSubmittingReview || rating === 0}
              onPress={handleSubmitReview}
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
    header: {paddingVertical: RFValue(16)},
    headerLeft: {gap: RFValue(12)},
    backIcon: { width: RFValue(20), height: RFValue(20), tintColor: colors.slate[650] },
    headerCenter: {},
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    headerRating: {gap: RFValue(4),
marginTop: RFValue(2)},
    headerRatingText: {fontSize: RFValue(13),
color: colors.slate[650]},
    headerReviewCount: { fontSize: RFValue(13), color: colors.info[200] },
    headerIcon: { width: RFValue(20), height: RFValue(20), tintColor: colors.slate[650] },
    tabsContainer: {paddingVertical: RFValue(12),
gap: RFValue(8),
width: RFValue(150)},
    tab: {paddingVertical: RFValue(8)},
    tabActive: { borderBottomColor: colors.slate[650] },
    tabText: {fontSize: RFValue(15),
color: colors.slate[500]},
    tabTextActive: {color: colors.slate[650]},
    scrollContent: { paddingVertical: RFValue(20), paddingBottom: RFValue(80) },
    reviewsContainer: { gap: RFValue(24) },
    ratingsSection: { gap: RFValue(12) },
    ratingsTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    ratingsSubtitle: { fontSize: RFValue(13), color: colors.slate[500], lineHeight: RFValue(18) },
    ratingsSummary: {gap: RFValue(20),
marginTop: RFValue(12)},
    ratingScore: {gap: RFValue(8)},
    ratingScoreNumber: {fontSize: RFValue(36),
color: colors.slate[650]},
    starsContainer: {gap: RFValue(2)},
    ratingBars: {gap: RFValue(6)},
    ratingBarRow: {gap: RFValue(6)},
    ratingBarLabel: { fontSize: RFValue(13), color: colors.slate[600], width: RFValue(8) },
    ratingBarStar: {width: RFValue(12),
height: RFValue(12)},
    ratingBarContainer: {height: RFValue(6),
backgroundColor: colors.slate[250],
borderRadius: RFValue(3)},
    ratingBarFill: {backgroundColor: colors.slate[650]},
    ratingBarCount: {fontSize: RFValue(11),
color: colors.slate[500],
width: RFValue(16)},
    reviewsListSection: { gap: RFValue(16) },
    reviewsListHeader: {},
    reviewsListTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    reviewsList: { gap: RFValue(20) },
    reviewCard: {gap: RFValue(10),
paddingBottom: RFValue(16),
borderBottomColor: colors.slate[250]},
    reviewHeader: {gap: RFValue(12)},
    reviewerAvatarWrapper: {width: RFValue(40),
height: RFValue(40),
borderRadius: RFValue(20),
backgroundColor: colors.slate[300]},
    reviewerAvatarImage: {},
    reviewerInfo: {gap: RFValue(3)},
    reviewerName: {fontSize: RFValue(15),
color: colors.slate[650]},
    reviewDate: { fontSize: RFValue(12), color: colors.slate[500] },
    reviewComment: { fontSize: RFValue(14), color: colors.slate[600], lineHeight: RFValue(20) },
    myReviewActions: {gap: RFValue(8)},
    reviewActionBtn: { paddingHorizontal: RFValue(8), paddingVertical: RFValue(4) },
    reviewActionEdit: {fontSize: RFValue(12),
color: colors.info[200]},
    reviewActionDelete: {fontSize: RFValue(12),
color: colors.error[200]},
    loadingContainer: {paddingVertical: RFValue(32)},
    emptyContainer: {paddingVertical: RFValue(32)},
    emptyText: { fontSize: RFValue(14), color: colors.slate[500] },
    listingsContainer: { gap: RFValue(16) },
    listingsTitle: {fontSize: RFValue(18),
color: colors.slate[650]},
    listingsList: { gap: RFValue(16) },
    listingCard: {borderRadius: RFValue(12),
borderColor: colors.slate[300]},
    listingImage: {height: RFValue(180)},
    listingInfo: { padding: RFValue(12), gap: RFValue(6) },
    listingTitle: {fontSize: RFValue(15),
color: colors.slate[650]},
    listingLocationRow: {gap: RFValue(4)},
    listingLocationIcon: { width: RFValue(14), height: RFValue(14), tintColor: colors.slate[500] },
    listingLocation: {fontSize: RFValue(13),
color: colors.slate[500]},
    listingFooter: {},
    listingPrice: {fontSize: RFValue(16),
color: colors.slate[650]},
    listingPeriod: {fontSize: RFValue(13),
color: colors.slate[500]},
    availablePill: { backgroundColor: colors.success[100], paddingHorizontal: RFValue(8), paddingVertical: RFValue(4), borderRadius: RFValue(6) },
    availablePillText: {fontSize: RFValue(11),
color: colors.success[300]},
    button: { paddingVertical: RFValue(12) },
    // Options menu
    optionsOverlay: {paddingTop: RFValue(60),
paddingRight: RFValue(16)},
    optionsContainer: {backgroundColor: colors.background,
borderRadius: RFValue(12),
minWidth: RFValue(200),
shadowOffset: { width: 0, height: 4 }},
    optionsItem: {gap: RFValue(12),
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(14)},
    optionsIcon: { width: RFValue(18), height: RFValue(18) },
    optionsText: {fontSize: RFValue(14),
color: colors.slate[650]},
    optionsDivider: {backgroundColor: colors.slate[250],
marginHorizontal: RFValue(12)},
    // Report modal
    reportOverlay: {},
    reportSheet: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24)},
    reportBody: { paddingHorizontal: RFValue(20), paddingBottom: RFValue(32) },
    reportTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(8)},
    reportSubtitle: { fontSize: RFValue(13), color: colors.slate[500], lineHeight: RFValue(18), marginBottom: RFValue(20) },
    reportReasonsList: { gap: RFValue(10), marginBottom: RFValue(20) },
    reportReasonRow: {gap: RFValue(12),
paddingVertical: RFValue(12),
paddingHorizontal: RFValue(14),
borderRadius: RFValue(10),
borderColor: colors.slate[300],
backgroundColor: colors.slate[100]},
    reportReasonRowSelected: { borderColor: colors.slate[650], backgroundColor: colors.slate[150] },
    radioCircle: {width: RFValue(18),
height: RFValue(18),
borderRadius: RFValue(9),
borderColor: colors.slate[400]},
    radioCircleSelected: { borderColor: colors.slate[650] },
    radioInner: { width: RFValue(8), height: RFValue(8), borderRadius: RFValue(4), backgroundColor: colors.slate[650] },
    reportReasonText: {fontSize: RFValue(14),
color: colors.slate[650]},
    // Give review modal
    giveReviewOverlay: {},
    giveReviewSheet: { backgroundColor: colors.background, borderTopLeftRadius: RFValue(24), borderTopRightRadius: RFValue(24), paddingHorizontal: RFValue(20), paddingBottom: RFValue(32) },
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginVertical: RFValue(12)},
    giveReviewTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(8)},
    giveReviewSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
lineHeight: RFValue(18),
marginBottom: RFValue(24)},
    ratingStarsContainer: {gap: RFValue(8),
marginBottom: RFValue(24)},
    commentSection: { marginBottom: RFValue(24) },
    commentLabel: {fontSize: RFValue(14),
color: colors.slate[650],
marginBottom: RFValue(8)},
    commentInput: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
padding: RFValue(16),
borderColor: colors.slate[300],
fontSize: RFValue(15),
color: colors.slate[650],
minHeight: RFValue(120)},
  });
