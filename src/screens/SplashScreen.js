import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { Button } from "../components";
import { APP_NAME, APP_TAGLINE } from "../constants";

const isWeb = Platform.OS === "web";

export default function SplashScreen({ navigation }) {
  const { theme, continueAsGuest } = useApp();
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(24);
  const btnOpacity = useSharedValue(0);
  const btnTranslate = useSharedValue(24);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });
    logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.4)) });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    contentTranslate.value = withDelay(300, withTiming(0, { duration: 500 }));
    btnOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    btnTranslate.value = withDelay(600, withTiming(0, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslate.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnTranslate.value }],
  }));

  return (
    <LinearGradient colors={theme.gradients.primary} style={styles.container}>
      <View
        style={[
          styles.inner,
          isWeb && styles.webInner,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 30 },
        ]}
      >
        <View style={styles.top}>
          <Animated.View style={[styles.logoCircle, logoStyle]}>
            <Ionicons name="hammer" size={54} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.textWrap, contentStyle]}>
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.tagline}>{APP_TAGLINE}</Text>
          </Animated.View>

          <Animated.View style={[styles.badgeRow, contentStyle]}>
            {[
              { icon: "shield-checkmark-outline", label: "Verified Pros" },
              { icon: "time-outline", label: "On-time Service" },
              { icon: "star-outline", label: "Top Rated" },
            ].map((b) => (
              <View key={b.label} style={styles.badgeItem}>
                <View style={styles.badgeIcon}>
                  <Ionicons name={b.icon} size={16} color="#fff" />
                </View>
                <Text style={styles.badgeLabel}>{b.label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        <Animated.View style={btnStyle}>
          <Button
            title="Login / Sign Up"
            variant="light"
            onPress={() => navigation.navigate("Login")}
            size="lg"
          />
          <View style={{ height: 12 }} />
          <Button
            title="Continue as Guest"
            variant="ghost"
            onPress={continueAsGuest}
            size="lg"
            style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "space-between", paddingHorizontal: 28 },
  webInner: { maxWidth: 480, width: "100%", alignSelf: "center" },
  top: { alignItems: "center", marginTop: 30 },
  logoCircle: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  textWrap: { alignItems: "center" },
  appName: { fontSize: 32, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 8, fontWeight: "500" },
  badgeRow: { flexDirection: "row", marginTop: 46, gap: 22 },
  badgeItem: { alignItems: "center", gap: 8 },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
});
