import { ArrowUpRight } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

interface PromoCardProps {
  item: {
    title: string;
    description: string;
    color: string;
    borderColor: string;
  };
  animationValue: SharedValue<number>;
}

export default function PromoCard({ item, animationValue }: PromoCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.85, 1, 0.85]
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: RFValue(260),
          padding: 20,
          borderRadius: RFValue(18),
          backgroundColor: item.color,
          borderWidth: 1,
          borderColor: item.borderColor,
        },
        animatedStyle,
      ]}
      className="flex-col"
    >
      <View className="flex-row w-full justify-between items-center mb-2">
        <Text
          style={{ fontSize: RFValue(16) }}
          className="font-semibold text-black"
        >
          {item.title}
        </Text>

        <ArrowUpRight size={20} color="black" />
      </View>

      <Text
        style={{ fontSize: RFValue(13), lineHeight: RFValue(18) }}
        className="text-gray-600"
      >
        {item.description}
      </Text>
    </Animated.View>
  );
}
