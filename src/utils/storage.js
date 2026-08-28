import { Platform } from "react-native";

// Safe cross-platform storage helper (AsyncStorage for native, localStorage for Web fallback)
let AsyncStorageModule = null;
try {
  AsyncStorageModule = require("@react-native-async-storage/async-storage").default;
} catch (e) {
  AsyncStorageModule = null;
}

export const Storage = {
  async getItem(key) {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (AsyncStorageModule) {
        return await AsyncStorageModule.getItem(key);
      }
    } catch (e) {
      console.warn("Storage getItem error:", e);
    }
    return null;
  },

  async setItem(key, value) {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      if (AsyncStorageModule) {
        await AsyncStorageModule.setItem(key, value);
      }
    } catch (e) {
      console.warn("Storage setItem error:", e);
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      if (AsyncStorageModule) {
        await AsyncStorageModule.removeItem(key);
      }
    } catch (e) {
      console.warn("Storage removeItem error:", e);
    }
  },
};

export default Storage;
