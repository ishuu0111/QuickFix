import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function CategoryCard({ category, onPress, size = 'md' }) {
  const { theme } = useApp();
  const dim = size === 'sm' ? 56 : 64;

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View
        style={[
          styles.iconWrap,
          {
            width: dim,
            height: dim,
            borderRadius: theme.radius.md,
            backgroundColor: category.color + '17',
          },
        ]}
      >
        <Ionicons name={category.icon} size={dim * 0.42} color={category.color} />
      </View>
      <Text
        numberOfLines={2}
        style={[styles.label, { color: theme.colors.text, width: dim + 16 }]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginRight: 16 },
  iconWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
