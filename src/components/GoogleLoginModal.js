import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_GOOGLE_ACCOUNTS = [
  { name: "Rohan Verma", email: "rohan.verma@gmail.com", avatarColor: "#4285F4" },
  { name: "Ananya Sharma", email: "ananya.sharma@gmail.com", avatarColor: "#EA4335" },
  { name: "Aarav Patel", email: "aarav.patel@gmail.com", avatarColor: "#34A853" },
];

export default function GoogleLoginModal({ visible, onClose, onSelectAccount, theme }) {
  const [showAddAnother, setShowAddAnother] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const handleCustomSubmit = () => {
    if (!customEmail) return;
    const name = customName || customEmail.split("@")[0];
    onSelectAccount({
      name,
      email: customEmail,
      avatarColor: "#FBBC05",
    });
    reset();
  };

  const reset = () => {
    setShowAddAnother(false);
    setCustomName("");
    setCustomEmail("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={reset}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl }]}>
          <View style={styles.header}>
            <Ionicons name="logo-google" size={28} color="#4285F4" />
            <Text style={[styles.title, { color: theme.colors.text }]}>Sign in with Google</Text>
            <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
              Choose an account to continue to QuickFix
            </Text>
          </View>

          {!showAddAnother ? (
            <ScrollView style={{ maxHeight: 260 }}>
              {MOCK_GOOGLE_ACCOUNTS.map((account) => (
                <Pressable
                  key={account.email}
                  onPress={() => {
                    onSelectAccount(account);
                    reset();
                  }}
                  style={({ pressed }) => [
                    styles.accountRow,
                    { borderColor: theme.colors.border },
                    pressed && { backgroundColor: theme.colors.primary + "10" },
                  ]}
                >
                  <View style={[styles.avatar, { backgroundColor: account.avatarColor }]}>
                    <Text style={styles.avatarText}>{account.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.accountName, { color: theme.colors.text }]}>{account.name}</Text>
                    <Text style={[styles.accountEmail, { color: theme.colors.subtitle }]}>{account.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.subtitle} />
                </Pressable>
              ))}

              <Pressable
                onPress={() => setShowAddAnother(true)}
                style={({ pressed }) => [
                  styles.accountRow,
                  { borderColor: theme.colors.border },
                  pressed && { backgroundColor: theme.colors.primary + "10" },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: theme.colors.border }]}>
                  <Ionicons name="person-add-outline" size={18} color={theme.colors.text} />
                </View>
                <Text style={[styles.accountName, { color: theme.colors.primary, marginLeft: 12, fontWeight: "700" }]}>
                  Use another Google account
                </Text>
              </Pressable>
            </ScrollView>
          ) : (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Google Email address</Text>
              <TextInput
                value={customEmail}
                onChangeText={setCustomEmail}
                placeholder="your.email@gmail.com"
                placeholderTextColor={theme.colors.subtitle}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                ]}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.text, marginTop: 12 }]}>Your Name (Optional)</Text>
              <TextInput
                value={customName}
                onChangeText={setCustomName}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.subtitle}
                style={[
                  styles.input,
                  { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                ]}
              />

              <View style={styles.btnRow}>
                <Pressable
                  onPress={() => setShowAddAnother(false)}
                  style={[styles.btn, { borderColor: theme.colors.border, borderWidth: 1 }]}
                >
                  <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Back</Text>
                </Pressable>
                <Pressable
                  onPress={handleCustomSubmit}
                  style={[styles.btn, { backgroundColor: "#4285F4" }]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Sign In</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable onPress={reset} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: theme.colors.subtitle }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Apple Sign-In Modal - mimics Apple's sign-in flow with
 * option to hide email.
 */
export function AppleLoginModal({ visible, onClose, onSelectAccount, theme }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [hideEmail, setHideEmail] = useState(false);

  const handleAppleSignIn = () => {
    if (!email) return;
    const displayName = name || email.split("@")[0];
    onSelectAccount({
      name: displayName,
      email: hideEmail ? displayName.toLowerCase().replace(/\s/g, "") + "@privaterelay.appleid.com" : email,
      avatarColor: "#1A1A1A",
    });
    reset();
  };

  const reset = () => {
    setEmail("");
    setName("");
    setHideEmail(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={reset}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl }]}>
          <View style={styles.header}>
            <View style={appleStyles.appleLogo}>
              <Ionicons name="logo-apple" size={32} color="#fff" />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Sign in with Apple</Text>
            <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
              Use your Apple ID to continue to QuickFix
            </Text>
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Apple ID (Email)</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your.name@icloud.com"
              placeholderTextColor={theme.colors.subtitle}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
              ]}
            />

            <Text style={[styles.inputLabel, { color: theme.colors.text, marginTop: 12 }]}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={theme.colors.subtitle}
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
              ]}
            />

            <Pressable
              onPress={() => setHideEmail(!hideEmail)}
              style={appleStyles.hideEmailRow}
            >
              <View style={[appleStyles.checkbox, hideEmail && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
                {hideEmail && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[appleStyles.hideEmailLabel, { color: theme.colors.text }]}>Hide My Email</Text>
                <Text style={{ color: theme.colors.subtitle, fontSize: 11, marginTop: 1 }}>
                  Apple will create a unique, random address that forwards to your real email
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleAppleSignIn}
              style={appleStyles.signInBtn}
            >
              <Ionicons name="logo-apple" size={18} color="#fff" />
              <Text style={appleStyles.signInText}>Continue with Apple</Text>
            </Pressable>
          </View>

          <Pressable onPress={reset} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: theme.colors.subtitle }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  accountName: {
    fontSize: 14,
    fontWeight: "700",
  },
  accountEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    alignSelf: "center",
    marginTop: 18,
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

const appleStyles = StyleSheet.create({
  appleLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  hideEmailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  hideEmailLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  signInBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  signInText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
