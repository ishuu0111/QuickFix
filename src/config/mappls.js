/**
 * Mappls / MapmyIndia API Configuration
 * Supports Indian vector maps, geocoding, and route tracking.
 */
export const MAPPLS_CONFIG = {
  // Mappls (MapmyIndia) API Key
  apiKey: process.env.EXPO_PUBLIC_MAPPLS_API_KEY || "58ad9116e04d4f647bc394a1122a2e4b",
  clientSecret: process.env.EXPO_PUBLIC_MAPPLS_CLIENT_SECRET || "",
  
  // Mappls Tile URLs & Endpoints
  tileUrl: "https://apis.mappls.com/advancedmaps/v1/{key}/subtle_night/{z}/{x}/{y}.png",
  restBaseUrl: "https://apis.mappls.com/advancedmaps/v1",
  routeUrl: "https://apis.mappls.com/advancedmaps/v1/{key}/route_adv/driving",
};

export default MAPPLS_CONFIG;
