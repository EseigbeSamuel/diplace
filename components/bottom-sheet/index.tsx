import { useTheme } from "@/contexts/themeContext";
import { BottomSheetModalProps } from "@/types";
import { ColorScheme } from "@/utils";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
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

  return (
    <BottomSheetModal
      {...bottomSheetProps}
      handleIndicatorStyle={style.bottomSheetHandleIndicator}
    >
      <BottomSheetScrollView style={style.container}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    bottomSheetHandleIndicator: {
      backgroundColor: colors.slate[500],
      width: wp(15),
      height: hp(0.75),
      marginTop: hp(1),
      zIndex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: hp(3),
      paddingVertical: hp(1),
    },
  });
