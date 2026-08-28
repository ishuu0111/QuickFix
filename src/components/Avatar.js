import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 48, color, verified = false, icon }) {
  const { theme } = useApp();
  const base = color || theme.colors.primary;

  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={[base, base + 'CC']}
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={size * 0.5} color="#fff" />
        ) : (
          <Text style={[styles.text, { fontSize: size * 0.36 }]}>{getInitials(name)}</Text>
        )}
      </LinearGradient>
      {verified && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.success,
              width: size * 0.32,
              height: size * 0.32,
              borderRadius: size * 0.16,
              borderColor: theme.colors.card,
            },
          ]}
        >
          <Ionicons name="checkmark" size={size * 0.2} color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
