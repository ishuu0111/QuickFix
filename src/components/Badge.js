import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function Badge({ label, tone = 'primary', size = 'md' }) {
  const { theme } = useApp();

  const toneColors = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    neutral: theme.colors.subtitle,
  };

  const color = toneColors[tone] || toneColors.primary;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: color + '1A',
          paddingVertical: size === 'sm' ? 3 : 5,
          paddingHorizontal: size === 'sm' ? 8 : 12,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize: size === 'sm' ? 11 : 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
  },
});
