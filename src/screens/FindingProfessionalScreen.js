import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Button } from '../components';
import { OrbitSearchIllustration } from '../components/Illustration';
import { professionals } from '../data/dummyData';

export default function FindingProfessionalScreen({ navigation }) {
  const { theme, setActiveBooking, activeBooking } = useApp();
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 4000 });
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    const timeout = setTimeout(() => {
      const assigned = professionals[0];
      setActiveBooking({ ...(activeBooking || {}), professional: assigned });
      navigation.replace('ProfessionalAssigned');
    }, 4200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={styles.center}>
        <Animated.View entering={FadeIn.duration(400)}>
          <OrbitSearchIllustration icon="construct-outline" size={200} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(500)} style={{ alignItems: 'center' }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Finding the best professional near you...</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
            This may take up to 30 seconds. Sit back and relax.
          </Text>
        </Animated.View>

        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <Animated.View style={[styles.progressFill, barStyle, { backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={{ color: theme.colors.subtitle, fontSize: 12, fontWeight: '600', marginTop: 10 }}>
          Elapsed: {seconds}s
        </Text>
      </View>

      <Button
        title="Cancel"
        variant="outline"
        onPress={() => navigation.goBack()}
        style={{ marginHorizontal: 24, marginBottom: insets.bottom + 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 30 },
  subtitle: { fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 19 },
  progressTrack: { width: '100%', height: 6, borderRadius: 3, marginTop: 30, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
});
