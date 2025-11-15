import { ImageSourcePropType } from "react-native";

export interface Space {
  id: string;
  imageSource: ImageSourcePropType;
  title: string;
  location: string;
  price: string;
  badgeType?: "verified" | "hot" | "diplace"; // Optional, based on FeaturedSpaces
  duration?: string; // Optional, based on FeaturedSpaces and SpacesNearby
}

export interface Tab {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface SectionData {
  type?: string; // For the header section
  [key: string]: any; // Allow other properties for flexibility
}

export interface Section {
  title: string;
  data: SectionData[] | Space[] | Tab[];
  renderItem: ({
    item,
  }: {
    item: SectionData | Space | Tab;
  }) => React.ReactElement;
  keyExtractor?: (item: SectionData | Space | Tab, index: number) => string;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  header?: () => React.ReactElement;
  footer?: () => React.ReactElement;
}
export interface HeaderTab {
  id: string;
  label: string;
}
