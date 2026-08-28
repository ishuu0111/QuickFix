import React from "react";
import { View, StyleSheet, Platform, Pressable, Text, useWindowDimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useResponsive } from "../utils/responsive";

import HomeScreen from "../screens/HomeScreen";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import WalletScreen from "../screens/WalletScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const isWeb = Platform.OS === "web";

const ICONS = {
  Home: "home",
  Bookings: "calendar",
  Wallet: "wallet",
  Notifications: "notifications",
  Profile: "person",
};

function TabIcon({ name, focused, color }) {
  const { theme } = useApp();
  return (
    <View
      style={[
        styles.iconWrap,
        focused && { backgroundColor: theme.colors.primary + "16" },
      ]}
    >
      <Ionicons name={focused ? ICONS[name] : `${ICONS[name]}-outline`} size={22} color={color} />
    </View>
  );
}

function MainTabsWithSOS() {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isMobile, isDesktop, width } = useResponsive();

  const isWideWeb = isWeb && width >= 768;
  const tabBarHeight = isWideWeb ? 64 : (isWeb ? 58 : 62 + insets.bottom);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.subtitle,
          tabBarStyle: [
            styles.tabBar,
            isWideWeb ? styles.tabBarWideDock : styles.tabBarMobile,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              height: tabBarHeight,
              paddingBottom: isWideWeb ? 10 : (isWeb ? 6 : insets.bottom + 6),
            },
            theme.shadow.card,
          ],
          tabBarLabelStyle: styles.label,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={route.name} focused={focused} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Bookings" component={BookingHistoryScreen} />
        <Tab.Screen name="Wallet" component={WalletScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Floating Multilingual AI Repair Assistant Button */}
      <Pressable
        onPress={() => navigation.navigate("AIAssistant")}
        style={({ pressed }) => [
          styles.aiFab,
          isWideWeb ? styles.aiFabWide : styles.aiFabMobile,
          { backgroundColor: theme.colors.primary },
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
      >
        <Ionicons name="sparkles" size={17} color="#fff" />
        <Text style={styles.aiFabText}>AI Help</Text>
      </Pressable>
    </View>
  );
}

export default function MainTabNavigator() {
  return <MainTabsWithSOS />;
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderWidth: 1,
    elevation: 12,
  },
  // On desktop / tablet: elegant centered floating dock
  tabBarWideDock: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -300 }],
    width: 600,
    maxWidth: "92%",
    borderRadius: 30,
    borderTopWidth: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
  },
  // On mobile: edge-to-edge clean tab bar
  tabBarMobile: {
    position: isWeb ? "relative" : "absolute",
    borderTopWidth: 1,
    borderRadius: isWeb ? 0 : 26,
    marginHorizontal: isWeb ? 0 : 16,
    marginBottom: isWeb ? 0 : 16,
  },
  label: { fontSize: 11, fontWeight: "700", marginTop: 2 },
  iconWrap: {
    width: 38,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aiFab: {
    position: "absolute",
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#0D6EFD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  aiFabWide: {
    bottom: 24,
    right: 28,
  },
  aiFabMobile: {
    bottom: isWeb ? 76 : 94,
    left: 16,
  },
  aiFabText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});