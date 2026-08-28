import React from 'react';
import { View, Modal as RNModal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';

export default function Modal({ visible, onClose, children, dismissable = true }) {
  const { theme } = useApp();

  if (!visible) return null;

  return (
    <RNModal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissable ? onClose : undefined}
        />
        <Animated.View
          entering={ZoomIn.duration(220)}
          style={[
            styles.card,
            { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl },
            theme.shadow.card,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    padding: 24,
  },
});
