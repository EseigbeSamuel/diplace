import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { SpacesNearby } from "@/constants/home";
import React from "react";
import { FlatList, View } from "react-native";

const Apartments = () => {
  return (
    <SafeAreaViewContainer>
      <View>
        <SectionHeader title="Apartments" />
        <View className="py-4">
          <Filter size="small" />
        </View>
      </View>
      <FlatList
        data={SpacesNearby}
        renderItem={({ item }) => (
          <View className="pb-8">
            <HouseCard {...item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaViewContainer>
  );
};

export default Apartments;
