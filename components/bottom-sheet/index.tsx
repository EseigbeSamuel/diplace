import { useTheme } from "@/contexts/themeContext";
import { BottomSheetModalProps } from "@/types";
import { ColorScheme } from "@/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface Props {
  bottomSheetProps?: BottomSheetModalProps;
  children: React.ReactNode;
}

export const CustomBottomSheet = ({ bottomSheetProps, children }: Props) => {
  const { colors } = useTheme();
  const style = styles(colors);
  const { ref: modalRef, ...modalProps } = bottomSheetProps ?? {};

  return (
    <BottomSheetModal
      {...modalProps}
      ref={modalRef}
      enableDynamicSizing={false}
      handleStyle={style.handleContainer}
      handleIndicatorStyle={style.bottomSheetHandleIndicator}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={style.container}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    bottomSheetIndicator: {
      backgroundColor: colors.background,
    },
    bottomSheetHandleIndicator: {
      backgroundColor: colors.slate[500],
      width: wp(15),
      height: hp(0.75),
      marginTop: hp(1),
      zIndex: 1,
    },
    handleContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: hp(3),
      paddingVertical: hp(1),
    },
  });
