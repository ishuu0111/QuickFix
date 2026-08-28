import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useApp } from '../context/AppContext';

export default function ServiceCard({ service, onPress, horizontal = false, fillWidth = false }) {
  const { theme } = useApp();
  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);

  const verticalStyle = fillWidth
    ? [styles.verticalCard, { width: '100%', marginRight: 0 }]
    : styles.verticalCard;

  return (
    <Card
      onPress={onPress}
      padded={false}
      style={horizontal ? styles.horizontalCard : verticalStyle}
    >
      <View
        style={[
          styles.imagePlaceholder,
          horizontal ? styles.imageHorizontal : styles.imageVertical,
          { backgroundColor: service.color + '17' },
        ]}
      >
        <Ionicons name={service.icon} size={horizontal ? 30 : 38} color={service.color} />
        {discount > 0 && (
          <View style={[styles.discountTag, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.colors.text }]}>
          {service.name}
        </Text>
        <Text style={[styles.category, { color: theme.colors.subtitle }]}>{service.category}</Text>
        <View style={styles.rowBetween}>
          <RatingStars rating={service.rating} size={13} showValue count={service.reviews} />
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.colors.text }]}>₹{service.price}</Text>
            {service.originalPrice > service.price && (
              <Text style={[styles.originalPrice, { color: theme.colors.subtitle }]}>
                ₹{service.originalPrice}
              </Text>
            )}
          </View>
          <Badge label={service.duration} tone="neutral" size="sm" />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  verticalCard: {
    width: 180,
    marginRight: 14,
    overflow: 'hidden',
  },
  horizontalCard: {
    flexDirection: 'row',
    marginBottom: 14,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageVertical: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageHorizontal: {
    width: 100,
    height: 118,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  info: { padding: 12, flex: 1 },
  name: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  category: { fontSize: 11, fontWeight: '500', marginBottom: 6 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 15, fontWeight: '800', marginRight: 6 },
  originalPrice: { fontSize: 12, textDecorationLine: 'line-through' },
});
