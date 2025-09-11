import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { spacesDrafts } from "@/constants/home";
import React from "react";
import { FlatList, View } from "react-native";

const SpacesDrafts = ({ layout }: { layout: "tiles" | "box" }) => {
  return (
    <View className="h-full">
      <View className="py-2">
        <Filter size="large" />
      </View>
      <FlatList
        data={spacesDrafts}
        renderItem={({ item }) =>
          layout === "box" ? (
            <>
              <HouseCard {...item} />
            </>
          ) : (
            <>
              <HouseCardTile
                imageSource={item.imageSource}
                name={item.title}
                location={item.location}
                price={item.price}
                duration={item.duration}
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

export default SpacesDrafts;
