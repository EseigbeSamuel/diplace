import { Slider } from "@/constants/discover";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  // Auto scroll every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % Slider.length;
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
      {/* Slider */}
      <FlatList
        ref={flatListRef}
        data={Slider}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Dots */}
      <View className="absolute bottom-3 w-full flex-row justify-center">
        {Slider.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index, animated: true });
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
