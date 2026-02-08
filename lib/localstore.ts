import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

interface JwtDecoded {
  exp: number;
  [key: string]: unknown;
}

const secretKey = "mysecret";

if (!secretKey) {
  throw new Error(
    "Secret key is not defined. Please set REACT_APP_SECRET_KEY in your environment variables.",
  );
}

export const saveToLocalStore = async (
  key: string,
  value: string,
): Promise<void> => {
  await SecureStore.setItemAsync(key, value);
};

// Get plain value
export const getFromLocalStore = async (
  key: string,
): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

export const removeFromLocalStore = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

export const clearAll = async (changeWindow: boolean = true): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");

    if (changeWindow) {
      router.replace("/auth/login");
    }
  } catch (error) {
    console.error("Error clearing SecureStore:", error);
  }
};

// Clear specific key
export const clearKey = async (specificKey: string): Promise<void> => {
  await SecureStore.deleteItemAsync(specificKey);
};

// Token expiry checker
export const checkTokenExpiry = async (tokenStr?: string): Promise<boolean> => {
  let expireTime = 0;

  if (expireTime === 0) {
    try {
      if (tokenStr) {
        const decodedToken = jwtDecode<JwtDecoded>(tokenStr);
        expireTime = decodedToken.exp;
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      return true;
    }
  }

  return Date.now() >= expireTime * 1000;
};
