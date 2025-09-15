import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { spacesPosted } from "@/constants/home";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

const SpacesPosted = ({ layout }: { layout: "tiles" | "box" }) => {
  return (
    <View className="flex-1">
      <View className="py-2">
        <Filter size="large" />
      </View>
      <FlatList
        data={spacesPosted}
        renderItem={({ item }) =>
          layout === "box" ? (
            <>
              <HouseCard
                {...item}
                onPress={() => router.push("/views/place-details/[id]")}
              />
            </>
          ) : (
            <>
              <HouseCardTile
                imageSource={item.imageSource}
                name={item.title}
                location={item.location}
                price={item.price}
                badgeType={item.badgeType}
                duration={item.duration}
                onPress={() => router.push("/views/place-details/[id]")}
              />
            </>
          )
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4"
      />
    </View>
  );
};

export default SpacesPosted;
