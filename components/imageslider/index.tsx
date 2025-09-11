import { slider } from "@/constants/discover";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function ImageSlider() {
  const { colors } = useTheme();
  const sliderStyles = styles(colors);
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
          <View>
            <View>
              <Image source={item.image} resizeMode="cover" />
            </View>
            {/* <Text style={sliderStyles.text} className="font-medium">
              {item.location}{" "}
            </Text> */}
          </View>
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

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    text: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
    },
  });

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";

// type SliderItem = {
//   id: string;
//   image: any; // local require() or { uri: string }
//   location?: string;
//   subtitle?: string;
// };

// type ImageSliderProps = {
//   data: SliderItem[];
//   autoPlay?: boolean;
//   interval?: number;
//   showDots?: boolean;
// };

// const ImageSlider = ({
//   data,
//   autoPlay = true,
//   interval = 3000,
//   showDots = true,
// }: ImageSliderProps) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList<SliderItem>>(null);

//   // Auto play effect
//   useEffect(() => {
//     if (!autoPlay || data.length <= 1) return;
//     const timer = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % data.length;
//       flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//       setCurrentIndex(nextIndex);
//     }, interval);

//     return () => clearInterval(timer);
//   }, [currentIndex, autoPlay, interval, data.length]);

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const index = Math.round(
//       event.nativeEvent.contentOffset.x /
//         event.nativeEvent.layoutMeasurement.width
//     );
//     setCurrentIndex(index);
//   };

//   return (
//     <View className="w-full h-64 relative">
//       {/* Slider */}
//       <FlatList
//         ref={flatListRef}
//         data={data}
//         horizontal
//         pagingEnabled
//         contentContainerClassName="gap-4"
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         renderItem={({ item }) => (
//           <View className="h-64 relative rounded-2xl overflow-hidden">
//             <Image
//               source={item.image}
//               resizeMode="cover"
//               // className="w-full h-full"
//             />
//             {/* Optional overlay text */}
//             {item.location && (
//               <View className="absolute bottom-3 left-3 bg-black/50 px-3 py-1 rounded-full">
//                 <Text className="text-white text-sm">{item.location}</Text>
//               </View>
//             )}
//           </View>
//         )}
//         keyExtractor={(item) => item.id}
//       />

//       {/* Dots */}
//       {showDots && (
//         <View className="absolute flex-row justify-center w-full bottom-3">
//           <View className="bg-[#18181A14] flex-row p-2 rounded-full min-w-[56px]">
//             {data.map((_, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   flatListRef.current?.scrollToIndex({
//                     index,
//                     animated: true,
//                   });
//                   setCurrentIndex(index);
//                 }}
//                 className={`h-2 mx-[1px] rounded-full ${
//                   index === currentIndex
//                     ? "bg-[#1C2024] w-6"
//                     : "bg-gray-400 w-2"
//                 }`}
//               />
//             ))}
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default ImageSlider;

// const styles = StyleSheet.create({
//   text: {
//     fontSize: RFValue(18),
//     lineHeight: RFValue(24),
//   },
// });
