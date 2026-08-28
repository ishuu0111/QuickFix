import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search for services...',
  onFilterPress,
  editable = true,
  onPress,
}) {
  const { theme } = useApp();

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
        },
        theme.shadow.soft,
      ]}
    >
      <Ionicons name="search" size={20} color={theme.colors.subtitle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtitle}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
        style={[styles.input, { color: theme.colors.text }]}
      />
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={[styles.filterBtn, { backgroundColor: theme.colors.primary + '14' }]}
        >
          <Ionicons name="options-outline" size={18} color={theme.colors.primary} />
        </Pressable>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
