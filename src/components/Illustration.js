import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';

// A lightweight, dependency-free "illustration" built from gradients + icons + reanimated
// motion. Used in place of static image assets across splash / empty / success screens.
export function PulsingBadge({ icon = 'construct', size = 140, gradient }) {
  const { theme } = useApp();
  const scale = useSharedValue(1);
  const ring = useSharedValue(0.85);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    ring.value = withRepeat(withTiming(1.35, { duration: 1600, easing: Easing.out(Easing.ease) }), -1);
    ringOpacity.value = withRepeat(withTiming(0, { duration: 1600 }), -1);
  }, []);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ring.value }],
    opacity: ringOpacity.value,
  }));

  const colors = gradient || theme.gradients.primary;

  return (
    <View style={[styles.center, { width: size * 1.6, height: size * 1.6 }]}>
      <Animated.View
        style={[
          ringStyle,
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors[1],
          },
        ]}
      />
      <Animated.View style={circleStyle}>
        <LinearGradient
          colors={colors}
          style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Ionicons name={icon} size={size * 0.42} color="#fff" />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

export function OrbitSearchIllustration({ icon = 'construct', size = 180 }) {
  const { theme } = useApp();
  const rotation = useSharedValue(0);
  const dotRotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1);
    dotRotation.value = withRepeat(withTiming(-360, { duration: 3000, easing: Easing.linear }), -1);
  }, []);

  const orbitStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${dotRotation.value}deg` }] }));

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={[
          styles.orbitRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.colors.primary + '30',
          },
        ]}
      />
      <View
        style={[
          styles.orbitRing,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            borderColor: theme.colors.primary + '50',
          },
        ]}
      />
      <Animated.View style={[StyleSheet.absoluteFill, orbitStyle, styles.center]}>
        <View
          style={[
            styles.orbitDot,
            { backgroundColor: theme.colors.accent, marginLeft: size * 0.42 },
          ]}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, dotStyle, styles.center]}>
        <View
          style={[
            styles.orbitDot,
            { backgroundColor: theme.colors.secondary, marginTop: -size * 0.3 },
          ]}
        />
      </Animated.View>
      <LinearGradient
        colors={theme.gradients.primary}
        style={[styles.circle, { width: size * 0.46, height: size * 0.46, borderRadius: (size * 0.46) / 2 }]}
      >
        <Ionicons name={icon} size={size * 0.2} color="#fff" />
      </LinearGradient>
    </View>
  );
}

export function SuccessCheck({ size = 120 }) {
  const { theme } = useApp();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.8)) });
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <LinearGradient
        colors={theme.gradients.accent}
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Ionicons name="checkmark" size={size * 0.5} color="#fff" />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  circle: { alignItems: 'center', justifyContent: 'center' },
  orbitRing: { position: 'absolute', borderWidth: 1.5, borderStyle: 'dashed' },
  orbitDot: { width: 12, height: 12, borderRadius: 6 },
});
