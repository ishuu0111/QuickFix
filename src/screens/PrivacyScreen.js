import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { Header, Card } from "../components";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function PrivacyScreen({ navigation }) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();

  const [locationSharing, setLocationSharing] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [biometricLock, setBiometricLock] = useState(false);

  const handleDeleteAccount = () => {
    if (isWeb) {
      if (window.confirm("Are you sure you want to request account deletion? All your booking history will be permanently erased.")) {
        alert("Deletion request received. Our privacy team will contact you within 24 hours.");
      }
    } else {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to request account deletion? All your booking history will be permanently erased.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Request Deletion", style: "destructive", onPress: () => alert("Deletion request received.") },
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Privacy & Security" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 30 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle }]}>Data Sharing & Permissions</Text>
        <Card padded={false}>
          <SettingSwitch
            icon="location-outline"
            title="Location Sharing"
            subtitle="Required for live tracking service professionals"
            value={locationSharing}
            onValueChange={setLocationSharing}
            theme={theme}
          />
          <SettingSwitch
            icon="analytics-outline"
            title="Usage Analytics"
            subtitle="Help us improve QuickFix app experience"
            value={dataCollection}
            onValueChange={setDataCollection}
            theme={theme}
          />
          <SettingSwitch
            icon="pricetag-outline"
            title="Personalized Offers"
            subtitle="Receive relevant discounts based on service history"
            value={personalizedAds}
            onValueChange={setPersonalizedAds}
            theme={theme}
            isLast
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>App Security</Text>
        <Card padded={false}>
          <SettingSwitch
            icon="finger-print-outline"
            title="Biometric / App Lock"
            subtitle="Require Face ID / Fingerprint on app open"
            value={biometricLock}
            onValueChange={setBiometricLock}
            theme={theme}
            isLast
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>Privacy Policy Overview</Text>
        <Card style={{ padding: 18 }}>
          <Text style={[styles.policyHeading, { color: theme.colors.text }]}>1. Information We Collect</Text>
          <Text style={[styles.policyText, { color: theme.colors.subtitle }]}>
            QuickFix collects your name, contact details, and location only to deliver seamless home services and connect you with nearby verified professionals.
          </Text>

          <Text style={[styles.policyHeading, { color: theme.colors.text, marginTop: 14 }]}>2. Data Protection</Text>
          <Text style={[styles.policyText, { color: theme.colors.subtitle }]}>
            All sensitive information, including emergency SOS contacts and payment history, is encrypted in transit and stored securely adhering to ISO 27001 standards.
          </Text>
        </Card>

        <Pressable
          onPress={handleDeleteAccount}
          style={[styles.deleteBtn, { borderColor: theme.colors.error }]}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
          <Text style={[styles.deleteText, { color: theme.colors.error }]}>Delete Account & Data</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SettingSwitch({ icon, title, subtitle, value, onValueChange, theme, isLast }) {
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderColor: theme.colors.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + "12" }]}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.sub, { color: theme.colors.subtitle }]}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 11, marginTop: 2 },
  policyHeading: { fontSize: 13, fontWeight: "700" },
  policyText: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  deleteText: { fontSize: 13.5, fontWeight: "700" },
});
