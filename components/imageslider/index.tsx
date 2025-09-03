import { slider } from "@/constants/discover";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Record<string, any>>>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slider.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  };

  return (
    <View className="w-full h-64">
      <FlatList
        ref={flatListRef}
        data={slider}
        horizontal
        pagingEnabled
        contentContainerClassName="gap-4"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image source={item.image} resizeMode="cover" />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Dots */}
      <View className="absolute flex-row justify-center w-full bottom-3">
        <View className="bg-[#18181A14] flex-row p-2 rounded-full min-w-[56px]">
          {slider.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
                setCurrentIndex(index);
              }}
              className={`h-2 mx-[1px] rounded-full ${
                index === currentIndex
                  ? "bg-[#1C2024] w-6"
                  : "bg-gray-400 border-white w-2"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
