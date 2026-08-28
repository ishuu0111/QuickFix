import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Card, Button, AddMoneyModal, EmptyState } from "../components";
import { useScrollBottomPad, CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

export default function WalletScreen() {
  const { theme, walletBalance, walletTransactions, addWalletMoney } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = useScrollBottomPad();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSuccess = (amount, method) => {
    addWalletMoney(amount, method);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top + 12 }}>
      <View
        style={{
          maxWidth: isWeb ? CONTENT_MAX_WIDTH : undefined,
          width: "100%",
          alignSelf: isWeb ? "center" : undefined,
          flex: 1,
        }}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>QuickFix Wallet</Text>
        <FlatList
          data={walletTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}
          ListHeaderComponent={
            <>
              <LinearGradient
                colors={theme.gradients.primary}
                style={[styles.balanceCard, { borderRadius: theme.radius.xl }]}
              >
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>
                  ₹{(walletBalance || 0).toLocaleString("en-IN")}
                </Text>
                <View style={styles.balanceActions}>
                  <Button
                    title="Add Money"
                    variant="light"
                    size="sm"
                    fullWidth={false}
                    onPress={() => setShowAddModal(true)}
                    style={{ paddingHorizontal: 22 }}
                  />
                </View>
                <Ionicons
                  name="wallet"
                  size={90}
                  color="rgba(255,255,255,0.14)"
                  style={styles.walletBgIcon}
                />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Transactions
              </Text>
            </>
          }
          ListEmptyComponent={
            <EmptyState
              icon="wallet-outline"
              title="No transactions yet"
              subtitle="Add money to your wallet to enjoy fast, one-tap checkout on bookings!"
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(350)}>
              <Card style={styles.txCard}>
                <View
                  style={[
                    styles.txIcon,
                    {
                      backgroundColor:
                        (item.type === "credit" ? theme.colors.success : theme.colors.error) + "17",
                    },
                  ]}
                >
                  <Ionicons
                    name={item.type === "credit" ? "arrow-down-outline" : "arrow-up-outline"}
                    size={18}
                    color={item.type === "credit" ? theme.colors.success : theme.colors.error}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.txTitle, { color: theme.colors.text }]}>{item.title}</Text>
                  <Text style={{ color: theme.colors.subtitle, fontSize: 11, marginTop: 2 }}>
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={{
                    color: item.type === "credit" ? theme.colors.success : theme.colors.text,
                    fontWeight: "800",
                    fontSize: 14,
                  }}
                >
                  {item.amount > 0 ? "+" : ""}₹{Math.abs(item.amount)}
                </Text>
              </Card>
            </Animated.View>
          )}
        />
      </View>

      {/* Add Money Modal */}
      <AddMoneyModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={handleAddSuccess}
        currentBalance={walletBalance || 0}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", paddingHorizontal: 20, marginBottom: 16 },
  balanceCard: { padding: 24, marginBottom: 24, overflow: "hidden" },
  balanceLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "600" },
  balanceValue: { color: "#fff", fontSize: 34, fontWeight: "800", marginTop: 6 },
  balanceActions: { marginTop: 18, flexDirection: "row" },
  walletBgIcon: { position: "absolute", right: -10, bottom: -10 },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 14 },
  txCard: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  txIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txTitle: { fontSize: 13.5, fontWeight: "700" },
});