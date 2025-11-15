// import React, { useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");

// type SliderItem = {
//   id: string;
//   image: any;
//   location?: string;
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

//   useEffect(() => {
//     if (!autoPlay || data.length <= 1) return;

//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const nextIndex = (prevIndex + 1) % data.length;
//         flatListRef.current?.scrollToIndex({
//           index: nextIndex,
//           animated: true,
//         });
//         return nextIndex;
//       });
//     }, interval);

//     return () => clearInterval(intervalId);
//   }, [autoPlay, interval, data.length]);

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const index = Math.round(
//       event.nativeEvent.contentOffset.x /
//         event.nativeEvent.layoutMeasurement.width
//     );
//     setCurrentIndex(index);
//   };

//   const handleScrollToIndexFailed = (info: any) => {
//     setTimeout(() => {
//       flatListRef.current?.scrollToIndex({
//         index: info.index,
//         animated: true,
//       });
//     }, 100);
//   };

//   return (
//     <View className="w-full relative">
//       <FlatList
//         ref={flatListRef}
//         data={data}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll} // ✅ Correct
//         onScrollToIndexFailed={handleScrollToIndexFailed}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             className="rounded-3xl overflow-hidden mx-2"
//             style={{ width: width * 0.9, height: 220 }}
//           >
//             <Image
//               source={item.image}
//               style={{ width: "100%", height: "100%" }}
//               resizeMode="cover"
//             />
//             {item.location && (
//               <View className="absolute bottom-3 left-3 flex-row items-center bg-black/40 px-3 py-1 rounded-full">
//                 <Image
//                   source={require("@/assets/icons/location.png")}
//                   className="w-[16px] h-[16px] mr-1"
//                 />
//                 <Text className="text-white font-semibold text-sm">
//                   {item.location}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}
//       />

//       {showDots && (
//         <View className="absolute bottom-3 w-full flex-row justify-center items-center">
//           <View className="bg-[#18181A14] flex-row p-2 rounded-full min-w-[56px] justify-center">
//             {data.map((_, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   flatListRef.current?.scrollToIndex({ index, animated: true });
//                   setCurrentIndex(index);
//                 }}
//                 className={`h-2 mx-[2px] rounded-full ${
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

// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   Dimensions,
// //   FlatList,
// //   Image,
// //   NativeScrollEvent,
// //   NativeSyntheticEvent,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // const { width: screenWidth } = Dimensions.get("window");

// // type SliderItem = {
// //   id: string;
// //   image: any;
// //   location?: string;
// // };

// // type ImageSliderProps = {
// //   data: SliderItem[];
// //   autoPlay?: boolean;
// //   interval?: number;
// //   showDots?: boolean;
// // };

// // const ImageSlider = ({
// //   data = [],
// //   autoPlay = true,
// //   interval = 3000,
// //   showDots = true,
// // }: ImageSliderProps) => {
// //   const flatListRef = useRef<FlatList<SliderItem> | null>(null);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   // Layout constants
// //   const itemWidth = Math.round(screenWidth * 0.9);
// //   const itemSpacing = 16; // margin horizontal (mx-2 -> ~8 each side). Use 16 so snap calculation is stable.
// //   const snapInterval = itemWidth + itemSpacing;

// //   // Auto-play: single interval using functional state update
// //   useEffect(() => {
// //     if (!autoPlay || data.length <= 1) return;

// //     const id = setInterval(() => {
// //       setCurrentIndex((prev) => {
// //         const next = (prev + 1) % data.length;
// //         // scrollToIndex with try/catch pattern — will be retried by onScrollToIndexFailed if it fails
// //         flatListRef.current?.scrollToIndex({ index: next, animated: true });
// //         return next;
// //       });
// //     }, interval);

// //     return () => clearInterval(id);
// //   }, [autoPlay, interval, data.length]);

// //   // If scrollToIndex fails because the item wasn't measured yet
// //   const onScrollToIndexFailed = (info: { index: number }) => {
// //     // small delay then try again — gives RN time to measure
// //     setTimeout(() => {
// //       flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
// //     }, 100);
// //   };

// //   // When user finishes swiping (momentum end) compute index using contentOffset and snapInterval
// //   const onMomentumScrollEnd = (
// //     event: NativeSyntheticEvent<NativeScrollEvent>
// //   ) => {
// //     const offsetX = event.nativeEvent.contentOffset.x;
// //     const calculatedIndex = Math.round(offsetX / snapInterval);
// //     const boundedIndex = Math.min(
// //       Math.max(calculatedIndex, 0),
// //       data.length - 1
// //     );
// //     setCurrentIndex(boundedIndex);
// //   };

// //   // Required for performant scrollToIndex — tells RN where each item is
// //   const getItemLayout = (_: any, index: number) => ({
// //     length: snapInterval,
// //     offset: snapInterval * index,
// //     index,
// //   });

// //   if (!data || data.length === 0) return null;

// //   return (
// //     <View style={{ width: "100%" }}>
// //       <FlatList
// //         ref={flatListRef}
// //         data={data}
// //         horizontal
// //         pagingEnabled={false} // we use snapToInterval instead
// //         snapToInterval={snapInterval}
// //         decelerationRate="fast"
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={{
// //           paddingHorizontal: (screenWidth - itemWidth) / 2, // center first/last card
// //         }}
// //         keyExtractor={(item) => item.id}
// //         onMomentumScrollEnd={onMomentumScrollEnd}
// //         onScrollToIndexFailed={onScrollToIndexFailed}
// //         scrollEventThrottle={16}
// //         getItemLayout={getItemLayout}
// //         renderItem={({ item }) => (
// //           <View
// //             style={{
// //               width: itemWidth,
// //               height: 220,
// //               marginRight: itemSpacing,
// //               borderRadius: 18,
// //               overflow: "hidden",
// //             }}
// //           >
// //             <Image
// //               source={item.image}
// //               style={{ width: "100%", height: "100%" }}
// //               resizeMode="cover"
// //             />

// //             {item.location && (
// //               <View
// //                 style={{
// //                   position: "absolute",
// //                   left: 12,
// //                   bottom: 12,
// //                   backgroundColor: "rgba(0,0,0,0.45)",
// //                   paddingHorizontal: 10,
// //                   paddingVertical: 6,
// //                   borderRadius: 999,
// //                   flexDirection: "row",
// //                   alignItems: "center",
// //                 }}
// //               >
// //                 {/* If you don't have a location icon file, remove the Image here */}
// //                 {/* <Image source={require("@/assets/icons/location.png")} style={{ width: 14, height: 14, marginRight: 6 }} /> */}
// //                 <Text style={{ color: "white", fontWeight: "600" }}>
// //                   {item.location}
// //                 </Text>
// //               </View>
// //             )}
// //           </View>
// //         )}
// //       />

// //       {/* Dots */}
// //       {showDots && (
// //         <View
// //           style={{
// //             position: "absolute",
// //             bottom: 12,
// //             left: 0,
// //             right: 0,
// //             alignItems: "center",
// //             justifyContent: "center",
// //           }}
// //         >
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               backgroundColor: "rgba(24,24,26,0.08)",
// //               paddingHorizontal: 8,
// //               paddingVertical: 6,
// //               borderRadius: 999,
// //               alignItems: "center",
// //               minWidth: 56,
// //             }}
// //           >
// //             {data.map((_, i) => (
// //               <TouchableOpacity
// //                 key={i}
// //                 onPress={() => {
// //                   flatListRef.current?.scrollToIndex({
// //                     index: i,
// //                     animated: true,
// //                   });
// //                   setCurrentIndex(i);
// //                 }}
// //                 style={{
// //                   height: 6,
// //                   marginHorizontal: 4,
// //                   borderRadius: 999,
// //                   backgroundColor: i === currentIndex ? "#1C2024" : "#C4C4C4",
// //                   width: i === currentIndex ? 24 : 6,
// //                 }}
// //               />
// //             ))}
// //           </View>
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // export default ImageSlider;

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
  const itemWidth = width * 0.9;

  // ✅ Stable autoplay logic
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
  }, [autoPlay, interval, data.length]);

  // ✅ Manual scroll sync
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / itemWidth);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  return (
    <View className="w-full items-center">
      {/* ✅ Horizontal Scroll */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{
          paddingHorizontal: (width - itemWidth) / 2,
        }}
      >
        {data.map((item) => (
          <View
            key={item.id}
            className="overflow-hidden rounded-2xl mx-2"
            style={{ width: itemWidth, height: 220 }}
          >
            <Image
              source={item.image}
              resizeMode="cover"
              className="w-full h-full"
            />

            {item.location && (
              <View className="absolute bottom-3 left-3 flex-row items-center bg-black/40 px-3 py-1.5 rounded-full">
                <Image
                  source={require("@/assets/icons/location.png")}
                  className="w-3.5 h-3.5 mr-2"
                />
                <Text className="text-white font-semibold text-sm">
                  {item.location}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* ✅ Dots */}
      <View className="flex-row items-center justify-center bg-[#18181A]/10 px-2.5 py-1.5 rounded-full mt-3">
        {data.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              scrollRef.current?.scrollTo({
                x: i * itemWidth,
                animated: true,
              });
              setCurrentIndex(i);
            }}
            className={`h-1.5 rounded-full mx-1 ${
              i === currentIndex ? "bg-[#1C2024] w-6" : "bg-[#C4C4C4] w-1.5"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;
