import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Button from './Button';

export default function EmptyState({
  icon = 'file-tray-outline',
  title = 'Nothing here yet',
  subtitle = '',
  actionLabel,
  onAction,
}) {
  const { theme } = useApp();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.colors.primary + '12', borderRadius: theme.radius.xl },
        ]}
      >
        <Ionicons name={icon} size={44} color={theme.colors.primary} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>{subtitle}</Text>
      ) : null}
      {actionLabel && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: 20, width: 200 }} fullWidth={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  iconWrap: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
