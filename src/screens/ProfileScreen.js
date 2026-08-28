import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Avatar, Card } from "../components";
import { useScrollBottomPad, CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { key: "EditProfile", icon: "person-outline", label: "Edit Profile" },
      { key: "SavedAddresses", icon: "location-outline", label: "Saved Addresses" },
      { key: "PaymentMethods", icon: "card-outline", label: "Payment Methods" },
    ],
  },
  {
    title: "Emergency",
    items: [
      { key: "SOS", icon: "alert-circle-outline", label: "Emergency SOS", highlight: true },
    ],
  },
  {
    title: "Preferences",
    items: [
      { key: "Settings", icon: "settings-outline", label: "Settings" },
      { key: "Privacy", icon: "shield-checkmark-outline", label: "Privacy" },
    ],
  },
  {
    title: "Support",
    items: [
      { key: "HelpSupport", icon: "help-circle-outline", label: "Help & Support" },
      { key: "About", icon: "information-circle-outline", label: "About QuickFix" },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const { theme, user, logout, isGuest } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = useScrollBottomPad();

  const handleMenuPress = (key) => {
    if (["EditProfile", "SavedAddresses", "Settings", "SOS", "Privacy", "HelpSupport", "About"].includes(key)) {
      navigation.navigate(key);
    } else if (key === "PaymentMethods") {
      navigation.navigate("Wallet");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: bottomPad,
        maxWidth: isWeb ? CONTENT_MAX_WIDTH : undefined,
        width: "100%",
        alignSelf: isWeb ? "center" : undefined,
      }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={theme.gradients.primary} style={styles.header}>
        <Avatar name={isGuest ? "Guest User" : user.name} size={80} color={user.avatarColor} />
        <Text style={styles.name}>{isGuest ? "Guest User" : user.name}</Text>
        <Text style={styles.email}>
          {isGuest ? "Sign in to unlock all features" : user.email}
        </Text>
        <Text style={styles.locationText}>
          <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.9)" /> {user.location}
        </Text>

        <Pressable style={styles.editBtn} onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="create-outline" size={14} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.statsRow}>
        {[
          { label: "Bookings", value: "12" },
          { label: "Reviews", value: "8" },
          { label: "Saved", value: "3" },
        ].map((s) => (
          <View
            key={s.label}
            style={[
              styles.statCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtitle }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {MENU_SECTIONS.map((section, sIndex) => (
        <Animated.View
          key={section.title}
          entering={FadeInDown.delay(sIndex * 80).duration(400)}
          style={{ paddingHorizontal: 20, marginTop: 22 }}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.subtitle }]}>
            {section.title}
          </Text>
          <Card padded={false}>
            {section.items.map((item, i) => (
              <Pressable
                key={item.key}
                onPress={() => handleMenuPress(item.key)}
                style={({ pressed }) => [
                  styles.menuRow,
                  i !== section.items.length - 1 && {
                    borderBottomWidth: 1,
                    borderColor: theme.colors.border,
                  },
                  pressed && { backgroundColor: theme.colors.primary + "0A" },
                ]}
              >
                <View
                  style={[
                    styles.menuIcon,
                    {
                      backgroundColor: item.highlight
                        ? theme.colors.error + "14"
                        : theme.colors.primary + "12",
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.highlight ? theme.colors.error : theme.colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.menuLabel,
                    {
                      color: item.highlight ? theme.colors.error : theme.colors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {item.highlight ? (
                  <View style={[styles.sosBadge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.sosBadgeText}>SOS</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.subtitle} />
                )}
              </Pressable>
            ))}
          </Card>
        </Animated.View>
      ))}

      <Pressable
        onPress={logout}
        style={({ pressed }) => [
          styles.logoutBtn,
          { borderColor: theme.colors.error },
          pressed && { backgroundColor: theme.colors.error + "10" },
        ]}
      >
        <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 34,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  name: { color: "#fff", fontSize: 19, fontWeight: "800", marginTop: 14 },
  email: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4, fontWeight: "500" },
  locationText: { color: "rgba(255,255,255,0.9)", fontSize: 11.5, marginTop: 6, fontWeight: "600" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 16,
  },
  editText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: -20 },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11, fontWeight: "600", marginTop: 4 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 13.5, fontWeight: "600" },
  sosBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sosBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 14, fontWeight: "700" },
});
