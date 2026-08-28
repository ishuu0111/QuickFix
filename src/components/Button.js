import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  title,
  onPress,
  variant = 'primary', // primary | outline | ghost | success | danger
  size = 'md', // sm | md | lg
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}) {
  const { theme } = useApp();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const heights = { sm: 42, md: 52, lg: 58 };
  const fontSizes = { sm: 14, md: 16, lg: 17 };
  const height = heights[size];

  const isDisabled = disabled || loading;

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={fontSizes[size] + 4}
              color={
                variant === 'outline' || variant === 'ghost' || variant === 'light'
                  ? theme.colors.primary
                  : '#fff'
              }
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              styles.text,
              { fontSize: fontSizes[size] },
              variant === 'outline' || variant === 'ghost' || variant === 'light'
                ? { color: theme.colors.primary }
                : { color: '#fff' },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={fontSizes[size] + 4}
              color={
                variant === 'outline' || variant === 'ghost' || variant === 'light'
                  ? theme.colors.primary
                  : '#fff'
              }
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </View>
  );

  const baseStyle = [
    styles.base,
    { height, borderRadius: theme.radius.lg, opacity: isDisabled ? 0.6 : 1 },
    fullWidth && { width: '100%' },
    style,
  ];

  if (variant === 'light') {
    return (
      <AnimatedPressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[baseStyle, animatedStyle, { backgroundColor: '#fff' }, theme.shadow.soft]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  if (variant === 'outline') {
    return (
      <AnimatedPressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          baseStyle,
          animatedStyle,
          { borderWidth: 1.5, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
        ]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <AnimatedPressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[baseStyle, animatedStyle, { backgroundColor: theme.colors.primary + '14' }]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  const gradientMap = {
    primary: theme.gradients.primary,
    success: theme.gradients.accent,
    danger: ['#F87171', '#EF4444'],
  };

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, fullWidth && { width: '100%' }]}
    >
      <LinearGradient
        colors={gradientMap[variant] || gradientMap.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, theme.shadow.button]}
      >
        {content}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});
