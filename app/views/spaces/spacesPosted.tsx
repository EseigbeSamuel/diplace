import { BottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import {
  useDeleteProperty,
  useGetCurrentUser,
  useListProperties,
  useUpdatePropertyStatus,
} from "@/hooks";
import { imageSourceFilter } from "@/lib/imageSourceFilter";
import { useSpaceStore } from "@/store/useSpace";
import { PropertyListItem } from "@/types";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const SpacesPosted = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const { setPreviewProperty, setEditingDraft } = useSpaceStore();

  const {
    currentUser,
    isCurrentUserLoading,
    currentUserError,
    refetchCurrentUser,
  } = useGetCurrentUser();
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
  const { updatePropertyStatusMutation, updatePropertyStatusPending } =
    useUpdatePropertyStatus();
  const [isViewSpaceSheetVisible, setIsViewSpaceSheetVisible] = useState(false);
  const [isUpdateStatusSheetVisible, setIsUpdateStatusSheetVisible] =
    useState(false);
  const [isRemoveDialogVisible, setRemoveDialogVisible] = useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [isStatusSheetVisible, setStatusSheetVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "pending" | "rented" | "sold" | "inactive" | "archived"
  >("active");
  const [selectedSpace, setSelectedSpace] = useState<PropertyCardItem | null>(
    null,
  );
  const snapPoints = useMemo(() => ["68%"], []);
  const statusSnapPoints = useMemo(() => ["56%"], []);
  const prettyStatus = (status?: string) =>
    (status || "active").charAt(0).toUpperCase() +
    (status || "active").slice(1);

  const mapPropertyStatusToSelector = (
    status?: string,
  ): "active" | "pending" | "rented" | "sold" | "inactive" | "archived" => {
    const raw = status?.toLowerCase?.() || "";
    if (raw === "pending") return "pending";
    if (raw === "rented") return "rented";
    if (raw === "sold") return "sold";
    if (raw === "inactive") return "inactive";
    if (raw === "archived") return "archived";
    return "active";
  };

  const handleViewSpace = (space: PropertyCardItem) => {
    setSelectedSpace(space);
    setIsViewSpaceSheetVisible(true);
  };
  const handleViewUpdateStatus = () => {
    setSelectedStatus(mapPropertyStatusToSelector(selectedSpace?.raw?.status));
    setIsViewSpaceSheetVisible(false);
    setIsUpdateStatusSheetVisible(true);
  };
  const handleEditSpace = () => {
    if (!selectedSpace?.id) return;
    setIsViewSpaceSheetVisible(false);
    setEditingDraft(null);
    router.push({
      pathname: "/views/spaces/add-space/form",
      params: { property_id: selectedSpace.id, source: "posted" },
    });
  };

  const handlePreviewSpace = () => {
    if (!selectedSpace?.raw) return;
    setIsViewSpaceSheetVisible(false);
    setPreviewProperty(selectedSpace.raw);
    router.push({
      pathname: "/views/spaces/preview-space/[id]",
      params: { id: selectedSpace.id },
    });
  };

  const handlePromoteSpace = () => {
    setIsViewSpaceSheetVisible(false);
  };

  const handleRemoveSpace = () => {
    setIsViewSpaceSheetVisible(false);
    setTimeout(() => {
      setRemoveDialogVisible(true);
    }, 300);
  };

  const handleRemoveCancel = () => {
    setRemoveDialogVisible(false);
  };
  const handleRemoveConfirm = async () => {
    if (!selectedSpace?.id || deletePropertyPending) return;
    try {
      await deletePropertyMutation({ propertyId: selectedSpace.id });
      await refetchProperties();
      setRemoveDialogVisible(false);
      setSelectedSpace(null);
    } catch {
      // Toast handled in mutation onError
    }
  };
  const handleUpdateStatusPress = async () => {
    if (!selectedSpace?.id || updatePropertyStatusPending) return;
    try {
      await updatePropertyStatusMutation({
        propertyId: selectedSpace.id,
        status: selectedStatus,
      });
      await refetchProperties();
      setIsUpdateStatusSheetVisible(false);
    } catch {
      // Toast handled in mutation onError
    }
  };
  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) =>
    value.replace(/^per_/, "").replace(/_/g, " ");

  const getBadgeType = (item: PropertyListItem): string | undefined => {
    const status = item.status?.toLowerCase?.();
    if (status) return status;
    if (item.is_verified) return "verified";
    return undefined;
  };

  const postedSpaces = useMemo(
    () =>
      properties.filter((item) => !["draft", "deleted"].includes(item.status)),
    [properties],
  );

  const cardData = useMemo<PropertyCardItem[]>(
    () =>
      postedSpaces.map((item) => ({
        id: item.public_id,
        imageSource: item.media?.[0]?.file_url
          ? item.media[0].file_url
          : require("@/assets/images/featuredSpaceImage1.png"),
        title: item.title || "Untitled space",
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
            <HouseCard {...item} onPress={() => handleViewSpace(item)} />
          ) : (
            <HouseCardTile
              imageSource={item.imageSource}
              name={item.title}
              location={item.location}
              price={item.price}
              badgeType={item.badgeType}
              duration={item.duration}
              onPress={() => handleViewSpace(item)}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        key={`posted-${layout}-${cardData.length}`}
        keyExtractor={(item) => item.id}
        extraData={cardData}
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
      <BottomSheet
        isVisible={isViewSpaceSheetVisible}
        onClose={() => setIsViewSpaceSheetVisible(false)}
        snapPoints={snapPoints}
      >
        <View style={homeStyles.modalContainer}>
          <View style={homeStyles.modalImageWrap}>
            <Image
              source={imageSourceFilter(selectedSpace?.imageSource)}
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
      </BottomSheet>
      <BottomSheet
        isVisible={isUpdateStatusSheetVisible}
        onClose={() => setIsUpdateStatusSheetVisible(false)}
        snapPoints={statusSnapPoints}
      >
        <View style={homeStyles.modalContainer}>
          <Text style={homeStyles.title}>Update current status</Text>

          <View style={homeStyles.modalImageWrap}>
            <Image
              source={getPropertyImageSource(selectedSpace?.imageSource)}
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
              {selectedSpace?.price || "NGN 0"}/
              {selectedSpace?.duration || "annum"}
            </Text>
          </View>

          <View style={homeStyles.statusSummary}>
            <Text style={homeStyles.statusSummaryLabel}>Current status:</Text>
            <Text style={homeStyles.statusSummaryValue}>
              {prettyStatus(selectedStatus)}
            </Text>
          </View>

          <View style={homeStyles.statusActionsWrap}>
            <SimpleSelector
              title="Active"
              isChecked={selectedStatus === "active"}
              onChange={() => setSelectedStatus("active")}
            />
            <SimpleSelector
              title="Pending"
              isChecked={selectedStatus === "pending"}
              onChange={() => setSelectedStatus("pending")}
            />
            <SimpleSelector
              title="Rented"
              isChecked={selectedStatus === "rented"}
              onChange={() => setSelectedStatus("rented")}
            />
            <SimpleSelector
              title="Sold"
              isChecked={selectedStatus === "sold"}
              onChange={() => setSelectedStatus("sold")}
            />
            {/* <SimpleSelector
                  title="Inactive"
                  isChecked={selectedStatus === "inactive"}
                  onChange={() => setSelectedStatus("inactive")}
                /> */}
            <SimpleSelector
              title="Archived"
              isChecked={selectedStatus === "archived"}
              onChange={() => setSelectedStatus("archived")}
            />
          </View>

          <View style={homeStyles.actionsWrap}>
            <AppButton
              onPress={handleUpdateStatusPress}
              title={updatePropertyStatusPending ? "Updating..." : "Update"}
              fullwidth
              disabled={updatePropertyStatusPending}
            />
          </View>
        </View>
      </BottomSheet>
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
  imageSource: ImageSourcePropType | string;
  title: string;
  location: string;
  badgeType?: string;
  price: string;
  duration: string;
  raw: PropertyListItem;
};

const getPropertyImageSource = (
  imageSource?: ImageSourcePropType | string,
): ImageSourcePropType => {
  const remoteImageUri =
    typeof imageSource === "string"
      ? imageSource
      : imageSource &&
          typeof imageSource === "object" &&
          "uri" in imageSource &&
          typeof imageSource.uri === "string"
        ? imageSource.uri
        : "";

  return remoteImageUri.length >= 7
    ? { uri: remoteImageUri }
    : require("@/assets/images/diplace.jpg");
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
      paddingBottom: RFValue(20),
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    actionSheet: {
      maxHeight: "88%",
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(18),
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
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
