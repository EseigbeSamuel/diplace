import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
import { RFValue } from "react-native-responsive-fontsize";

export interface IOnboardingSplash {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const OnboardingSplash: IOnboardingSplash[] = [
  {
    image: require("../assets/images/architecture.png"),
    title: "Find a home without hassle!",
    description:
      "Escape the stress and wahala of looking for an apartment, office, or event center.",
  },
  {
    image: require("../assets/images/halls.jpg"),
    title: "Book event halls with ease!",
    description:
      "Whether it’s a wedding, party, or corporate event; lock down the perfect venue fast.",
  },
  {
    image: require("../assets/images/space.jpg"),
    title: "Secure your space to grow!",
    description: "DiPlace helps your business find the right space smarter.",
  },
];

export default function GetStarted() {
  const { colors } = useTheme();
  const router = useRouter();
  const carouselRef = useRef(null);

  // Tracks current slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SafeAreaViewContainer className="items-center justify-center gap-4">
      <Text
        style={{ fontSize: RFValue(24), color: colors.slate[650] }}
        className="font-bold"
      >
        DiPlace
      </Text>

      {/* <Carousel
        ref={carouselRef}
        width={RFValue(250)}
        height={RFValue(300)}
        data={OnboardingSplash}
        mode="parallax"
        autoPlay
        autoPlayInterval={5000}
        scrollAnimationDuration={900}
        modeConfig={{ parallaxAdjacentItemScale: 0.85 }}
        onSnapToItem={(index) => setCurrentIndex(index)}
        onProgressChange={(_, absoluteProgress) => {
          setCurrentIndex(Math.round(absoluteProgress));
        }}
        renderItem={({ item, animationValue, index }) => {
          return (
            <CarouselCard
              key={index}
              item={item}
              animationValue={animationValue}
            />
          );
        }}
      /> */}

      <View className="flex-row justify-center mt-3">
        {OnboardingSplash.map((_, i) => (
          <View
            key={i}
            style={{
              width: currentIndex === i ? 20 : 8,
              height: 8,
              borderRadius: 10,
              marginHorizontal: 4,
              backgroundColor:
                currentIndex === i ? colors.slate[600] : colors.slate[400],
              opacity: currentIndex === i ? 1 : 0.5,
            }}
          />
        ))}
      </View>
      <View className="w-[90%] gap-2 mt-2">
        <Text
          style={{ fontSize: RFValue(22), color: colors.slate[650] }}
          className="font-semibold text-center"
        >
          {OnboardingSplash[currentIndex].title}
        </Text>

        <Text
          style={{ color: colors.slate[600] }}
          className="text-base text-center"
        >
          {OnboardingSplash[currentIndex].description}
        </Text>
      </View>

      <View className="w-[90%] mt-3">
        <AppButton
          title="Get Started"
          onPress={() => router.push("/auth/login")}
          fullwidth
          afterIcon={require("../assets/icons/arrow-right-light.png")}
        />
      </View>
    </SafeAreaViewContainer>
  );
}
