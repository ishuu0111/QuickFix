import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Button, Input } from "../components";
import { PulsingBadge } from "../components/Illustration";
import GoogleLoginModal, { AppleLoginModal } from "../components/GoogleLoginModal";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function LoginScreen({ navigation }) {
  const { theme, login } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("rohan.verma@example.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      login({ name: email.split("@")[0].replace(".", " "), email });
    }
  };

  const handleGoogleSelect = (googleAccount) => {
    login({
      name: googleAccount.name,
      email: googleAccount.email,
      avatarColor: googleAccount.avatarColor,
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

        <Animated.View entering={FadeInDown.duration(500)} style={styles.center}>
          <PulsingBadge icon="log-in-outline" size={84} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
            Login to continue booking trusted home services
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginTop: 28 }}>
          <Input
            label="Email address"
            placeholder="you@gmail.com"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <Pressable style={styles.forgot}>
            <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot Password?</Text>
          </Pressable>

          <Button title="Continue" onPress={handleLogin} size="lg" />

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.subtitle }]}>or continue with</Text>
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
            <Text style={{ color: theme.colors.subtitle, fontSize: 13 }}>Don&apos;t have an account?</Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}> Sign Up</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Google Account Selector Modal */}
      <GoogleLoginModal
        visible={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={handleGoogleSelect}
        theme={theme}
      />

      {/* Apple Account Selector Modal */}
      <AppleLoginModal
        visible={showAppleModal}
        onClose={() => setShowAppleModal(false)}
        onSelectAccount={handleGoogleSelect}
        theme={theme}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 10 },
  center: { alignItems: "center", marginBottom: 18 },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20, paddingHorizontal: 10 },
  forgot: { alignSelf: "flex-end", marginBottom: 20, marginTop: -6 },
  forgotText: { fontSize: 13, fontWeight: "700" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
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
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerLink: { fontSize: 13, fontWeight: "800" },
});
