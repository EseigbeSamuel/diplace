const fs = require("fs");
const path = require("path");

const appJson = require("./app.json");

const readEnvFile = (fileName) => {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return {};

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return acc;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return acc;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      acc[key] = value.replace(/^["']|["']$/g, "");
      return acc;
    }, {});
};

const localEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
};

const googleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  localEnv.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
  localEnv.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "";

module.exports = () => ({
  ...appJson.expo,
  android: {
    ...appJson.expo.android,
    config: {
      ...appJson.expo.android?.config,
      googleMaps: {
        ...appJson.expo.android?.config?.googleMaps,
        apiKey: googleMapsApiKey,
      },
    },
  },
  extra: {
    ...appJson.expo.extra,
    googleMapsApiKey,
  },
});

