import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Header, Card, Button } from '../components';

export default function SavedAddressesScreen({ navigation }) {
  const { theme, addresses, selectedAddressId, setSelectedAddressId } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Saved Addresses" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListFooterComponent={
          <Pressable style={[styles.addBtn, { borderColor: theme.colors.primary }]}>
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 14, marginLeft: 8 }}>
              Add New Address
            </Text>
          </Pressable>
        }
        renderItem={({ item, index }) => {
          const active = selectedAddressId === item.id;
          return (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
              <Card
                onPress={() => setSelectedAddressId(item.id)}
                style={[styles.card, active && { borderColor: theme.colors.primary, borderWidth: 1.5 }]}
              >
                <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '14' }]}>
                  <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{item.label}</Text>
                  <Text style={[styles.line, { color: theme.colors.subtitle }]}>{item.line}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />}
              </Card>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '700' },
  line: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 6,
  },
});
