import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Card, Badge, EmptyState } from "../components";
import { services } from "../data/dummyData";
import { useScrollBottomPad, CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";
const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];
const STATUS_TONE = { upcoming: "primary", completed: "success", cancelled: "error" };

export default function BookingHistoryScreen({ navigation }) {
  const { theme, bookings } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState("upcoming");
  const bottomPad = useScrollBottomPad();
  const filtered = bookings.filter((b) => b.status === tab);

  const handleRebook = (booking) => {
    const matchedService = services.find((s) => s.name === booking.service);
    if (matchedService) {
      navigation.navigate("ServiceDetails", { service: matchedService });
    } else {
      navigation.navigate("Categories");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top + 12 }}>
      <View style={{ maxWidth: isWeb ? CONTENT_MAX_WIDTH : undefined, width: "100%", alignSelf: isWeb ? "center" : undefined, flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Bookings</Text>
        <View style={[styles.tabRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tabBtn, tab === t.key && { backgroundColor: theme.colors.primary }]}
            >
              <Text style={{ color: tab === t.key ? "#fff" : theme.colors.subtitle, fontSize: 13, fontWeight: "700" }}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title={`No ${tab} bookings`}
              subtitle="Your bookings will show up here once you book a service."
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
              <Card style={{ marginBottom: 14 }}>
                <View style={styles.row}>
                  <View style={[styles.iconWrap, { backgroundColor: item.color + "17" }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.serviceName, { color: theme.colors.text }]}>{item.service}</Text>
                    <Text style={{ color: theme.colors.subtitle, fontSize: 12, marginTop: 2 }}>{item.professional}</Text>
                  </View>
                  <Badge label={item.status} tone={STATUS_TONE[item.status]} size="sm" />
                </View>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.footerRow}>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.subtitle} />
                    <Text style={{ color: theme.colors.subtitle, fontSize: 12, marginLeft: 4 }}>{item.date}</Text>
                  </View>
                  <Text style={[styles.price, { color: theme.colors.text }]}>Rs.{item.price}</Text>
                </View>
                {tab === "completed" && (
                  <Pressable onPress={() => handleRebook(item)} style={[styles.rebookBtn, { borderColor: theme.colors.primary }]}>
                    <Ionicons name="refresh-outline" size={14} color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: "700", marginLeft: 6 }}>Rebook</Text>
                  </Pressable>
                )}
              </Card>
            </Animated.View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", paddingHorizontal: 20, marginBottom: 16 },
  tabRow: { flexDirection: "row", marginHorizontal: 20, borderRadius: 16, padding: 5, borderWidth: 1, marginBottom: 6 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  serviceName: { fontSize: 14, fontWeight: "700" },
  divider: { height: 1, marginVertical: 12 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 15, fontWeight: "800" },
  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 9,
    marginTop: 12,
  },
});
