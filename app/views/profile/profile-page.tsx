// import AppButton from "@/components/button";
// import SafeAreaViewContainer from "@/components/safeareaview";
// import SectionHeader from "@/components/sectionheader";
// import { useTheme } from "@/contexts/themeContext";
// import { ColorScheme } from "@/utils";
// import { router } from "expo-router";
// import React from "react";
// import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";

// const ProfilePage = () => {
//   const { colors } = useTheme();
//   const profileStyles = styles(colors);

//   return (
//     <SafeAreaViewContainer>
//       <SectionHeader
//         rightIconSource={require("@/assets/icons/more-2-line.png")}
//         onRightIconPress={() => console.log("Right icon pressed")}
//       />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View className="h-[200px] bg-gray-500 flex items-center justify-center">
//           <Image
//             source={require("@/assets/images/profile-pic.png")} // Replace with actual profile pic path
//             className="w-32 h-32 rounded-full"
//           />
//         </View>
//         <View className="flex flex-col items-center -mt-16 bg-white rounded-t-3xl">
//           <Text style={profileStyles.title} className="pt-4">
//             Ibe Alex
//           </Text>
//           <Text style={profileStyles.subTitle} className="pb-4">
//             Verified Agent
//           </Text>
//           <Text style={profileStyles.subTitle}>📞 +234 912 7878</Text>
//           <Text style={profileStyles.subTitle}>✉️ ibe.alex@example.com</Text>
//           <View className="w-full px-4 py-6 border-t border-gray-300">
//             <AppButton
//               title="Upgrade to Featured Agent"
//               onPress={() => router.push("/upgrade")}
//               variant="secondary"
//             />
//             <Text className="pt-2 text-sm text-center text-gray-400">
//               Boost your profile with priority listings.
//             </Text>
//           </View>
//           <View className="w-full px-4 py-4">
//             <Text style={profileStyles.mediumTitle}>My Account</Text>
//             {/* Add more sections like Payments, Reviews, etc. as needed */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Payments</Text>
//             {/* Payment details UI */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Payment Details</Text>
//             {/* Payment details UI */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Your Reviews</Text>
//             {/* Reviews UI */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Refer a Friend</Text>
//             {/* Refer a Friend UI */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Security</Text>
//             {/* Security UI */}
//           </View>
//           <View className="flex-row justify-between w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Dark mode</Text>
//             <AppButton title="Toggle" onPress={() => {}} variant="secondary" />
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <Text style={profileStyles.mediumTitle}>Support</Text>
//             {/* Support UI */}
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <AppButton
//               title="Log out"
//               onPress={() => router.push("/login")}
//               variant="secondary"
//             />
//           </View>
//           <View className="w-full px-4 py-4 border-t border-gray-300">
//             <AppButton
//               title="Switch to Renter Mode"
//               onPress={() => router.push("/renter")}
//               variant="secondary"
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaViewContainer>
//   );
// };

// export default ProfilePage;

// const styles = (colors: ColorScheme) =>
//   StyleSheet.create({
//     container: {
//       backgroundColor: colors.background,
//     },
//     title: {
//       fontSize: RFValue(24),
//       lineHeight: RFValue(24),
//       fontWeight: "bold",
//     },
//     mediumTitle: {
//       fontSize: RFValue(16),
//       lineHeight: RFValue(24),
//     },
//     subTitle: {
//       fontSize: RFValue(14),
//       lineHeight: RFValue(20),
//       color: colors.slate[600],
//     },
//   });

export default function ProfilePage() {
  return <></>;
}
