import { useTheme } from "@/contexts/themeContext";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type SliderItem = {
  id: string;
  image: any;
  location?: string;
};

type Props = {
  data: SliderItem[];
  autoPlay?: boolean;
  interval?: number;
};

const ImageSlider = ({ data, autoPlay = true, interval = 3000 }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = width * 0.8;

  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    if (!autoPlay || data.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % data.length;
        scrollRef.current?.scrollTo({
          x: next * itemWidth,
          animated: true,
        });
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, data.length, itemWidth]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / itemWidth);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  return (
    <View className="items-center w-full">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {data.map((item) => (
          <View
            key={item.id}
            className="mx-2 overflow-hidden rounded-2xl"
            style={{ width: itemWidth, height: 170 }}
          >
            <Image
              source={item.image}
              resizeMode="cover"
              className="w-full h-full"
            />

            {item.location && (
              <BlurView
                intensity={70}
                tint={isDarkMode ? "dark" : "light"}
                className="absolute flex-row items-center w-full gap-2 p-4 -bottom-1 rounded-xl"
              >
                {isDarkMode ? (
                  <Image
                    source={require("@/assets/icons/location-white.png")}
                    className="w-3.5 h-3.5 mr-2"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/discover-location-white.png")}
                  />
                )}

                <Text
                  className="font-semibold capitalize"
                  style={{ color: colors.slate[650] }}
                >
                  {item.location}
                </Text>
              </BlurView>
            )}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 20,
          marginTop: 12,
          backgroundColor: colors.slate[150] + "20",
        }}
      >
        {data.map((_, i) => {
          const isActive = i === currentIndex;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                scrollRef.current?.scrollTo({
                  x: i * itemWidth,
                  animated: true,
                });
                setCurrentIndex(i);
              }}
              style={{
                height: 6,
                borderRadius: 10,
                marginHorizontal: 4,
                width: isActive ? 24 : 6,
                backgroundColor: isActive
                  ? colors.slate[650]
                  : colors.slate[300],
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ImageSlider;
