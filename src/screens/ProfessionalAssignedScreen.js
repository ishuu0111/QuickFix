import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Avatar, RatingStars, Button, Card } from '../components';
import { MapCard } from '../components';
import { DEFAULT_REGION, WORKER_DESTINATION } from '../constants';
import { professionals } from '../data/dummyData';

export default function ProfessionalAssignedScreen({ navigation }) {
  const { theme, activeBooking } = useApp();
  const insets = useSafeAreaInsets();
  const pro = activeBooking?.professional || professionals[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top }}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Professional Assigned</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <MapCard origin={DEFAULT_REGION} destination={WORKER_DESTINATION} height={220} interactive={false} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150).duration(400)}>
          <Card style={{ marginTop: -30, marginHorizontal: 4 }}>
            <View style={styles.proRow}>
              <Avatar name={pro.name} size={64} color={pro.avatarColor} verified={pro.verified} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.proName, { color: theme.colors.text }]}>{pro.name}</Text>
                <Text style={[styles.proRole, { color: theme.colors.subtitle }]}>
                  {pro.role} • {pro.experience}
                </Text>
                <RatingStars rating={pro.rating} showValue count={pro.reviews} size={13} />
              </View>
            </View>

            <View style={[styles.statsRow, { borderColor: theme.colors.border }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{pro.eta}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.subtitle }]}>ETA</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{pro.distance}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.subtitle }]}>Distance</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{pro.jobs}+</Text>
                <Text style={[styles.statLabel, { color: theme.colors.subtitle }]}>Jobs Done</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <ActionButton
                icon="call-outline"
                label="Call"
                theme={theme}
                onPress={() => {
                  const phoneNumber = pro.phone || '+919876543210';
                  if (Platform.OS === 'web') {
                    window.open(`tel:${phoneNumber}`, '_self');
                  } else {
                    Linking.openURL(`tel:${phoneNumber}`);
                  }
                }}
              />
              <ActionButton
                icon="chatbubble-outline"
                label="Chat"
                theme={theme}
                onPress={() => {
                  const phoneNumber = pro.phone || '+919876543210';
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;
                  if (Platform.OS === 'web') {
                    window.open(whatsappUrl, '_blank');
                  } else {
                    Linking.openURL(whatsappUrl);
                  }
                }}
              />
              <ActionButton
                icon="information-circle-outline"
                label="Details"
                theme={theme}
                onPress={() => navigation.navigate('LiveTracking')}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <View style={[styles.bookingSummary, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name={activeBooking?.service?.icon || 'construct-outline'} size={22} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                {activeBooking?.service?.name || 'Service'}
              </Text>
              <Text style={{ color: theme.colors.subtitle, fontSize: 12 }}>
                {activeBooking?.slot || 'Today'} • {activeBooking?.address?.label || 'Home'}
              </Text>
            </View>
          </View>

          <Button title="Track Live" size="lg" onPress={() => navigation.navigate('LiveTracking')} style={{ marginTop: 24 }} icon="navigate-outline" />
        </Animated.View>
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress, theme }) {
  return (
    <Pressable onPress={onPress} style={styles.actionBtn}>
      <View style={[styles.actionIconWrap, { backgroundColor: theme.colors.primary + '14' }]}>
        <Ionicons name={icon} size={19} color={theme.colors.primary} />
      </View>
      <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  proRow: { flexDirection: 'row', alignItems: 'center' },
  proName: { fontSize: 17, fontWeight: '800' },
  proRole: { fontSize: 12, fontWeight: '500', marginVertical: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: '80%' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIconWrap: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '700' },
  bookingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 20,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700' },
});
