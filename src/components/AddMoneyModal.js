import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000];

const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (GPay / PhonePe / Paytm)", icon: "phone-portrait-outline", desc: "Instant zero fee transfer" },
  { id: "card", name: "Credit / Debit Card", icon: "card-outline", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", name: "Net Banking", icon: "business-outline", desc: "All Indian Banks supported" },
];

export default function AddMoneyModal({ visible, onClose, onAddSuccess, currentBalance = 0, theme }) {
  const [amount, setAmount] = useState("500");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const numAmount = parseInt(amount, 10) || 0;

  const handlePresetSelect = (val) => {
    setAmount(String(val));
    setError("");
  };

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setAmount(cleaned);
    setError("");
  };

  const handleAddMoney = () => {
    if (!numAmount || numAmount < 10) {
      setError("Minimum amount to add is ₹10");
      return;
    }
    if (numAmount > 20000) {
      setError("Maximum amount allowed is ₹20,000 per transaction");
      return;
    }

    setIsProcessing(true);
    setError("");

    // Simulate payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onAddSuccess) {
        const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || "UPI";
        onAddSuccess(numAmount, methodName);
      }
    }, 1200);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setAmount("500");
    setSelectedMethod("upi");
    setIsProcessing(false);
    setIsSuccess(false);
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl }]}>
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={[styles.successIconWrap, { backgroundColor: theme.colors.success + "20" }]}>
                <Ionicons name="checkmark-circle" size={58} color={theme.colors.success} />
              </View>
              <Text style={[styles.successTitle, { color: theme.colors.text }]}>Money Added Successfully!</Text>
              <Text style={[styles.successAmount, { color: theme.colors.primary }]}>+₹{numAmount}</Text>
              <Text style={[styles.successSubtitle, { color: theme.colors.subtitle }]}>
                Updated QuickFix Wallet Balance: ₹{currentBalance + numAmount}
              </Text>
              <Pressable
                onPress={handleClose}
                style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={[styles.walletIcon, { backgroundColor: theme.colors.primary + "18" }]}>
                    <Ionicons name="wallet-outline" size={22} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Add Money</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
                      Current balance: ₹{currentBalance}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={handleClose} style={styles.closeBtn} hitSlop={10}>
                  <Ionicons name="close" size={22} color={theme.colors.subtitle} />
                </Pressable>
              </View>

              {/* Amount input */}
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Enter Amount</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: error ? theme.colors.error : theme.colors.border,
                    backgroundColor: theme.colors.background,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text style={[styles.currencyPrefix, { color: theme.colors.text }]}>₹</Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.subtitle}
                  style={[styles.amountInput, { color: theme.colors.text }]}
                  maxLength={6}
                />
              </View>
              {error ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text> : null}

              {/* Quick Amount Chips */}
              <View style={styles.presetsRow}>
                {PRESET_AMOUNTS.map((val) => {
                  const isSelected = numAmount === val;
                  return (
                    <Pressable
                      key={val}
                      onPress={() => handlePresetSelect(val)}
                      style={[
                        styles.presetChip,
                        {
                          backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          { color: isSelected ? "#fff" : theme.colors.text },
                        ]}
                      >
                        +₹{val}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Payment Methods */}
              <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 18 }]}>
                Select Payment Mode
              </Text>
              <View style={{ gap: 10 }}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <Pressable
                      key={method.id}
                      onPress={() => setSelectedMethod(method.id)}
                      style={[
                        styles.methodCard,
                        {
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                          backgroundColor: isSelected ? theme.colors.primary + "10" : theme.colors.background,
                          borderRadius: theme.radius.md,
                        },
                      ]}
                    >
                      <View style={[styles.methodIcon, { backgroundColor: theme.colors.card }]}>
                        <Ionicons
                          name={method.icon}
                          size={20}
                          color={isSelected ? theme.colors.primary : theme.colors.subtitle}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.methodName, { color: theme.colors.text }]}>{method.name}</Text>
                        <Text style={[styles.methodDesc, { color: theme.colors.subtitle }]}>{method.desc}</Text>
                      </View>
                      <View
                        style={[
                          styles.radio,
                          { borderColor: isSelected ? theme.colors.primary : theme.colors.border },
                        ]}
                      >
                        {isSelected && <View style={[styles.radioDot, { backgroundColor: theme.colors.primary }]} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Proceed Button */}
              <Pressable
                onPress={handleAddMoney}
                disabled={isProcessing}
                style={[
                  styles.payBtn,
                  { backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg },
                  isProcessing && { opacity: 0.7 },
                ]}
              >
                {isProcessing ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.payBtnText}>Processing Payment...</Text>
                  </View>
                ) : (
                  <Text style={styles.payBtnText}>
                    Proceed to Add ₹{numAmount > 0 ? numAmount : "0"}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          )}
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
    maxWidth: 440,
    padding: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  currencyPrefix: {
    fontSize: 22,
    fontWeight: "800",
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
    fontWeight: "600",
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  presetChip: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1.2,
  },
  presetChipText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1.5,
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  methodName: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  methodDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  payBtn: {
    marginTop: 22,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  successAmount: {
    fontSize: 32,
    fontWeight: "900",
    marginVertical: 8,
  },
  successSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  doneBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});