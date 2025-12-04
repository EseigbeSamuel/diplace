import { IOnboardingSplash } from "@/app";
import React from "react";
import { Image } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

interface CarouselCardProps {
  item: IOnboardingSplash;
  animationValue: SharedValue<number>;
}

const CarouselCard = ({ item, animationValue }: CarouselCardProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.79, 1, 0.79]
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: RFValue(250),
          height: RFValue(350),
          borderRadius: 25,
          backgroundColor: "#fff",
          elevation: 10,
          overflow: "hidden",
        },
        animatedStyle,
      ]}
    >
      <Image
        source={item.image}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        className="border-4 border-white rounded-3xl"
      />
    </Animated.View>
  );
};

export default CarouselCard;
