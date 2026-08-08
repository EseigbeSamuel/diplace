import React from "react";
import { View, Image, Pressable, ImageSourcePropType } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ParallaxHeaderProps {
  scrollY: SharedValue<number>;
  IMAGE_HEIGHT: number;
  propertyImage: ImageSourcePropType;
  handleBack: () => void;
}

const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({
  scrollY,
  IMAGE_HEIGHT,
  propertyImage,
  handleBack,
}) => {
  const insets = useSafeAreaInsets();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const height =
      scrollY.value < 0 ? IMAGE_HEIGHT - scrollY.value : IMAGE_HEIGHT;
    const translateY = scrollY.value > 0 ? -scrollY.value * 0.5 : 0;

    return {
      height,
      transform: [{ translateY }],
    };
  });

  return (
    <>
      {/* Background Image Banner */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: IMAGE_HEIGHT,
            zIndex: 1,
          },
          imageAnimatedStyle,
        ]}
      >
        <Image
          source={propertyImage}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Animated.View>

      {/* Absolute Custom Header Overlaid on Image */}
      <View
        style={{ top: Math.max(insets.top, 16) }}
        className="absolute z-20 w-full px-4 flex flex-row items-center justify-between"
      >
        <Pressable
          onPress={handleBack}
          style={{
            width: RFValue(36),
            height: RFValue(36),
            borderRadius: RFValue(18),
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Image
            source={require("@/assets/icons/arrow-right-dark.png")}
            style={{
              width: 16,
              height: 16,
              transform: [{ rotate: "180deg" }],
              tintColor: "#1C2024",
            }}
          />
        </Pressable>

        <Pressable
          style={{
            width: RFValue(36),
            height: RFValue(36),
            borderRadius: RFValue(18),
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Image
            source={require("@/assets/icons/more-2-line.png")}
            style={{ width: 18, height: 18, tintColor: "#1C2024" }}
          />
        </Pressable>
      </View>
    </>
  );
};

export default ParallaxHeader;
