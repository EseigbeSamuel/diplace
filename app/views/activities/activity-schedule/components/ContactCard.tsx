import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";

interface ContactCardProps {
  role: string;
  status: string;
  isEventCenter: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ role, status, isEventCenter }) => {
  const { colors } = useTheme();

  return (
    <View className="py-4 flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-3">
        <Image
          source={require("@/assets/images/sammy.jpg")}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: RFValue(20),
          }}
        />
        <View>
          <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
            {role === "renter"
              ? "Listed By:"
              : status === "booked"
                ? "Booked By:"
                : status === "reserved"
                  ? "Reserved By:"
                  : "Scheduled By:"}
          </Text>
          <View className="flex flex-row items-center gap-1">
            <Text
              style={{
                color: colors.slate[650],
                fontSize: RFValue(15.5),
              }}
              className="font-bold"
            >
              {role === "renter" ? (isEventCenter ? "Atraz Palace" : "Ibe Alex") : "Sammy Kalu"}
            </Text>
            <Image
              source={require("@/assets/icons/badge-check-green.png")}
              style={{ width: 14, height: 14 }}
            />
          </View>
        </View>
      </View>

      <View className="flex flex-row gap-3">
        <Pressable
          style={{ backgroundColor: colors.slate[150] }}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <Image
            source={require("@/assets/icons/Chat - Iconly Pro.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[650] }}
          />
        </Pressable>
        <Pressable
          style={{ backgroundColor: colors.slate[150] }}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <Image
            source={require("@/assets/icons/calling.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[650] }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ContactCard;
