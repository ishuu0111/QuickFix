import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { Header, Card } from "../components";
import { APP_NAME, APP_TAGLINE } from "../constants";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function AboutScreen({ navigation }) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="About QuickFix" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 30 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={theme.gradients.primary} style={[styles.heroCard, { borderRadius: theme.radius.xl }]}>
          <View style={styles.logoCircle}>
            <Ionicons name="hammer" size={42} color="#fff" />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.appTagline}>{APP_TAGLINE}</Text>
          <Text style={styles.versionText}>Version 1.0.0 (Build 2026.08)</Text>
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>Why Choose QuickFix?</Text>

        {[
          { icon: "shield-checkmark", title: "100% Background-Verified Pros", desc: "Every electrician, plumber, and technician undergoes strict background verification and background checks." },
          { icon: "time", title: "30-Minute On-Demand Dispatch", desc: "Our real-time matching system dispatches top-rated service professionals nearest to your home location." },
          { icon: "alert-circle", title: "One-Tap Emergency SOS Calling", desc: "Instant sequential calling feature for user safety during high-stress home emergencies." },
          { icon: "wallet", title: "Transparent Fixed Pricing", desc: "No hidden charges. Know exact service costs upfront before booking." },
        ].map((item, i) => (
          <Card key={i} style={styles.featureCard}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + "14" }]}>
              <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={[styles.featureDesc, { color: theme.colors.subtitle }]}>{item.desc}</Text>
            </View>
          </Card>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>App Info & Legal</Text>
        <Card style={{ padding: 18, gap: 10 }}>
          <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.subtitle, fontSize: 13 }}>Designed & Developed</Text>
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "700" }}>QuickFix Engineering</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.subtitle, fontSize: 13 }}>Platform Support</Text>
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "700" }}>iOS, Android, Web</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.subtitle, fontSize: 13 }}>Terms & Conditions</Text>
            <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: "700" }}>View Terms</Text>
          </View>
        </Card>

        <Text style={[styles.copyright, { color: theme.colors.subtitle }]}>
          © 2026 QuickFix Technologies Inc. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  heroCard: { padding: 24, alignItems: "center" },
  logoCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  appName: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 12 },
  appTagline: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4, fontWeight: "500" },
  versionText: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 10, fontWeight: "700" },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  featureCard: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, padding: 14 },
  iconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 14, fontWeight: "700" },
  featureDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  copyright: { textAlign: "center", fontSize: 11, marginTop: 24, fontWeight: "500" },
});
