import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function RatingStars({
  rating = 0,
  size = 16,
  editable = false,
  onChange,
  showValue = false,
  count,
}) {
  const { theme } = useApp();
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((s) => {
        const filled = s <= Math.round(rating);
        const StarComp = editable ? Pressable : View;
        return (
          <StarComp key={s} onPress={() => editable && onChange && onChange(s)} hitSlop={6}>
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? theme.colors.warning : theme.colors.subtitle}
              style={{ marginRight: 2 }}
            />
          </StarComp>
        );
      })}
      {showValue && (
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {rating.toFixed(1)}
          {count ? <Text style={{ color: theme.colors.subtitle }}> ({count})</Text> : null}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { marginLeft: 6, fontSize: 13, fontWeight: '700' },
});
