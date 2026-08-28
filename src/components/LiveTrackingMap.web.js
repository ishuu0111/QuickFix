import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import {
  resolveAccurateLocation,
  calculateDistanceKm,
  generateRouteWaypoints,
  getWorkerOriginLocation,
} from "../services/mappls";

/**
 * High-performance, flicker-free Live Tracking Map with realistic Bike / Car icon,
 * exact Marturu / local coordinates, smooth vehicle animation, and route polyline.
 */
export default function LiveTrackingMap({
  origin,
  destination,
  workerName = "Arjun Mehta",
  height = 420,
  style,
  onEtaUpdate,
  onDistanceUpdate,
}) {
  const { theme, user } = useApp();
  const iframeRef = useRef(null);
  const [vehicleType, setVehicleType] = useState("bike"); // 'bike' | 'car'
  const [isFollowing, setIsFollowing] = useState(true);

  // Accurately resolve user house coordinates (handles Marturu or user's GPS accurately)
  const userHouseCoords = useMemo(() => {
    if (destination && typeof destination.latitude === "number" && typeof destination.longitude === "number") {
      return {
        latitude: destination.latitude,
        longitude: destination.longitude,
        address: destination.address || user?.location || "Marturu, Andhra Pradesh",
      };
    }
    return resolveAccurateLocation(user?.location, user?.coords);
  }, [user?.location, user?.coords, destination]);

  const userAddressText = userHouseCoords.address || user?.location || "Marturu, Andhra Pradesh";

  // Worker hub dispatch point near user's locality
  const workerOriginCoords = useMemo(() => {
    if (origin && typeof origin.latitude === "number" && typeof origin.longitude === "number") {
      return {
        latitude: origin.latitude,
        longitude: origin.longitude,
        address: origin.address || "QuickFix Express Hub, Marturu",
      };
    }
    return getWorkerOriginLocation(userHouseCoords, user?.location);
  }, [origin, userHouseCoords, user?.location]);

  const workerHubText = workerOriginCoords.address || "QuickFix Express Hub, Marturu";

  const totalDistanceKm = calculateDistanceKm(
    workerOriginCoords.latitude,
    workerOriginCoords.longitude,
    userHouseCoords.latitude,
    userHouseCoords.longitude
  );

  const waypoints = useMemo(() => {
    return generateRouteWaypoints(workerOriginCoords, userHouseCoords, 30);
  }, [workerOriginCoords, userHouseCoords]);

  // Center & bounds
  const centerLat = isFinite((workerOriginCoords.latitude + userHouseCoords.latitude) / 2)
    ? (workerOriginCoords.latitude + userHouseCoords.latitude) / 2
    : 15.9994;
  const centerLng = isFinite((workerOriginCoords.longitude + userHouseCoords.longitude) / 2)
    ? (workerOriginCoords.longitude + userHouseCoords.longitude) / 2
    : 80.1118;
  const routeWaypointsJson = JSON.stringify(waypoints);

  // Self-contained, ultra-smooth Leaflet Map HTML (Runs ONCE without iframe reloads)
  const leafletHTML = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; background: #e2e8f0; }

    /* Pulsing radar effect around worker vehicle */
    @keyframes radar-pulse {
      0% { transform: scale(0.8); opacity: 0.9; }
      50% { transform: scale(1.6); opacity: 0.35; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .vehicle-marker-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
    }

    .radar-ring {
      position: absolute;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: rgba(13, 110, 253, 0.4);
      animation: radar-pulse 2s infinite ease-out;
      pointer-events: none;
    }

    .vehicle-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #0D6EFD;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 14px rgba(13, 110, 253, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 20px;
      cursor: pointer;
      z-index: 2;
      transition: transform 0.2s ease;
    }

    .destination-badge {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #22C55E;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      cursor: pointer;
    }

    .hub-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #3B82F6;
      border: 2px solid #FFFFFF;
      box-shadow: 0 3px 10px rgba(59, 130, 246, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
    }

    .custom-label-tooltip {
      background: #0F172A !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 4px 9px !important;
      font-size: 11px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    }
    .custom-label-tooltip::before {
      border-top-color: #0F172A !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    var waypoints = ${routeWaypointsJson};
    var origin = { lat: ${workerOriginCoords.latitude}, lng: ${workerOriginCoords.longitude} };
    var dest = { lat: ${userHouseCoords.latitude}, lng: ${userHouseCoords.longitude} };
    var workerName = "${String(workerName).replace(/"/g, '\\"')}";
    var userAddress = "${String(userAddressText).replace(/"/g, '\\"')}";
    var hubAddress = "${String(workerHubText).replace(/"/g, '\\"')}";
    var currentVehicle = "${vehicleType}";

    // Initialize Leaflet Map
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([${centerLat}, ${centerLng}], 15);

    // OpenStreetMap Standard Tiles (completely free, no API key needed)
    var streetTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });
    streetTiles.addTo(map);

    // Ensure map tiles properly calculate container dimensions
    setTimeout(function() {
      if (map) map.invalidateSize();
    }, 150);

    window.addEventListener('resize', function() {
      if (map) map.invalidateSize();
    });

    // Route Polyline (Full planned path - subtle blue dash)
    var pathCoords = waypoints.map(function(p) { return [p.latitude, p.longitude]; });
    var plannedRoute = L.polyline(pathCoords, {
      color: '#3B82F6',
      weight: 5,
      opacity: 0.65,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Completed Route Polyline (Solid bright green)
    var completedRoute = L.polyline([], {
      color: '#22C55E',
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // 1. Origin Hub Marker (🏬)
    var hubIcon = L.divIcon({
      html: '<div class="hub-badge">🏬</div>',
      className: '',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker([origin.lat, origin.lng], { icon: hubIcon })
      .addTo(map)
      .bindTooltip('<b>Dispatch Hub</b><br>' + hubAddress, { permanent: false, direction: 'top', className: 'custom-label-tooltip' });

    // 2. Destination User House Marker (🏠)
    var houseIcon = L.divIcon({
      html: '<div class="destination-badge">🏠</div>',
      className: '',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
    L.marker([dest.lat, dest.lng], { icon: houseIcon })
      .addTo(map)
      .bindTooltip('<b>Your House</b><br>' + userAddress, { permanent: true, direction: 'top', className: 'custom-label-tooltip' });

    // 3. Worker Vehicle Marker (🛵 Bike / 🚗 Car)
    function getVehicleIconHtml(type) {
      var iconEmoji = type === 'car' ? '🚗' : '🛵';
      return '<div class="vehicle-marker-wrap">' +
             '  <div class="radar-ring"></div>' +
             '  <div class="vehicle-badge">' + iconEmoji + '</div>' +
             '</div>';
    }

    var workerIcon = L.divIcon({
      html: getVehicleIconHtml(currentVehicle),
      className: '',
      iconSize: [46, 46],
      iconAnchor: [23, 23]
    });

    var workerMarker = L.marker([origin.lat, origin.lng], { icon: workerIcon })
      .addTo(map)
      .bindTooltip(workerName + ' (On the way)', { permanent: true, direction: 'bottom', className: 'custom-label-tooltip', offset: [0, 14] });

    // Fit map bounds to show full route initially
    map.fitBounds([
      [origin.lat, origin.lng],
      [dest.lat, dest.lng]
    ], { padding: [50, 50] });

    // Smooth Vehicle Animation along waypoints
    var currentStep = 0;
    var totalSteps = waypoints.length - 1;
    var animProgress = 0.08;

    function animateMovement() {
      // Steady realistic driving speed
      animProgress += 0.00035;
      if (animProgress >= 0.98) animProgress = 0.98;

      var stepFloat = animProgress * totalSteps;
      var lowerIdx = Math.floor(stepFloat);
      var upperIdx = Math.min(lowerIdx + 1, totalSteps);
      var fraction = stepFloat - lowerIdx;

      var p1 = waypoints[lowerIdx];
      var p2 = waypoints[upperIdx];

      var curLat = p1.latitude + (p2.latitude - p1.latitude) * fraction;
      var curLng = p1.longitude + (p2.longitude - p1.longitude) * fraction;

      workerMarker.setLatLng([curLat, curLng]);

      // Update completed route trail
      var completedPts = pathCoords.slice(0, lowerIdx + 1);
      completedPts.push([curLat, curLng]);
      completedRoute.setLatLngs(completedPts);

      // Send live ETA update to parent React Native component
      var remainingRatio = Math.max(0, 1 - animProgress);
      var totalKm = ${totalDistanceKm};
      var remainingKm = (totalKm * remainingRatio).toFixed(1);
      var etaMins = Math.max(1, Math.round(remainingKm * 4.2));

      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(JSON.stringify({
          type: 'LOCATION_UPDATE',
          remainingKm: parseFloat(remainingKm),
          etaMins: etaMins,
          progress: animProgress,
          arrived: animProgress >= 0.95
        }), '*');
      }

      if (animProgress < 0.98) {
        requestAnimationFrame(animateMovement);
      }
    }

    // Start movement animation after initial load
    setTimeout(function() {
      animateMovement();
    }, 600);

    // Listen for messages from parent (switch vehicle to car/bike, replay route, recenter)
    window.addEventListener('message', function(event) {
      try {
        var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;
        if (data.type === 'CHANGE_VEHICLE') {
          currentVehicle = data.vehicle;
          workerMarker.setIcon(L.divIcon({
            html: getVehicleIconHtml(currentVehicle),
            className: '',
            iconSize: [46, 46],
            iconAnchor: [23, 23]
          }));
        } else if (data.type === 'REPLAY_ROUTE') {
          animProgress = 0.05;
          workerMarker.setLatLng([origin.lat, origin.lng]);
          completedRoute.setLatLngs([]);
          animateMovement();
        } else if (data.type === 'RECENTER') {
          map.fitBounds([
            [origin.lat, origin.lng],
            [dest.lat, dest.lng]
          ], { padding: [50, 50] });
        }
      } catch (e) {}
    });
  </script>
</body>
</html>`;
  }, [
    routeWaypointsJson,
    workerOriginCoords.latitude,
    workerOriginCoords.longitude,
    userHouseCoords.latitude,
    userHouseCoords.longitude,
    workerName,
    userAddressText,
    workerHubText,
    centerLat,
    centerLng,
    totalDistanceKm,
    vehicleType,
  ]);

  // Handle messages from iframe for dynamic ETA
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data && data.type === "LOCATION_UPDATE") {
          if (onEtaUpdate) onEtaUpdate(data.etaMins);
          if (onDistanceUpdate) onDistanceUpdate(data.remainingKm);
        }
      } catch (e) {}
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [onEtaUpdate, onDistanceUpdate]);

  const changeVehicle = (type) => {
    setVehicleType(type);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: "CHANGE_VEHICLE", vehicle: type }),
        "*"
      );
    }
  };

  const replayRoute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: "REPLAY_ROUTE" }),
        "*"
      );
    }
  };

  return (
    <View style={[styles.container, { height, backgroundColor: "#0F172A" }, style]}>
      {/* High-Performance, Persistent Interactive Map */}
      <iframe
        ref={iframeRef}
        title="Live Worker Tracking"
        srcDoc={leafletHTML}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />

      {/* Top Map Controls: Vehicle Mode Toggle [ 🛵 Bike ] [ 🚗 Car ] & Replay */}
      <View style={styles.topControlBar}>
        <View style={[styles.vehicleToggleCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.controlLabel, { color: theme.colors.subtitle }]}>VEHICLE:</Text>
          <Pressable
            onPress={() => changeVehicle("bike")}
            style={[
              styles.toggleBtn,
              vehicleType === "bike" && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={{ fontSize: 13 }}>🛵</Text>
            <Text
              style={[
                styles.toggleBtnText,
                { color: vehicleType === "bike" ? "#fff" : theme.colors.text },
              ]}
            >
              Bike
            </Text>
          </Pressable>

          <Pressable
            onPress={() => changeVehicle("car")}
            style={[
              styles.toggleBtn,
              vehicleType === "car" && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={{ fontSize: 13 }}>🚗</Text>
            <Text
              style={[
                styles.toggleBtnText,
                { color: vehicleType === "car" ? "#fff" : theme.colors.text },
              ]}
            >
              Car
            </Text>
          </Pressable>
        </View>

        {/* Right Badge: Live GPS Tracker */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.liveGpsBadge}>
            <View style={styles.blinkingDot} />
            <Text style={styles.liveGpsText}>LIVE GPS</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  topControlBar: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  vehicleToggleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginRight: 2,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: "800",
  },
  liveGpsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  blinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  liveGpsText: {
    color: "#fff",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  replayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
  },
  replayText: {
    fontSize: 11.5,
    fontWeight: "800",
  },
});