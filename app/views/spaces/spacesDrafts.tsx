// import { CustomBottomSheet } from "@/components/bottom-sheet";
// import AppButton from "@/components/button";
// import ConfirmDialog from "@/components/confirm-dialog";
// import Filter from "@/components/filter";
// import HouseCard from "@/components/housecard";
// import HouseCardTile from "@/components/houseCardTile";
// import { useTheme } from "@/contexts/themeContext";
// import { useDeleteProperty, useGetCurrentUser, useListProperties } from "@/hooks";
// import { useSpaceStore } from "@/store/useSpace";
// import { PropertyListItem } from "@/types";
// import { ColorScheme } from "@/utils";
// import { BottomSheetModal } from "@gorhom/bottom-sheet";
// import { router } from "expo-router";
// import React, { useMemo, useRef } from "react";
// import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";

// const SpacesDrafts = ({ layout }: { layout: "tiles" | "box" }) => {
//   const { colors } = useTheme();
//   const homeStyles = styles(colors);
//   const { setEditingDraft } = useSpaceStore();
//   const { deletePropertyMutation, deletePropertyPending } = useDeleteProperty();
//   const { currentUser, isCurrentUserLoading, currentUserError, refetchCurrentUser } =
//     useGetCurrentUser();
//   const {
//     properties,
//     isPropertiesLoading,
//     isPropertiesFetching,
//     isPropertiesFetchingNextPage,
//     hasMoreProperties,
//     propertiesError,
//     fetchMoreProperties,
//     refetchProperties,
//   } = useListProperties({
//     params: {
//       lister_id: currentUser?.public_id,
//       status: "pending",
//       sort_by: "date_created",
//       sort_order: "desc",
//     },
//     enabled: !!currentUser && !currentUserError,
//   });
//   const addSpaceRef = useRef<BottomSheetModal>(null);
//   const [selectedSpace, setSelectedSpace] = React.useState<PropertyCardItem | null>(null);
//   const [isRemoveDialogVisible, setRemoveDialogVisible] = React.useState(false);
//   const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

//   const handleAddSpace = (space: PropertyCardItem) => {
//     setSelectedSpace(space);
//     addSpaceRef.current?.present();
//   };

//   const handleEditSpace = () => {
//     if (!selectedSpace?.id || !selectedSpace.raw) return;
//     addSpaceRef.current?.dismiss();
//     setEditingDraft(selectedSpace.raw);
//     router.push({
//       pathname: "/views/spaces/add-space/form",
//       params: { property_id: selectedSpace.id },
//     });
//   };

//   const handleRemoveSpace = () => {
//     addSpaceRef.current?.dismiss();
//     setRemoveDialogVisible(true);
//   };

//   const handleRemoveCancel = () => {
//     setRemoveDialogVisible(false);
//   };

//   const handleRemoveConfirm = () => {
//     if (!selectedSpace?.id || deletePropertyPending) return;
//     deletePropertyMutation({ propertyId: selectedSpace.id })
//       .then(() => {
//         setRemoveDialogVisible(false);
//         setSelectedSpace(null);
//       })
//       .catch(() => {
//         // Toast handled in mutation onError
//       });
//   };

//   const formatCurrency = (amount: number) =>
//     `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

//   const formatCostFrequency = (value: string) => value.replace(/^per_/, "").replace(/_/g, " ");

//   const cardData = useMemo<PropertyCardItem[]>(
//     () =>
//       properties.map((item: PropertyListItem) => ({
//         id: item.public_id,
//         imageSource: item.media?.[0]?.file_url
//           ? { uri: item.media[0].file_url }
//           : require("@/assets/images/featuredSpaceImage1.png"),
//         title: item.title,
//         location:
//           [
//             item.address?.street,
//             item.address?.city,
//             item.address?.state,
//             item.address?.country,
//           ]
//             .filter(Boolean)
//             .join(", ") || "Unknown location",
//         badgeType: "pending",
//         price: formatCurrency(item.price),
//         duration: formatCostFrequency(item.cost_frequency),
//         raw: item,
//       })),
//     [properties],
//   );

//   const handleRefresh = () => {
//     refetchCurrentUser();
//     refetchProperties();
//   };

//   const handleLoadMore = () => {
//     if (!hasMoreProperties || isPropertiesFetchingNextPage) return;
//     fetchMoreProperties();
//   };

//   if (isCurrentUserLoading || isPropertiesLoading) {
//     return (
//       <View style={homeStyles.centerState}>
//         <ActivityIndicator size="large" color={colors.slate[650]} />
//         <Text style={homeStyles.centerStateText}>Loading Spaces...</Text>
//       </View>
//     );
//   }

//   if (currentUserError || propertiesError) {
//     return (
//       <View style={homeStyles.centerState}>
//         <Text style={homeStyles.centerStateText}>Unable to load spaces.</Text>
//         <View style={homeStyles.retryWrap}>
//           <AppButton title="Retry" onPress={handleRefresh} />
//         </View>
//       </View>
//     );
//   }

//   if (!cardData.length) {
//     return (
//       <View className="flex-1">
//         <View className="py-2">
//           <Filter size="large" />
//         </View>
//         <View style={homeStyles.centerState}>
//           <Text style={homeStyles.centerStateText}>No Draft Spaces Yet</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1">
//       <View className="py-2">
//         <Filter size="large" />
//       </View>
//       <FlatList
//         data={cardData}
//         renderItem={({ item }) =>
//           layout === "box" ? (
//             <HouseCard {...item} onPress={() => handleAddSpace(item)} />
//           ) : (
//             <HouseCardTile
//               imageSource={item.imageSource}
//               name={item.title}
//               location={item.location}
//               badgeType={item.badgeType}
//               onPress={() => handleAddSpace(item)}
//             />
//           )
//         }
//         showsVerticalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ gap: 16 }}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.4}
//         refreshing={isPropertiesFetching && !isPropertiesFetchingNextPage}
//         onRefresh={handleRefresh}
//         ListFooterComponent={
//           isPropertiesFetchingNextPage ? (
//             <View style={homeStyles.footerLoader}>
//               <ActivityIndicator size="small" color={colors.slate[650]} />
//             </View>
//           ) : null
//         }
//       />
//       <CustomBottomSheet
//         bottomSheetProps={{
//           ref: addSpaceRef,
//           snapPoints,
//           index: 2,
//         }}
//       >
//         <View style={homeStyles.modalContainer}>
//           <View style={homeStyles.modalImageWrap}>
//             <Image
//               source={
//                 selectedSpace?.imageSource ||
//                 require("@/assets/images/featuredSpaceImage1.png")
//               }
//               style={homeStyles.modalImage}
//             />
//           </View>

//           <View style={homeStyles.modalCopy}>
//             <Text style={homeStyles.modalTitle}>
//               {selectedSpace?.title || "Untitled draft"}
//             </Text>
//             <Text style={homeStyles.modalSubtitle}>
//               {selectedSpace?.location || "Unknown location"}
//             </Text>
//           </View>

//           <View style={homeStyles.actionsWrap}>
//             <AppButton
//               title="Edit Space"
//               afterIcon={require("@/assets/icons/edit-pencil.png")}
//               onPress={handleEditSpace}
//               fullwidth
//             />
//             <AppButton
//               title="Remove Space"
//               onPress={handleRemoveSpace}
//               variant="tertiary"
//               afterIcon={require("@/assets/icons/delete.png")}
//               fullwidth
//             />
//           </View>
//         </View>
//       </CustomBottomSheet>
//       <ConfirmDialog
//         visible={isRemoveDialogVisible}
//         onConfirm={handleRemoveConfirm}
//         onCancel={handleRemoveCancel}
//         title="Remove Space?"
//         message="You are about to delete this space? Renters will not be able to see this space again when you remove it. Do you wish to proceed?"
//         cancelText="Cancel"
//         confirmText={deletePropertyPending ? "Deleting..." : "Delete"}
//         confirmVariant="danger"
//         confirmDisabled={deletePropertyPending}
//         cancelDisabled={deletePropertyPending}
//       />
//     </View>
//   );
// };

// export default SpacesDrafts;

// type PropertyCardItem = {
//   id: string;
//   imageSource: { uri: string } | number;
//   title: string;
//   location: string;
//   badgeType?: string;
//   price: string;
//   duration: string;
//   raw: PropertyListItem;
// };

// const styles = (colors: ColorScheme) =>
//   StyleSheet.create({
//     container: {
//       backgroundColor: colors.background,
//     },
//     textBlack: {
//       color: colors.slate[650],
//     },
//     title: {
//       fontSize: RFValue(18),
//       lineHeight: RFValue(24),
//       color: colors.slate[650],
//     },
//     subTitle: {
//       fontSize: RFValue(14),
//       lineHeight: RFValue(20),
//       color: colors.slate[600],
//     },
//     modalContainer: {
//       paddingTop: RFValue(10),
//       paddingBottom: RFValue(16),
//       alignItems: "center",
//     },
//     modalImageWrap: {
//       width: RFValue(112),
//       height: RFValue(112),
//       borderRadius: RFValue(20),
//       padding: RFValue(6),
//       backgroundColor: colors.slate[150],
//       marginBottom: RFValue(16),
//     },
//     modalImage: {
//       width: "100%",
//       height: "100%",
//       borderRadius: RFValue(14),
//     },
//     modalCopy: {
//       alignItems: "center",
//       marginBottom: RFValue(20),
//       gap: RFValue(4),
//     },
//     modalTitle: {
//       fontSize: RFValue(18),
//       lineHeight: RFValue(24),
//       color: colors.slate[650],
//       fontFamily: "InstrumentSansSemiBold",
//       textAlign: "center",
//     },
//     modalSubtitle: {
//       fontSize: RFValue(14),
//       lineHeight: RFValue(20),
//       color: colors.slate[600],
//       textAlign: "center",
//     },
//     actionsWrap: {
//       width: "100%",
//       gap: RFValue(10),
//     },
//     centerState: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       paddingHorizontal: RFValue(20),
//       gap: RFValue(12),
//     },
//     centerStateText: {
//       fontSize: RFValue(20),
//       lineHeight: RFValue(26),
//       fontFamily: "InstrumentSansSemiBold",
//       color: colors.slate[650],
//       textAlign: "center",
//     },
//     footerLoader: {
//       paddingVertical: RFValue(16),
//     },
//     retryWrap: {
//       width: RFValue(140),
//     },
//   });

import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { useTheme } from "@/contexts/themeContext";
import { useDeletePropertyDraft, useListPropertyDrafts } from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import { PropertyDraftItem } from "@/types";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SpacesDrafts = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const { setEditingDraft } = useSpaceStore();
  const { deletePropertyDraftMutation, deletePropertyDraftPending } =
    useDeletePropertyDraft();
  const {
    drafts,
    isDraftsLoading,
    isDraftsFetching,
    isDraftsFetchingNextPage,
    hasMoreDrafts,
    draftsError,
    fetchMoreDrafts,
    refetchDrafts,
  } = useListPropertyDrafts({
    params: {
      sort_by: "date_modified",
      sort_order: "desc",
    },
    pageSize: 20,
  });

  const addSpaceRef = useRef<BottomSheetModal>(null);
  const [selectedSpace, setSelectedSpace] =
    React.useState<PropertyCardItem | null>(null);
  const [isRemoveDialogVisible, setRemoveDialogVisible] = React.useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const handleAddSpace = (space: PropertyCardItem) => {
    setSelectedSpace(space);
    addSpaceRef.current?.present();
  };

  const handleEditSpace = () => {
    if (!selectedSpace?.id || !selectedSpace.raw) return;
    addSpaceRef.current?.dismiss();
    setEditingDraft(selectedSpace.raw);
    router.push({
      pathname: "/views/spaces/add-space/form",
      params: { draft_id: selectedSpace.id },
    });
  };

  const handleRemoveSpace = () => {
    addSpaceRef.current?.dismiss();
    setRemoveDialogVisible(true);
  };

  const handleRemoveCancel = () => {
    setRemoveDialogVisible(false);
  };

  const handleRemoveConfirm = () => {
    if (!selectedSpace?.id || deletePropertyDraftPending) return;
    deletePropertyDraftMutation({ draftId: selectedSpace.id })
      .then(() => {
        setRemoveDialogVisible(false);
        setSelectedSpace(null);
      })
      .catch(() => {
        // Toast handled in mutation onError
      });
  };

  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) =>
    value.replace(/^per_/, "").replace(/_/g, " ");

  const cardData = useMemo<PropertyCardItem[]>(
    () =>
      drafts.map((item: PropertyDraftItem) => ({
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
        badgeType: "draft",
        price: formatCurrency(item.price),
        duration: formatCostFrequency(item.cost_frequency),
        raw: item,
      })),
    [drafts],
  );

  const handleRefresh = () => {
    refetchDrafts();
  };

  const handleLoadMore = () => {
    if (!hasMoreDrafts || isDraftsFetchingNextPage) return;
    fetchMoreDrafts();
  };

  if (isDraftsLoading) {
    return (
      <View style={homeStyles.centerState}>
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={homeStyles.centerStateText}>Loading Drafts...</Text>
      </View>
    );
  }

  if (draftsError) {
    return (
      <View style={homeStyles.centerState}>
        <Text style={homeStyles.centerStateText}>Unable to load drafts.</Text>
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
          <Text
            style={[homeStyles.subTitle, { textAlign: "center", marginTop: 8 }]}
          >
            Drafts are automatically saved when you start creating a space
          </Text>
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
            <HouseCard {...item} onPress={() => handleAddSpace(item)} />
          ) : (
            <HouseCardTile
              imageSource={item.imageSource}
              name={item.title}
              location={item.location}
              badgeType={item.badgeType}
              onPress={() => handleAddSpace(item)}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshing={isDraftsFetching && !isDraftsFetchingNextPage}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isDraftsFetchingNextPage ? (
            <View style={homeStyles.footerLoader}>
              <ActivityIndicator size="small" color={colors.slate[650]} />
            </View>
          ) : null
        }
      />
      <CustomBottomSheet
        bottomSheetProps={{
          ref: addSpaceRef,
          snapPoints,
          index: 2,
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
              {selectedSpace?.title || "Untitled draft"}
            </Text>
            <Text style={homeStyles.modalSubtitle}>
              {selectedSpace?.location || "Unknown location"}
            </Text>
            <View style={homeStyles.draftBadge}>
              <Text style={homeStyles.draftBadgeText}>DRAFT</Text>
            </View>
          </View>

          <View style={homeStyles.actionsWrap}>
            <AppButton
              title="Continue Editing"
              afterIcon={require("@/assets/icons/edit-pencil.png")}
              onPress={handleEditSpace}
              fullwidth
            />
            <AppButton
              title="Delete Draft"
              onPress={handleRemoveSpace}
              variant="tertiary"
              afterIcon={require("@/assets/icons/delete.png")}
              fullwidth
            />
          </View>
        </View>
      </CustomBottomSheet>
      <ConfirmDialog
        visible={isRemoveDialogVisible}
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
        title="Delete Draft?"
        message="Are you sure you want to delete this draft? This action cannot be undone."
        cancelText="Cancel"
        confirmText={deletePropertyDraftPending ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        confirmDisabled={deletePropertyDraftPending}
        cancelDisabled={deletePropertyDraftPending}
      />
    </View>
  );
};

export default SpacesDrafts;

type PropertyCardItem = {
  id: string;
  imageSource: { uri: string } | number;
  title: string;
  location: string;
  badgeType?: string;
  price: string;
  duration: string;
  raw: PropertyDraftItem;
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
    draftBadge: {
      backgroundColor: colors.warning[100],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(12),
      marginTop: RFValue(8),
    },
    draftBadgeText: {
      fontSize: RFValue(11),
      fontWeight: "600",
      color: colors.warning[300],
      letterSpacing: 0.5,
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
