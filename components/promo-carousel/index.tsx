// // // components/PromoCarousel.tsx
// // import { ArrowUpRight } from "lucide-react-native";
// // import React, { useEffect, useMemo, useRef } from "react";
// // import {
// //   Dimensions,
// //   FlatList,
// //   ListRenderItemInfo,
// //   Text,
// //   View,
// // } from "react-native";
// // import Animated, {
// //   Extrapolate,
// //   interpolate,
// //   runOnJS,
// //   useAnimatedScrollHandler,
// //   useAnimatedStyle,
// //   useSharedValue,
// //   withTiming,
// // } from "react-native-reanimated";
// // import { RFValue } from "react-native-responsive-fontsize";

// // const { width: screenW } = Dimensions.get("window");

// // export type PromoItem = {
// //   id: string;
// //   title: string;
// //   description: string;
// //   color: string;
// //   borderColor: string;
// // };

// // type Props = {
// //   data: PromoItem[];
// //   itemWidth?: number; // px
// //   gap?: number; // px
// //   autoScrollIntervalMs?: number | null; // set null to disable
// //   showDots?: boolean;
// // };

// // const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as any;

// // export default function PromoCarousel({
// //   data,
// //   itemWidth = RFValue(260),
// //   gap = 14,
// //   autoScrollIntervalMs = 3000,
// //   showDots = true,
// // }: Props) {
// //   // ------------------------
// //   // Prepare looped data: [last, ...data, first]
// //   // ------------------------
// //   const loopData = useMemo(() => {
// //     if (data.length <= 1) return data;
// //     const arr = [...data];
// //     return [arr[arr.length - 1], ...arr, arr[0]];
// //   }, [data]);

// //   const realDataLength = data.length;
// //   const snapWidth = itemWidth + gap;
// //   const initialIndex = loopData.length > 1 ? 1 : 0; // start at first real

// //   // refs & shared values
// //   const flatRef = useRef<FlatList<any> | null>(null);
// //   const translateX = useSharedValue(initialIndex * snapWidth * -1); // not used directly, kept for a11y
// //   const scrollX = useSharedValue(initialIndex * snapWidth);
// //   const currentIndex = useSharedValue(initialIndex);

// //   // scroll handler to update shared values
// //   const onScroll = useAnimatedScrollHandler({
// //     onScroll: (event) => {
// //       scrollX.value = event.contentOffset.x;
// //     },
// //     onMomentumEnd: (event) => {
// //       const offset = event.contentOffset.x;
// //       const idx = Math.round(offset / snapWidth);
// //       currentIndex.value = idx;
// //     },
// //   });

// //   // Whenever the index reaches virtual edges, snap to the correct offset (infinite loop)
// //   useEffect(() => {
// //     if (loopData.length <= 1) return;
// //     const id = currentIndex.value;
// //     // We'll run logic from JS side using a derived listener using a small loop
// //     // Instead of a heavy subscription, we poll changes via a tiny interval tied to scrollX changes.
// //   }, [loopData.length]);

// //   // Helper to scroll to index (animated)
// //   const scrollToIndex = (idx: number, animated = true) => {
// //     if (!flatRef.current) return;
// //     flatRef.current.scrollToOffset({
// //       offset: idx * snapWidth,
// //       animated,
// //     });
// //   };

// //   // set initial offset on mount (center on the first real item)
// //   useEffect(() => {
// //     if (!flatRef.current) return;
// //     if (initialIndex === 0) return;
// //     setTimeout(() => {
// //       scrollToIndex(initialIndex, false);
// //     }, 40);
// //   }, [initialIndex]);

// //   // watch scrollX to handle edge snapping (in JS)
// //   useEffect(() => {
// //     if (loopData.length <= 1) return;
// //     // small RAF loop to detect when momentum has ended and adjust edges
// //     let raf = 0;
// //     let lastVal = -1;
// //     const check = () => {
// //       // @ts-ignore read shared value via .value is allowed
// //       const vx = scrollX.value;
// //       if (vx === lastVal) {
// //         // stable — momentum likely ended
// //         const idx = Math.round(vx / snapWidth);

// //         // if at left-most virtual (0) -> jump to last real (realDataLength)
// //         if (idx === 0) {
// //           // jump without animation to realDataLength
// //           runOnJS(scrollToIndex)(realDataLength, false);
// //         } else if (idx === loopData.length - 1) {
// //           // jumped to appended last -> move to index 1
// //           runOnJS(scrollToIndex)(1, false);
// //         }
// //       } else {
// //         lastVal = vx;
// //         raf = requestAnimationFrame(check);
// //       }
// //     };
// //     raf = requestAnimationFrame(check);
// //     return () => cancelAnimationFrame(raf);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [scrollX, snapWidth, loopData.length, realDataLength]);

// //   // Auto-scroll interval
// //   useEffect(() => {
// //     if (!autoScrollIntervalMs || loopData.length <= 1) return;
// //     const id = setInterval(() => {
// //       // compute next index (JS read of shared value)
// //       const current = Math.round(scrollX.value / snapWidth);
// //       let next = current + 1;
// //       // if next is last virtual, scroll and the edge logic will snap
// //       runOnJS(scrollToIndex)(next, true);
// //     }, autoScrollIntervalMs);
// //     return () => clearInterval(id);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [autoScrollIntervalMs, loopData.length, snapWidth]);

// //   // Render item - uses Reanimated style to scale/opacity based on center position
// //   const renderItem = ({ item, index }: ListRenderItemInfo<PromoItem>) => {
// //     // animated style depends on scrollX
// //     const animatedCardStyle = useAnimatedStyle(() => {
// //       const center = scrollX.value;
// //       const itemCenter = index * snapWidth;
// //       const distance = Math.abs(itemCenter - center);

// //       // scale from 0.85 -> 1 -> 0.85
// //       const scale = interpolate(
// //         distance,
// //         [0, snapWidth],
// //         [1, 0.86],
// //         Extrapolate.CLAMP
// //       );

// //       // elevation/opacity
// //       const opacity = interpolate(distance, [0, snapWidth], [1, 0.85]);

// //       return {
// //         transform: [{ scale: withTiming(scale, { duration: 200 }) }],
// //         opacity: withTiming(opacity, { duration: 200 }),
// //       };
// //     }, []);

// //     return (
// //       <Animated.View
// //         style={[
// //           {
// //             width: itemWidth,
// //             marginRight: gap,
// //             borderRadius: RFValue(16),
// //             padding: RFValue(16),
// //             borderWidth: 1,
// //             backgroundColor: item.color,
// //             borderColor: item.borderColor,
// //           },
// //           animatedCardStyle,
// //         ]}
// //       >
// //         <View
// //           style={{
// //             flexDirection: "row",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             marginBottom: RFValue(6),
// //           }}
// //         >
// //           <Text
// //             style={{
// //               fontSize: RFValue(16),
// //               fontWeight: "700",
// //               color: "#0b0b0b",
// //             }}
// //           >
// //             {item.title}
// //           </Text>
// //           <ArrowUpRight size={18} color="#0b0b0b" />
// //         </View>

// //         <Text
// //           style={{
// //             fontSize: RFValue(13),
// //             color: "#334155",
// //             lineHeight: RFValue(18),
// //           }}
// //         >
// //           {item.description}
// //         </Text>
// //       </Animated.View>
// //     );
// //   };

// //   // Pagination dots animated style helper
// //   const Dots = () => {
// //     if (!showDots) return null;
// //     const length = realDataLength;
// //     return (
// //       <View
// //         style={{
// //           flexDirection: "row",
// //           justifyContent: "center",
// //           marginTop: 10,
// //           gap: 8,
// //         }}
// //       >
// //         {Array.from({ length }).map((_, i) => {
// //           const dotStyle = useAnimatedStyle(() => {
// //             // compute virtual index that corresponds to this real index
// //             // our visible center index = round(scrollX / snapWidth) - 1 (since loopData has offset)
// //             const virtualCenterIndex = Math.round(scrollX.value / snapWidth);
// //             // map real index i to its corresponding virtual index:
// //             const correspondingVirtualIndex = i + 1;

// //             // distance in items
// //             const dist = Math.abs(
// //               correspondingVirtualIndex * snapWidth - scrollX.value
// //             );

// //             const width = interpolate(
// //               dist,
// //               [0, snapWidth],
// //               [28, 8],
// //               Extrapolate.CLAMP
// //             );
// //             const opacity = interpolate(
// //               dist,
// //               [0, snapWidth],
// //               [1, 0.4],
// //               Extrapolate.CLAMP
// //             );
// //             const scale = interpolate(
// //               dist,
// //               [0, snapWidth],
// //               [1, 0.86],
// //               Extrapolate.CLAMP
// //             );

// //             return {
// //               width: withTiming(width, { duration: 200 }),
// //               opacity: withTiming(opacity, { duration: 200 }),
// //               transform: [{ scale: withTiming(scale, { duration: 200 }) }],
// //               borderRadius: 999,
// //               height: 8,
// //               backgroundColor: "#111827",
// //             };
// //           }, []);

// //           // Each dot is an Animated.View with animated styles
// //           return <Animated.View key={i} style={dotStyle} />;
// //         })}
// //       </View>
// //     );
// //   };

// //   return (
// //     <View>
// //       <AnimatedFlatList
// //         ref={flatRef}
// //         data={loopData}
// //         horizontal
// //         keyExtractor={(it: PromoItem, idx: number) => `${it.id}-${idx}`}
// //         renderItem={renderItem}
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={{ paddingHorizontal: (screenW - itemWidth) / 2 }}
// //         snapToInterval={snapWidth}
// //         decelerationRate="fast"
// //         bounces={false}
// //         onScroll={onScroll}
// //         scrollEventThrottle={16}
// //       />

// //       <Dots />
// //     </View>
// //   );
// // }
// // components/PromoCarousel.tsx

// import { ArrowUpRight } from "lucide-react-native";
// import React, { useEffect, useMemo, useRef } from "react";
// import {
//   Dimensions,
//   FlatList,
//   ListRenderItemInfo,
//   Text,
//   View,
// } from "react-native";
// import Animated, {
//   Extrapolate,
//   interpolate,
//   runOnJS,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { RFValue } from "react-native-responsive-fontsize";

// const { width: screenW } = Dimensions.get("window");

// export type PromoItem = {
//   id: string;
//   title: string;
//   description: string;
//   color: string;
//   borderColor: string;
// };

// type Props = {
//   data: PromoItem[];
//   itemWidth?: number;
//   gap?: number;
//   autoScrollIntervalMs?: number | null;
//   showDots?: boolean;
// };

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as any;

// /* -------------------------------------------------------
//    CARD ITEM COMPONENT (fix renderItem hook violation)
// -------------------------------------------------------- */
// function PromoCardItem({
//   item,
//   index,
//   itemWidth,
//   gap,
//   scrollX,
//   snapWidth,
// }: {
//   item: PromoItem;
//   index: number;
//   itemWidth: number;
//   gap: number;
//   scrollX: Animated.SharedValue<number>;
//   snapWidth: number;
// }) {
//   const animatedCardStyle = useAnimatedStyle(() => {
//     const center = scrollX.value;
//     const itemCenter = index * snapWidth;
//     const distance = Math.abs(itemCenter - center);

//     const scale = interpolate(
//       distance,
//       [0, snapWidth],
//       [1, 0.86],
//       Extrapolate.CLAMP
//     );

//     const opacity = interpolate(
//       distance,
//       [0, snapWidth],
//       [1, 0.85],
//       Extrapolate.CLAMP
//     );

//     return {
//       transform: [{ scale: withTiming(scale, { duration: 200 }) }],
//       opacity: withTiming(opacity, { duration: 200 }),
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           width: itemWidth,
//           marginRight: gap,
//           borderRadius: RFValue(16),
//           padding: RFValue(16),
//           borderWidth: 1,
//           backgroundColor: item.color,
//           borderColor: item.borderColor,
//         },
//         animatedCardStyle,
//       ]}
//     >
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: RFValue(6),
//         }}
//       >
//         <Text
//           style={{
//             fontSize: RFValue(16),
//             fontWeight: "700",
//             color: "#0b0b0b",
//           }}
//         >
//           {item.title}
//         </Text>
//         <ArrowUpRight size={18} color="#0b0b0b" />
//       </View>

//       <Text
//         style={{
//           fontSize: RFValue(13),
//           color: "#334155",
//           lineHeight: RFValue(18),
//         }}
//       >
//         {item.description}
//       </Text>
//     </Animated.View>
//   );
// }

// /* -------------------------------------------------------
//    DOT COMPONENT (fix hooks inside map)
// -------------------------------------------------------- */
// function DotItem({
//   index,
//   scrollX,
//   snapWidth,
// }: {
//   index: number;
//   scrollX: Animated.SharedValue<number>;
//   snapWidth: number;
// }) {
//   const dotStyle = useAnimatedStyle(() => {
//     const dist = Math.abs((index + 1) * snapWidth - scrollX.value);

//     const width = interpolate(dist, [0, snapWidth], [28, 8], Extrapolate.CLAMP);
//     const opacity = interpolate(
//       dist,
//       [0, snapWidth],
//       [1, 0.4],
//       Extrapolate.CLAMP
//     );
//     const scale = interpolate(
//       dist,
//       [0, snapWidth],
//       [1, 0.86],
//       Extrapolate.CLAMP
//     );

//     return {
//       width: withTiming(width, { duration: 200 }),
//       opacity: withTiming(opacity, { duration: 200 }),
//       transform: [{ scale: withTiming(scale, { duration: 200 }) }],
//       height: 8,
//       borderRadius: 999,
//       backgroundColor: "#111827",
//     };
//   });

//   return <Animated.View style={dotStyle} />;
// }

// /* -------------------------------------------------------
//    MAIN CAROUSEL
// -------------------------------------------------------- */
// export default function PromoCarousel({
//   data,
//   itemWidth = RFValue(260),
//   gap = 14,
//   autoScrollIntervalMs = 3000,
//   showDots = true,
// }: Props) {
//   const loopData = useMemo(() => {
//     if (data.length <= 1) return data;
//     const arr = [...data];
//     return [arr[arr.length - 1], ...arr, arr[0]];
//   }, [data]);

//   const realDataLength = data.length;
//   const snapWidth = itemWidth + gap;
//   const initialIndex = loopData.length > 1 ? 1 : 0;

//   const flatRef = useRef<FlatList<any>>(null);
//   const scrollX = useSharedValue(initialIndex * snapWidth);
//   const currentIndex = useSharedValue(initialIndex);

//   const onScroll = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollX.value = event.contentOffset.x;
//     },
//     onMomentumEnd: (event) => {
//       currentIndex.value = Math.round(event.contentOffset.x / snapWidth);
//     },
//   });

//   const scrollToIndex = (idx: number, animated = true) => {
//     if (!flatRef.current) return;
//     flatRef.current.scrollToOffset({
//       offset: idx * snapWidth,
//       animated,
//     });
//   };

//   useEffect(() => {
//     if (!flatRef.current) return;
//     if (initialIndex === 0) return;
//     setTimeout(() => scrollToIndex(initialIndex, false), 40);
//   }, []);

//   // JS infinite loop correction
//   useEffect(() => {
//     let raf: number;
//     let last = -1;

//     const check = () => {
//       const val = scrollX.value;
//       if (val === last) {
//         const idx = Math.round(val / snapWidth);

//         if (idx === 0) runOnJS(scrollToIndex)(realDataLength, false);
//         else if (idx === loopData.length - 1) runOnJS(scrollToIndex)(1, false);
//       } else {
//         last = val;
//         raf = requestAnimationFrame(check);
//       }
//     };

//     raf = requestAnimationFrame(check);
//     return () => cancelAnimationFrame(raf);
//   }, [realDataLength, loopData.length]);

//   // Auto-scroll
//   useEffect(() => {
//     if (!autoScrollIntervalMs || loopData.length <= 1) return;

//     const id = setInterval(() => {
//       const curr = Math.round(scrollX.value / snapWidth);
//       runOnJS(scrollToIndex)(curr + 1);
//     }, autoScrollIntervalMs);

//     return () => clearInterval(id);
//   }, [autoScrollIntervalMs, loopData.length]);

//   /* -------------------------------------------------------
//      FIXED renderItem
//   -------------------------------------------------------- */
//   const renderItem = ({ item, index }: ListRenderItemInfo<PromoItem>) => (
//     <PromoCardItem
//       item={item}
//       index={index}
//       itemWidth={itemWidth}
//       gap={gap}
//       scrollX={scrollX}
//       snapWidth={snapWidth}
//     />
//   );

//   return (
//     <View>
//       <AnimatedFlatList
//         ref={flatRef}
//         data={loopData}
//         horizontal
//         keyExtractor={(it: PromoItem, idx) => `${it.id}-${idx}`}
//         renderItem={renderItem}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingHorizontal: (screenW - itemWidth) / 2,
//         }}
//         snapToInterval={snapWidth}
//         decelerationRate="fast"
//         bounces={false}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//       />

//       {showDots && (
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             marginTop: 10,
//             gap: 8,
//           }}
//         >
//           {Array.from({ length: realDataLength }).map((_, i) => (
//             <DotItem
//               key={i}
//               index={i}
//               scrollX={scrollX}
//               snapWidth={snapWidth}
//             />
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }
