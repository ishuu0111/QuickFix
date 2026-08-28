import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Button, Input } from "../components";
import GoogleLoginModal, { AppleLoginModal } from "../components/GoogleLoginModal";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function RegisterScreen({ navigation }) {
  const { theme, login } = useApp();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.confirm !== form.password) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      login({ name: form.name, email: form.email, phone: form.phone });
    }
  };

  const handleSocialSelect = (account) => {
    login({
      name: account.name,
      email: account.email,
      avatarColor: account.avatarColor,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>

        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
            Join thousands who trust us for home services
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ marginTop: 28 }}>
          <Input label="Full name" placeholder="Your name" icon="person-outline" value={form.name} onChangeText={(v) => update("name", v)} error={errors.name} />
          <Input label="Phone number" placeholder="+91 98765 43210" icon="call-outline" value={form.phone} onChangeText={(v) => update("phone", v)} keyboardType="phone-pad" error={errors.phone} />
          <Input label="Email address" placeholder="you@example.com" icon="mail-outline" value={form.email} onChangeText={(v) => update("email", v)} keyboardType="email-address" error={errors.email} />
          <Input label="Password" placeholder="Create a password" icon="lock-closed-outline" value={form.password} onChangeText={(v) => update("password", v)} secureTextEntry error={errors.password} />
          <Input label="Confirm password" placeholder="Re-enter your password" icon="lock-closed-outline" value={form.confirm} onChangeText={(v) => update("confirm", v)} secureTextEntry error={errors.confirm} />

          <Button title="Create Account" onPress={handleRegister} size="lg" style={{ marginTop: 8 }} />

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.subtitle }]}>or sign up with</Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={() => setShowGoogleModal(true)}
              style={({ pressed }) => [
                styles.socialBtn,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={[styles.socialText, { color: theme.colors.text }]}>Google</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowAppleModal(true)}
              style={({ pressed }) => [
                styles.socialBtn,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
              <Text style={[styles.socialText, { color: theme.colors.text }]}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={{ color: theme.colors.subtitle, fontSize: 13 }}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}> Login</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Google Account Modal */}
      <GoogleLoginModal
        visible={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={handleSocialSelect}
        theme={theme}
      />

      {/* Apple Account Modal */}
      <AppleLoginModal
        visible={showAppleModal}
        onClose={() => setShowAppleModal(false)}
        onSelectAccount={handleSocialSelect}
        theme={theme}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: "600" },
  socialRow: { flexDirection: "row", gap: 14 },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialText: { fontSize: 14, fontWeight: "700" },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerLink: { fontSize: 13, fontWeight: "800" },
});