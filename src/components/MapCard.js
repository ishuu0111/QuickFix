import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useApp } from '../context/AppContext';

let MapView, Marker, Polyline, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  // Native maps module - avoided on web to prevent bundling issues.
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapCard({
  origin,
  destination,
  worker,
  style,
  height = 260,
  interactive = true,
}) {
  const { theme } = useApp();

  const orig = origin || { latitude: 15.9895, longitude: 80.1035 };
  const dest = destination || { latitude: 15.9994, longitude: 80.1118 };

  const region = {
    latitude: ((orig.latitude || 15.9895) + (dest.latitude || 15.9994)) / 2,
    longitude: ((orig.longitude || 80.1035) + (dest.longitude || 80.1118)) / 2,
    latitudeDelta: Math.abs((orig.latitude || 15.9895) - (dest.latitude || 15.9994)) * 2.4 + 0.02,
    longitudeDelta: Math.abs((orig.longitude || 80.1035) - (dest.longitude || 80.1118)) * 2.4 + 0.02,
  };

  if (Platform.OS === 'web' || !MapView) {
    return (
      <View
        style={[
          styles.fallback,
          { height, backgroundColor: theme.colors.primary + '12', borderRadius: theme.radius.lg },
          style,
        ]}
      >
        <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Live Map Preview</Text>
        <Text style={{ color: theme.colors.subtitle, fontSize: 12, marginTop: 4 }}>
          Available on iOS / Android build
        </Text>
      </View>
    );
  }

  return (
    <View style={[{ height, borderRadius: theme.radius.lg, overflow: 'hidden' }, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker coordinate={origin} pinColor={theme.colors.success} title="You" />
        <Marker coordinate={destination} pinColor={theme.colors.primary} title="Professional" />
        {worker && <Marker coordinate={worker} title="Live location" />}
        <Polyline
          coordinates={[origin, destination]}
          strokeColor={theme.colors.primary}
          strokeWidth={4}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
