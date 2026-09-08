import React from "react";
import { View, Text, Image, Pressable, Linking } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";
import { ActivityDetailUser } from "@/types";
import { router } from "expo-router";

interface ContactCardProps {
  role: string;
  status: string;
  /** The person to display — lister for renters, renter (user) for agents */
  contact?: ActivityDetailUser;
}

const ContactCard: React.FC<ContactCardProps> = ({ role, status, contact }) => {
  const { colors } = useTheme();

  const handleChat = () => {
    if (contact?.public_id) {
      router.push({
        pathname: "/(tabs)/chats",
      });
    } else {
      router.push("/(tabs)/chats");
    }
  };

  const handleCall = () => {
    if (contact?.phone_number) {
      Linking.openURL(`tel:${contact.phone_number}`).catch(() => {
        router.push({
          pathname: "/views/call",
          params: { calleeId: contact?.public_id, name: displayName },
        });
      });
    } else {
      router.push({
        pathname: "/views/call",
        params: { calleeId: contact?.public_id, name: displayName },
      });
    }
  };

  const label =
    role === "renter"
      ? "Listed By:"
      : status === "booked"
        ? "Booked By:"
        : status === "reserved"
          ? "Reserved By:"
          : "Scheduled By:";

  const displayName = contact
    ? `${contact.first_name} ${contact.last_name}`.trim()
    : "—";

  const avatarUri =
    contact?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const isVerified = contact?.status === "verified";

  return (
    <View className="py-4 flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-3">
        <Image
          source={{ uri: avatarUri }}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: RFValue(20),
            backgroundColor: colors.slate[200],
          }}
        />
        <View>
          <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
            {label}
          </Text>
          <View className="flex flex-row items-center gap-1">
            <Text
              style={{
                color: colors.slate[650],
                fontSize: RFValue(15.5),
              }}
              className="font-bold"
            >
              {displayName}
            </Text>
            {isVerified && (
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={{ width: 14, height: 14 }}
              />
            )}
          </View>
        </View>
      </View>

      <View className="flex flex-row gap-3">
        <Pressable
          onPress={handleChat}
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
          onPress={handleCall}
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
