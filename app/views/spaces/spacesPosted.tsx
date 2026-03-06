import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { useDeleteProperty, useGetCurrentUser, useListProperties } from "@/hooks";
import { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { PropertyListItem } from "@/types";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const SpacesPosted = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const { setPreviewProperty } = useSpaceStore();
  const { currentUser, isCurrentUserLoading, currentUserError, refetchCurrentUser } =
    useGetCurrentUser();
  const {
    properties,
    isPropertiesLoading,
    isPropertiesFetching,
    isPropertiesFetchingNextPage,
    hasMoreProperties,
    propertiesError,
    fetchMoreProperties,
    refetchProperties,
  } = useListProperties({
    params: {
      lister_id: currentUser?.public_id,
      sort_by: "date_created",
      sort_order: "desc",
    },
    enabled: !!currentUser && !currentUserError,
  });
  const { deletePropertyMutation, deletePropertyPending } = useDeleteProperty();
  const viewSpaceref = useRef<BottomSheetModal>(null);
  const viewUpdateStatus = useRef<BottomSheetModal>(null);
  const [isRemoveDialogVisible, setRemoveDialogVisible] = useState(false);
  const [isStatusDialogVisible, setStatusDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "available" | "reserved" | "rented"
  >("available");
  const [openStatusAfterPrimaryDismiss, setOpenStatusAfterPrimaryDismiss] =
    useState(false);
  const [selectedSpace, setSelectedSpace] = useState<PropertyCardItem | null>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const handleViewSpace = (space: PropertyCardItem) => {
    setSelectedSpace(space);
    viewSpaceref.current?.present();
  };
  const handleViewUpdateStatus = () => {
    setOpenStatusAfterPrimaryDismiss(true);
    viewSpaceref.current?.dismiss();
  };
  const handlePrimarySheetDismiss = () => {
    if (!openStatusAfterPrimaryDismiss) return;
    setOpenStatusAfterPrimaryDismiss(false);
    viewUpdateStatus.current?.present();
  };
  const handleEditSpace = () => {
    viewSpaceref.current?.dismiss();
    router.push("/views/spaces/edit-space");
  };

  const handlePreviewSpace = () => {
    if (!selectedSpace?.raw) return;
    viewSpaceref.current?.dismiss();
    setPreviewProperty(selectedSpace.raw);
    router.push({
      pathname: "/views/spaces/preview-space/[id]",
      params: { id: selectedSpace.id },
    });
  };

  const handlePromoteSpace = () => {
    viewSpaceref.current?.dismiss();
  };

  const handleRemoveSpace = () => {
    viewSpaceref.current?.dismiss();
    setRemoveDialogVisible(true);
  };

  const handleStatusConfirm = () => {
    viewUpdateStatus.current?.dismiss();
    setStatusDialogVisible(false);
  };

  const handleStatusCancel = () => {
    viewUpdateStatus.current?.dismiss();
    setStatusDialogVisible(false);
  };
  const handleRemoveCancel = () => {
    setRemoveDialogVisible(false);
  };
  const handleRemoveConfirm = async () => {
    if (!selectedSpace?.id || deletePropertyPending) return;
    try {
      await deletePropertyMutation({ propertyId: selectedSpace.id });
      setRemoveDialogVisible(false);
      setSelectedSpace(null);
    } catch {
      // Toast handled in mutation onError
    }
  };
  const handleUpdateStatusPress = () => {
    viewUpdateStatus.current?.dismiss();
    setStatusDialogVisible(true);
  };
  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) => value.replace(/^per_/, "").replace(/_/g, " ");

  const getBadgeType = (item: PropertyListItem): string | undefined => {
    if (item.status === "available") return "available";
    if (item.status === "booked") return "reserved";
    if (item.status === "completed") return "rented";
    if (item.is_verified) return "verified";
    return undefined;
  };

  const postedSpaces = useMemo(
    () => properties.filter((item) => !["pending", "deleted", "rejected"].includes(item.status)),
    [properties],
  );

  const cardData = useMemo<PropertyCardItem[]>(
    () =>
      postedSpaces.map((item) => ({
        id: item.public_id,
        imageSource: item.media?.[0]?.file_url
          ? { uri: item.media[0].file_url }
          : require("@/assets/images/featuredSpaceImage1.png"),
        title: item.title,
        location:
          [
            item.address?.street,
            item.address?.city,
            item.address?.state,
            item.address?.country,
          ]
            .filter(Boolean)
            .join(", ") || "Unknown location",
        badgeType: getBadgeType(item),
        price: formatCurrency(item.price),
        duration: formatCostFrequency(item.cost_frequency),
        raw: item,
      })),
    [postedSpaces],
  );

  const handleRefresh = () => {
    refetchCurrentUser();
    refetchProperties();
  };

  const handleLoadMore = () => {
    if (!hasMoreProperties || isPropertiesFetchingNextPage) return;
    fetchMoreProperties();
  };

  if (isCurrentUserLoading || isPropertiesLoading) {
    return (
      <View style={homeStyles.centerState}>
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={homeStyles.centerStateText}>Loading Spaces...</Text>
      </View>
    );
  }

  if (currentUserError || propertiesError) {
    return (
      <View style={homeStyles.centerState}>
        <Text style={homeStyles.centerStateText}>Unable to load spaces.</Text>
        <View style={homeStyles.retryWrap}>
          <AppButton title="Retry" onPress={handleRefresh} />
        </View>
      </View>
    );
  }

  if (!cardData.length) {
    return (
      <View className="flex-1">
        <View className="py-2">
          <Filter size="large" />
        </View>
        <View style={homeStyles.centerState}>
          <Text style={homeStyles.centerStateText}>No Posted Spaces Yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="py-2">
        <Filter size="large" />
      </View>
      <FlatList
        data={cardData}
        renderItem={({ item }) =>
          layout === "box" ? (
            <>
              <HouseCard {...item} onPress={() => handleViewSpace(item)} />
            </>
          ) : (
            <>
              <HouseCardTile
                imageSource={item.imageSource}
                name={item.title}
                location={item.location}
                price={item.price}
                badgeType={item.badgeType}
                duration={item.duration}
                onPress={() => handleViewSpace(item)}
              />
            </>
          )
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshing={isPropertiesFetching && !isPropertiesFetchingNextPage}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isPropertiesFetchingNextPage ? (
            <View style={homeStyles.footerLoader}>
              <ActivityIndicator size="small" color={colors.slate[650]} />
            </View>
          ) : null
        }
      />
      <CustomBottomSheet
        bottomSheetProps={{
          ref: viewSpaceref,
          snapPoints,
          index: 2,
          onDismiss: handlePrimarySheetDismiss,
        }}
      >
        <View style={homeStyles.modalContainer}>
          <View style={homeStyles.modalImageWrap}>
            <Image
              source={
                selectedSpace?.imageSource ||
                require("@/assets/images/featuredSpaceImage1.png")
              }
              style={homeStyles.modalImage}
            />
          </View>

          <View style={homeStyles.modalCopy}>
            <Text style={homeStyles.modalTitle}>
              {selectedSpace?.title || "Untitled space"}
            </Text>
            <Text style={homeStyles.modalSubtitle}>
              {selectedSpace?.location || "Unknown location"}
            </Text>
          </View>

          <View style={homeStyles.actionsWrap}>
            <AppButton
              title="Update Status"
              onPress={handleViewUpdateStatus}
              afterIcon={require("@/assets/icons/tag.png")}
              fullwidth
            />
            <AppButton
              title="Edit Space"
              afterIcon={require("@/assets/icons/edit-pencil.png")}
              variant="tertiary"
              onPress={handleEditSpace}
              fullwidth
            />
            <AppButton
              title="Preview space"
              afterIcon={require("@/assets/icons/show.png")}
              variant="tertiary"
              onPress={handlePreviewSpace}
              fullwidth
            />
            <AppButton
              title="Promote space"
              afterIcon={require("@/assets/icons/show.png")}
              variant="tertiary"
              onPress={handlePromoteSpace}
              fullwidth
            />
            <AppButton
              title="Remove Space"
              onPress={handleRemoveSpace}
              variant="tertiary"
              afterIcon={require("@/assets/icons/delete.png")}
              fullwidth
            />
          </View>
        </View>
      </CustomBottomSheet>
      <CustomBottomSheet
        bottomSheetProps={{
          ref: viewUpdateStatus,
          snapPoints,
          index: 2,
        }}
      >
        <View style={homeStyles.modalContainer}>
          <Text style={homeStyles.title}>Update current status</Text>

          <View style={homeStyles.modalImageWrap}>
            <Image
              source={
                selectedSpace?.imageSource ||
                require("@/assets/images/featuredSpaceImage1.png")
              }
              style={homeStyles.modalImage}
            />
          </View>

          <View style={homeStyles.modalCopy}>
            <Text style={homeStyles.modalTitle}>
              {selectedSpace?.title || "Untitled space"}
            </Text>
            <Text style={homeStyles.modalSubtitle}>
              {selectedSpace?.location || "Unknown location"}
            </Text>
            <Text style={homeStyles.subTitle}>
              {selectedSpace?.price || "NGN 0"}/{selectedSpace?.duration || "annum"}
            </Text>
          </View>

          <View style={homeStyles.statusSummary}>
            <Text style={homeStyles.statusSummaryLabel}>Current status:</Text>
            <Text style={homeStyles.statusSummaryValue}>
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </Text>
          </View>

          <View style={homeStyles.statusActionsWrap}>
            <SimpleSelector
              title="Available"
              isChecked={selectedStatus === "available"}
              onChange={() => setSelectedStatus("available")}
            />
            <SimpleSelector
              title="Reserved"
              isChecked={selectedStatus === "reserved"}
              onChange={() => setSelectedStatus("reserved")}
            />
            <SimpleSelector
              title="Rented"
              isChecked={selectedStatus === "rented"}
              onChange={() => setSelectedStatus("rented")}
            />
          </View>

          <View style={homeStyles.actionsWrap}>
            <AppButton onPress={handleUpdateStatusPress} title="Update" fullwidth />
          </View>
        </View>
      </CustomBottomSheet>
      <ConfirmDialog
        visible={isStatusDialogVisible}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
        title="Confirm Status Update"
        message="You are about to change the status of the property. Do you wish to proceed?"
      />
      <ConfirmDialog
        visible={isRemoveDialogVisible}
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
        title="Remove Space?"
        message="You are about to delete this space? Renters will not be able to see this space again when you remove it. Do you wish to proceed?"
        cancelText="Cancel"
        confirmText={deletePropertyPending ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        confirmDisabled={deletePropertyPending}
        cancelDisabled={deletePropertyPending}
      />
    </View>
  );
};

export default SpacesPosted;

type PropertyCardItem = {
  id: string;
  imageSource: { uri: string } | number;
  title: string;
  location: string;
  badgeType?: string;
  price: string;
  duration: string;
  raw: PropertyListItem;
};

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
    },
    textBlack1: {
      color: colors.slate[150],
    },
    bgInfo100: {
      backgroundColor: colors.info[100],
    },
    bgslate150: {
      backgroundColor: colors.slate[150],
    },

    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    modalContainer: {
      paddingTop: RFValue(10),
      paddingBottom: RFValue(16),
      alignItems: "center",
    },
    modalImageWrap: {
      width: RFValue(112),
      height: RFValue(112),
      borderRadius: RFValue(20),
      padding: RFValue(6),
      backgroundColor: colors.slate[150],
      marginBottom: RFValue(16),
    },
    modalImage: {
      width: "100%",
      height: "100%",
      borderRadius: RFValue(14),
    },
    modalCopy: {
      alignItems: "center",
      marginBottom: RFValue(20),
      gap: RFValue(4),
    },
    modalTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
      fontFamily: "InstrumentSansSemiBold",
      textAlign: "center",
    },
    modalSubtitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
      textAlign: "center",
    },
    actionsWrap: {
      width: "100%",
      gap: RFValue(10),
    },
    statusActionsWrap: {
      width: "100%",
      gap: RFValue(10),
      marginBottom: RFValue(12),
    },
    statusSummary: {
      width: "100%",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(10),
      marginBottom: RFValue(12),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statusSummaryLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    statusSummaryValue: {
      fontSize: RFValue(14),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
    },
    centerState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: RFValue(20),
      gap: RFValue(12),
    },
    centerStateText: {
      fontSize: RFValue(20),
      lineHeight: RFValue(26),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
      textAlign: "center",
    },
    footerLoader: {
      paddingVertical: RFValue(16),
    },
    retryWrap: {
      width: RFValue(140),
    },
  });

