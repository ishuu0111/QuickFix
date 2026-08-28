import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function OTPInput({ length = 4, value, onChange }) {
  const { theme } = useApp();
  const inputs = useRef([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (text, index) => {
    const clean = text.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1) || '';
    const newValue = newDigits.join('').slice(0, length);
    onChange(newValue);

    if (clean && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputs.current[i] = ref)}
          value={digits[i]}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          style={[
            styles.box,
            {
              borderColor: digits[i] ? theme.colors.primary : theme.colors.border,
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderRadius: theme.radius.md,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  box: {
    width: 56,
    height: 60,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
  },
});
