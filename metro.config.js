// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

// 1. Point Metro transformer to react-native-svg-transformer
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

// 2. Remove .svg from assets and add it to source code extensions
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// 3. Wrap the final combined config with NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
