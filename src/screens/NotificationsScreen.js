import React, { useMemo } from "react";
import { View, Text, StyleSheet, SectionList, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Card, EmptyState } from "../components";
import { notifications } from "../data/dummyData";
import { useScrollBottomPad, CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function NotificationsScreen() {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = useScrollBottomPad();

  const sections = useMemo(() => {
    const groups = {};
    notifications.forEach((n) => {
      if (!groups[n.group]) groups[n.group] = [];
      groups[n.group].push(n);
    });
    return Object.keys(groups).map((title) => ({ title, data: groups[title] }));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top + 12 }}>
      <View style={{ maxWidth: isWeb ? CONTENT_MAX_WIDTH : undefined, width: "100%", alignSelf: isWeb ? "center" : undefined, flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Notifications</Text>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}
          ListEmptyComponent={<EmptyState icon="notifications-outline" title="You are all caught up" subtitle="No new notifications" />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionTitle, { color: theme.colors.subtitle }]}>{title}</Text>
          )}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(350)}>
              <Card style={styles.card}>
                <View style={[styles.iconWrap, { backgroundColor: item.color + "17" }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.row}>
                    <Text style={[styles.notifTitle, { color: theme.colors.text }]}>{item.title}</Text>
                    <Text style={{ color: theme.colors.subtitle, fontSize: 11 }}>{item.time}</Text>
                  </View>
                  <Text style={[styles.message, { color: theme.colors.subtitle }]}>{item.message}</Text>
                </View>
              </Card>
            </Animated.View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", paddingHorizontal: 20, marginBottom: 6 },
  sectionTitle: { fontSize: 12, fontWeight: "700", marginTop: 18, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  card: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  notifTitle: { fontSize: 13.5, fontWeight: "700", flex: 1 },
  message: { fontSize: 12.5, marginTop: 4, lineHeight: 18 },
});
