import AppButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { useTheme } from "@/contexts/themeContext";
import { useDeleteProperty, useListMyDrafts } from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import { PropertyListItem } from "@/types";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SpacesDrafts = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const { setEditingDraft } = useSpaceStore();
  const { deletePropertyMutation, deletePropertyPending } = useDeleteProperty();
  const {
    properties,
    isPropertiesLoading,
    isPropertiesFetching,
    isPropertiesFetchingNextPage,
    hasMoreProperties,
    propertiesError,
    fetchMoreProperties,
    refetchProperties,
  } = useListMyDrafts({
    params: {
      status: "draft",
      sort_by: "date_created",
      sort_order: "desc",
    },
    enabled: true,
  });
  const [selectedSpace, setSelectedSpace] =
    React.useState<PropertyCardItem | null>(null);
  const [isRemoveDialogVisible, setRemoveDialogVisible] = React.useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = React.useState(false);

  const handleViewDraft = (space: PropertyCardItem) => {
    setSelectedSpace(space);
    setActionSheetVisible(true);
  };

  const handleEditSpace = () => {
    if (!selectedSpace?.id || !selectedSpace.raw) return;
    setActionSheetVisible(false);
    setEditingDraft(selectedSpace.raw);
    router.push({
      pathname: "/views/spaces/add-space/form",
      params: { property_id: selectedSpace.id, source: "draft" },
    });
  };

  const handleRemoveSpace = () => {
    setActionSheetVisible(false);
    setRemoveDialogVisible(true);
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

  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) =>
    value.replace(/^per_/, "").replace(/_/g, " ");

  const cardData = useMemo<PropertyCardItem[]>(
    () =>
      properties.map((item: PropertyListItem) => ({
        id: item.public_id,
        imageSource: item.media?.[0]?.file_url
          ? item.media[0].file_url
          : require("@/assets/images/featuredSpaceImage1.png"),
        title: item.title || "Untitled draft",
        location:
          [
            item.address?.street,
            item.address?.city,
            item.address?.state,
            item.address?.country,
          ]
            .filter(Boolean)
            .join(", ") || "Unknown location",
        badgeType: "inDrafts",
        price: formatCurrency(item.price),
        duration: formatCostFrequency(item.cost_frequency),
        raw: item,
      })),
    [properties],
  );

  const handleRefresh = () => {
    refetchProperties();
  };

  const handleLoadMore = () => {
    if (!hasMoreProperties || isPropertiesFetchingNextPage) return;
    fetchMoreProperties();
  };

  if (isPropertiesLoading) {
    return (
      <View style={homeStyles.centerState}>
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={homeStyles.centerStateText}>Loading Spaces...</Text>
      </View>
    );
  }

  if (propertiesError) {
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
          <Text style={homeStyles.centerStateText}>No Draft Spaces Yet</Text>
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
            <HouseCard {...item} onPress={() => handleViewDraft(item)} />
          ) : (
            <HouseCardTile
              imageSource={item.imageSource}
              name={item.title}
              location={item.location}
              badgeType={item.badgeType}
              onPress={() => handleViewDraft(item)}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        key={`drafts-${layout}-${cardData.length}`}
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
      <Modal
        transparent
        animationType="slide"
        visible={isActionSheetVisible}
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <View style={homeStyles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setActionSheetVisible(false)}
          />
          <View style={homeStyles.actionSheet}>
            <View style={homeStyles.modalContainer}>
          <View style={homeStyles.modalImageWrap}>
            <Image
              source={getPropertyImageSource(selectedSpace?.imageSource)}
              style={homeStyles.modalImage}
            />
          </View>

          <View style={homeStyles.modalCopy}>
            <Text style={homeStyles.modalTitle}>
              {selectedSpace?.title || "Untitled draft"}
            </Text>
            <Text style={homeStyles.modalSubtitle}>
              {selectedSpace?.location || "Unknown location"}
            </Text>
          </View>

          <View style={homeStyles.actionsWrap}>
            <AppButton
              title="Edit Space"
              afterIcon={require("@/assets/icons/edit-pencil.png")}
              onPress={handleEditSpace}
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
          </View>
        </View>
      </Modal>
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

export default SpacesDrafts;

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
    title: {
      fontSize: RFValue(18),
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
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    actionSheet: {
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
