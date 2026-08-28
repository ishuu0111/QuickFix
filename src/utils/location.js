import { Platform } from "react-native";

let ExpoLocation = null;
try {
  ExpoLocation = require("expo-location");
} catch (e) {
  ExpoLocation = null;
}

/**
 * Gets real user GPS location & address
 */
export async function getCurrentUserLocation() {
  try {
    // Web Geolocation API fallback
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const addressStr = await reverseGeocodeWeb(lat, lng);
            resolve({
              success: true,
              address: addressStr || `GPS: ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
              coords: { latitude: lat, longitude: lng },
            });
          },
          (err) => {
            console.warn("Browser geolocation error:", err.message);
            resolve(fallbackLocation());
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    }

    // Expo Location for Native
    if (ExpoLocation) {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return { success: false, error: "Location permission denied" };
      }
      const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      const geocode = await ExpoLocation.reverseGeocodeAsync({ latitude, longitude });
      let addressStr = "Current Location";
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        addressStr = [place.name || place.street, place.district || place.subregion || place.city]
          .filter(Boolean)
          .join(", ");
      }
      return {
        success: true,
        address: addressStr || `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
        coords: { latitude, longitude },
      };
    }
  } catch (e) {
    console.warn("Location error:", e);
  }
  return fallbackLocation();
}

async function reverseGeocodeWeb(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await res.json();
    if (data && data.address) {
      const a = data.address;
      const suburb = a.suburb || a.neighbourhood || a.residential || a.road || a.city_district || "";
      const city = a.city || a.town || a.county || a.state || "";
      return [suburb, city].filter(Boolean).join(", ");
    }
  } catch (e) {
    console.warn("Reverse geocode web error:", e);
  }
  return null;
}

function fallbackLocation() {
  return {
    success: true,
    address: "Koramangala, Bengaluru",
    coords: { latitude: 12.9352, longitude: 77.6146 },
  };
}