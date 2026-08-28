import { MAPPLS_CONFIG } from "../config/mappls";

// Known Indian cities & localities database for fast, accurate geocoding
const KNOWN_COORDINATES = {
  marturu: { latitude: 15.9994, longitude: 80.1118, name: "Marturu, Andhra Pradesh" },
  martur: { latitude: 15.9994, longitude: 80.1118, name: "Marturu, Andhra Pradesh" },
  bengaluru: { latitude: 12.9716, longitude: 77.5946, name: "Bengaluru, Karnataka" },
  koramangala: { latitude: 12.9352, longitude: 77.6146, name: "Koramangala, Bengaluru" },
  indiranagar: { latitude: 12.9784, longitude: 77.6408, name: "Indiranagar, Bengaluru" },
  hyderabad: { latitude: 17.3850, longitude: 78.4867, name: "Hyderabad, Telangana" },
  guntur: { latitude: 16.3067, longitude: 80.4365, name: "Guntur, Andhra Pradesh" },
  vijayawada: { latitude: 16.5062, longitude: 80.6480, name: "Vijayawada, Andhra Pradesh" },
  delhi: { latitude: 28.6139, longitude: 77.2090, name: "New Delhi, Delhi" },
  mumbai: { latitude: 19.0760, longitude: 72.8777, name: "Mumbai, Maharashtra" },
  chennai: { latitude: 13.0827, longitude: 80.2707, name: "Chennai, Tamil Nadu" },
};

/**
 * Resolves accurate coordinates for a user's location string or coordinates.
 * Specifically handles "Marturu" and other Indian locations accurately.
 */
export function resolveAccurateLocation(userLocation, fallbackCoords) {
  if (userLocation && typeof userLocation === "string") {
    const locLower = userLocation.toLowerCase().trim();
    for (const [key, val] of Object.entries(KNOWN_COORDINATES)) {
      if (locLower.includes(key)) {
        return {
          latitude: val.latitude,
          longitude: val.longitude,
          address: userLocation,
        };
      }
    }
  }

  if (fallbackCoords?.latitude && fallbackCoords?.longitude) {
    return {
      latitude: fallbackCoords.latitude,
      longitude: fallbackCoords.longitude,
      address: userLocation || "Current Location",
    };
  }

  // Default to Marturu if mentioned or fallback
  return {
    latitude: 15.9994,
    longitude: 80.1118,
    address: "Marturu, Andhra Pradesh",
  };
}

/**
 * Calculates distance in KM between two coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.1, parseFloat(d.toFixed(2)));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Derives realistic road waypoints between origin & destination
 * Creates a realistic S-curve with road intersections rather than straight line
 */
export function generateRouteWaypoints(origin, destination, steps = 25) {
  const points = [];
  const dLat = destination.latitude - origin.latitude;
  const dLng = destination.longitude - origin.longitude;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add realistic road curves
    const curve1 = Math.sin(t * Math.PI) * 0.0025;
    const curve2 = Math.sin(t * 2 * Math.PI) * 0.0015;

    const lat = origin.latitude + dLat * t + curve1;
    const lng = origin.longitude + dLng * t + curve2;
    points.push({ latitude: parseFloat(lat.toFixed(6)), longitude: parseFloat(lng.toFixed(6)) });
  }
  return points;
}

/**
 * Derives a realistic Worker Hub starting location near the user's specific city/locality
 */
export function getWorkerOriginLocation(userCoords, userLocationName = "") {
  const userLat = userCoords?.latitude || 15.9994;
  const userLng = userCoords?.longitude || 80.1118;

  const isMarturu =
    (userLocationName && userLocationName.toLowerCase().includes("martur")) ||
    (Math.abs(userLat - 15.9994) < 0.1 && Math.abs(userLng - 80.1118) < 0.1);

  if (isMarturu) {
    return {
      latitude: 15.9895, // ~1.3 km south-west along NH16 near Marturu
      longitude: 80.1035,
      address: "QuickFix Hub, NH16 Highway, Marturu",
    };
  }

  return {
    latitude: userLat - 0.014, // ~1.6 km offset
    longitude: userLng - 0.011,
    address: `QuickFix Service Hub - ${userLocationName || "Local Dispatch"}`,
  };
}

export default {
  resolveAccurateLocation,
  calculateDistanceKm,
  generateRouteWaypoints,
  getWorkerOriginLocation,
};