import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Header, Button, Input, Card } from '../components';
import { PAYMENT_METHODS } from '../constants';

export default function PaymentScreen({ navigation }) {
  const { theme, activeBooking, addBooking } = useApp();
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState('upi');
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const service = activeBooking?.service || { name: 'Service', price: 499 };
  const serviceCharge = service.price;
  const labourCharge = 150;
  const spareParts = 50;
  const discount = applied ? 50 : 0;
  const total = serviceCharge + labourCharge + spareParts - discount;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      addBooking({
        id: `bk${Date.now()}`,
        service: service.name,
        status: 'completed',
        professional: activeBooking?.professional?.name || 'Professional',
        date: 'Just now',
        price: total,
        icon: service.icon || 'construct-outline',
        color: service.color || theme.colors.primary,
        rated: false,
      });
      setProcessing(false);
      navigation.replace('RatingReview');
    }, 1400);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Payment & Review" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{
        padding: 20,
        paddingBottom: 140,
        maxWidth: Platform.OS === 'web' ? 960 : undefined,
        width: '100%',
        alignSelf: Platform.OS === 'web' ? 'center' : undefined,
      }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Bill Details</Text>
            <BillRow label="Service Charge" value={serviceCharge} theme={theme} />
            <BillRow label="Labour Charge" value={labourCharge} theme={theme} />
            <BillRow label="Spare Parts" value={spareParts} theme={theme} />
            {applied && <BillRow label="Coupon Discount" value={-discount} theme={theme} highlight />}
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <BillRow label="Total" value={total} theme={theme} bold />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card style={{ marginTop: 16 }}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Apply Coupon</Text>
            <View style={styles.couponRow}>
              <View style={{ flex: 1 }}>
                <Input placeholder="Enter coupon code" value={coupon} onChangeText={setCoupon} icon="pricetag-outline" style={{ marginBottom: 0 }} />
              </View>
              <Pressable
                onPress={() => setApplied(true)}
                style={[styles.applyBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.applyText}>Apply</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card style={{ marginTop: 16 }}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Payment Method</Text>
            {PAYMENT_METHODS.map((m) => (
              <Pressable key={m.id} onPress={() => setMethod(m.id)} style={styles.methodRow}>
                <Ionicons name={m.icon} size={20} color={theme.colors.text} />
                <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{m.label}</Text>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: method === m.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: method === m.id ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  {method === m.id && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
              </Pressable>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, paddingBottom: insets.bottom + 14 }]}>
        <Button title={`Pay ₹${total}`} onPress={handlePay} loading={processing} size="lg" icon="lock-closed-outline" />
      </View>
    </View>
  );
}

function BillRow({ label, value, theme, bold, highlight }) {
  return (
    <View style={styles.billRow}>
      <Text style={{ color: theme.colors.subtitle, fontSize: bold ? 15 : 13, fontWeight: bold ? '700' : '500' }}>{label}</Text>
      <Text
        style={{
          color: highlight ? theme.colors.success : bold ? theme.colors.text : theme.colors.text,
          fontSize: bold ? 18 : 13,
          fontWeight: bold ? '800' : '600',
        }}
      >
        {value < 0 ? '-' : ''}₹{Math.abs(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  divider: { height: 1, marginVertical: 6 },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  applyBtn: { paddingHorizontal: 18, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  methodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  methodLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
});
