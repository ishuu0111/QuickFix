import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import Avatar from './Avatar';
import RatingStars from './RatingStars';
import { useApp } from '../context/AppContext';

export default function ProfessionalCard({ professional, onPress, style }) {
  const { theme } = useApp();

  return (
    <Card onPress={onPress} style={[styles.card, style]}>
      <Avatar
        name={professional.name}
        color={professional.avatarColor}
        size={56}
        verified={professional.verified}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{professional.name}</Text>
        <Text style={[styles.role, { color: theme.colors.subtitle }]}>
          {professional.role} • {professional.experience}
        </Text>
        <RatingStars rating={professional.rating} size={13} showValue count={professional.reviews} />
      </View>
      <View style={styles.metaCol}>
        <View style={styles.metaRow}>
          <Ionicons name="navigate-outline" size={13} color={theme.colors.primary} />
          <Text style={[styles.metaText, { color: theme.colors.primary }]}>{professional.distance}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={theme.colors.subtitle} />
          <Text style={[styles.metaText, { color: theme.colors.subtitle }]}>{professional.eta}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700' },
  role: { fontSize: 12, fontWeight: '500', marginVertical: 3 },
  metaCol: { alignItems: 'flex-end' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaText: { fontSize: 11, fontWeight: '700', marginLeft: 3 },
});
