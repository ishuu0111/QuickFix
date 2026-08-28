import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';

export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  const { theme } = useApp();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <Animated.View style={styles.card}>
      <Skeleton height={110} radius={22} style={{ marginBottom: 10 }} />
      <Skeleton height={14} width="80%" style={{ marginBottom: 6 }} />
      <Skeleton height={12} width="50%" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: 180, marginRight: 14 },
});
