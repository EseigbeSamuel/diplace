import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

type LoaderProps = {
  visible: boolean;
  message?: string;
  overlay?: boolean;
};

const CustomLoader: React.FC<LoaderProps> = ({
  visible,
  message = "please wait...",
  overlay = true,
}) => {
  const { colors } = useTheme();
  const custom = styles(colors);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Rotation animation
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1200,
          easing: Easing.linear,
        }),
        -1,
        false,
      );

      // Pulse animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      rotation.value = 0;
      scale.value = 1;
    }
  }, [visible]);

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  if (!visible) return null;

  const content = (
    <View style={custom.container}>
      <View style={custom.loaderCard}>
        {/* Custom Circular Spinner */}
        <Animated.View style={[custom.spinnerContainer, animatedSpinnerStyle]}>
          <View style={custom.spinnerOuter}>
            <View style={custom.spinnerInner} />
          </View>
        </Animated.View>

        {/* Message */}
        <Text style={custom.message}>{message}</Text>
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
};

export default CustomLoader;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    loaderCard: {
      backgroundColor: colors.background,
      borderRadius: RFValue(24),
      paddingHorizontal: RFValue(48),
      paddingVertical: RFValue(36),
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(20),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 10,
      minWidth: RFValue(200),
    },
    spinnerContainer: {
      width: RFValue(60),
      height: RFValue(60),
      alignItems: "center",
      justifyContent: "center",
    },
    spinnerOuter: {
      width: RFValue(50),
      height: RFValue(50),
      borderRadius: RFValue(25),
      borderWidth: 4,
      borderColor: colors.slate[200],
      borderTopColor: colors.slate[650],
      alignItems: "center",
      justifyContent: "center",
    },
    spinnerInner: {
      width: RFValue(30),
      height: RFValue(30),
      borderRadius: RFValue(15),
      backgroundColor: colors.slate[100],
    },
    message: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[600],
      textAlign: "center",
      fontFamily: "InstrumentSansRegular",
    },
  });
