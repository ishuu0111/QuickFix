import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Share, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ReferralModal({ visible, onClose, theme, user }) {
  const [copied, setCopied] = useState(false);
  const referralCode = `QUICKFIX-${user?.name ? user.name.split(" ")[0].toUpperCase() : "PROMO"}150`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my QuickFix code ${referralCode} to get ?150 OFF your first home service booking! Download now: https://quickfix.app`,
      });
    } catch (e) {
      console.warn("Share error:", e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl }]}>
          <LinearGradient colors={theme.gradients.dark} style={[styles.hero, { borderRadius: theme.radius.lg }]}>
            <Ionicons name="gift-outline" size={44} color={theme.colors.accent} />
            <Text style={styles.heroTitle}>Refer & Earn ?150</Text>
            <Text style={styles.heroSub}>
              Share your referral code with friends & family. You both get ?150 in QuickFix Wallet!
            </Text>
          </LinearGradient>

          <Text style={[styles.label, { color: theme.colors.text }]}>Your Unique Referral Code</Text>
          <View style={[styles.codeBox, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + "0D" }]}>
            <Text style={[styles.codeText, { color: theme.colors.primary }]}>{referralCode}</Text>
            <Pressable onPress={handleCopy} style={[styles.copyBtn, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#fff" />
              <Text style={styles.copyText}>{copied ? "Copied!" : "Copy"}</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.statVal, { color: theme.colors.primary }]}>?450</Text>
              <Text style={[styles.statSub, { color: theme.colors.subtitle }]}>Total Earned</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.statVal, { color: theme.colors.text }]}>3</Text>
              <Text style={[styles.statSub, { color: theme.colors.subtitle }]}>Friends Joined</Text>
            </View>
          </View>

          <Pressable onPress={handleShare} style={[styles.shareBtn, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="share-social-outline" size={18} color="#fff" />
            <Text style={styles.shareText}>Share Invite Link</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: theme.colors.subtitle, fontSize: 13, fontWeight: "700" }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
  },
  hero: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 8 },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, textAlign: "center", marginTop: 6, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderStyle: "dashed",
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 14,
  },
  codeText: { fontSize: 16, fontWeight: "900", letterSpacing: 1 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  copyText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 12, marginVertical: 18 },
  statBox: { flex: 1, padding: 14, borderRadius: 14, alignItems: "center" },
  statVal: { fontSize: 18, fontWeight: "800" },
  statSub: { fontSize: 11, marginTop: 2, fontWeight: "600" },
  shareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  shareText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  closeBtn: { alignSelf: "center", marginTop: 14, paddingVertical: 6 },
});
