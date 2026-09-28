import { ImageSourcePropType } from "react-native";

export const imageSourceFilter = (imageSource?: ImageSourcePropType | string) => {
    const remoteImageUri = typeof imageSource === "string"
        ? imageSource
        : imageSource &&
            typeof imageSource === "object" &&
            "uri" in imageSource &&
            typeof imageSource.uri === "string"
            ? imageSource.uri
            : "";

    return remoteImageUri.length >= 7
        ? typeof imageSource === "string"
            ? { uri: imageSource }
            : imageSource
        : require("@/assets/images/diplace.jpg")
}