import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import SOSButton from "./SOSButton";

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  transparent = false,
  showSos = true,
}) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: transparent ? "transparent" : theme.colors.background,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            style={[styles.iconBtn, { backgroundColor: theme.colors.card }, theme.shadow.soft]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.colors.subtitle }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightActionsRow}>
          {rightIcon && (
            <Pressable
              onPress={onRightPress}
              style={[styles.iconBtn, { backgroundColor: theme.colors.card }, theme.shadow.soft]}
            >
              <Ionicons name={rightIcon} size={20} color={theme.colors.text} />
            </Pressable>
          )}
          {showSos && <SOSButton />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: { flex: 1, alignItems: "center" },
  title: { fontSize: 17, fontWeight: "800" },
  subtitle: { fontSize: 12, fontWeight: "500", marginTop: 1 },
  rightActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
