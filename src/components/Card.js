import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useApp } from '../context/AppContext';

export default function Card({ children, style, onPress, padded = true, glass = false }) {
  const { theme } = useApp();
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: glass ? theme.colors.card + 'E6' : theme.colors.card,
          borderRadius: theme.radius.lg,
          padding: padded ? theme.spacing.md : 0,
          borderColor: theme.colors.border,
        },
        theme.shadow.card,
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
