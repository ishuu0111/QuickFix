import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Linking,
  Platform,
  Vibration,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { useSOS } from "../context/SOSContext";
import { Header } from "../components";

const MAX_CONTACTS = 5;
const isWeb = Platform.OS === "web";

function showAlert(title, message, buttons) {
  if (!buttons) buttons = [{ text: "OK" }];
  if (isWeb && typeof window !== "undefined") {
    if (buttons.length <= 1) {
      window.alert(title + "\n\n" + message);
      if (buttons[0] && buttons[0].onPress) buttons[0].onPress();
    } else {
      const confirmAction = buttons.find((b) => b.style === "destructive" || (b.text !== "Cancel" && b.style !== "cancel"));
      const cancelAction = buttons.find((b) => b.style === "cancel" || b.text === "Cancel");
      const result = window.confirm(title + "\n\n" + message);
      if (result) {
        if (confirmAction && confirmAction.onPress) confirmAction.onPress();
        else if (buttons[0] && buttons[0].onPress) buttons[0].onPress();
      } else {
        if (cancelAction && cancelAction.onPress) cancelAction.onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}

function makePhoneCall(phoneNumber) {
  const cleaned = (phoneNumber || "").replace(/\s/g, "");
  if (isWeb && typeof window !== "undefined") {
    window.open("tel:" + cleaned, "_self");
  } else {
    const url = Platform.OS === "android" ? `tel:${cleaned}` : `telprompt:${cleaned}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }
}

export default function SOSScreen({ navigation }) {
  const { theme } = useApp();
  const {
    emergencyContacts,
    addContact,
    removeContact,
    updateContact,
  } = useSOS();
  const insets = useSafeAreaInsets();

  // Add-contact form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // SOS active modal state
  const [sosModalVisible, setSOSModalVisible] = useState(false);
  const [callingIndex, setCallingIndex] = useState(0);
  const [sosCountdown, setSosCountdown] = useState(3);
  const countdownRef = useRef(null);

  const resetForm = () => {
    setForm({ name: "", phone: "", relation: "" });
    setFormErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{3,20}$/.test(form.phone.trim()))
      errors.phone = "Enter a valid phone number";
    return errors;
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (editingId) {
      updateContact(editingId, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        relation: form.relation.trim(),
      });
    } else {
      addContact({
        name: form.name.trim(),
        phone: form.phone.trim(),
        relation: form.relation.trim(),
      });
    }
    resetForm();
  };

  const handleEdit = (contact) => {
    setForm({ name: contact.name, phone: contact.phone, relation: contact.relation || "" });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    showAlert("Remove Contact", "Remove this emergency contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeContact(id),
      },
    ]);
  };

  // --- SOS FLOW ---------------------------------------------------------------

  const makeCallToContact = useCallback(
    (index) => {
      if (index >= emergencyContacts.length) {
        setSOSModalVisible(false);
        clearTimeout(countdownRef.current);
        showAlert(
          "SOS Complete",
          "All emergency contacts have been notified. Stay safe!"
        );
        return;
      }
      const contact = emergencyContacts[index];
      setCallingIndex(index);
      makePhoneCall(contact.phone);

      // Auto-advance to next contact after 5 seconds if not cancelled
      countdownRef.current = setTimeout(() => {
        makeCallToContact(index + 1);
      }, 5000);
    },
    [emergencyContacts]
  );

  const triggerSOS = () => {
    if (emergencyContacts.length === 0) {
      showAlert(
        "No Emergency Contacts",
        "Please add at least one emergency contact before triggering SOS.",
        [
          { text: "Add Contact", onPress: () => setShowForm(true) },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    // Vibrate to give haptic feedback on mobile
    if (Platform.OS !== "web") {
      Vibration.vibrate([0, 400, 200, 400]);
    }

    setCallingIndex(0);
    setSosCountdown(3);
    setSOSModalVisible(true);

    // 3-second countdown before first call
    let count = 3;
    const tick = () => {
      count -= 1;
      if (count > 0) {
        setSosCountdown(count);
        countdownRef.current = setTimeout(tick, 1000);
      } else {
        setSosCountdown(0);
        makeCallToContact(0);
      }
    };
    countdownRef.current = setTimeout(tick, 1000);
  };

  const cancelSOS = () => {
    clearTimeout(countdownRef.current);
    setSOSModalVisible(false);
  };

  // --- RENDER -----------------------------------------------------------------

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Emergency SOS" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS Info Banner */}
        <LinearGradient
          colors={["#EF4444", "#B91C1C"]}
          style={[styles.infoBanner, { borderRadius: theme.radius.xl }]}
        >
          <Ionicons name="alert-circle" size={34} color="#fff" />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.infoTitle}>Emergency SOS</Text>
            <Text style={styles.infoSubtitle}>
              Press the SOS button to instantly call your emergency contacts in
              order, one after the other - immediate safety help.
            </Text>
          </View>
        </LinearGradient>

        {/* SOS BIG BUTTON */}
        <Pressable
          onPress={triggerSOS}
          style={({ pressed }) => [
            styles.sosButton,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <LinearGradient
            colors={["#EF4444", "#B91C1C"]}
            style={styles.sosButtonInner}
          >
            <Ionicons name="call" size={40} color="#fff" />
            <Text style={styles.sosButtonText}>SOS</Text>
            <Text style={styles.sosButtonSub}>Tap to call emergency contacts</Text>
          </LinearGradient>
        </Pressable>

        {/* Contacts Header */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Emergency Contacts ({emergencyContacts.length}/{MAX_CONTACTS})
          </Text>
          {emergencyContacts.length < MAX_CONTACTS && !showForm && (
            <Pressable
              onPress={() => {
                setShowForm(true);
                setEditingId(null);
                setForm({ name: "", phone: "", relation: "" });
              }}
              style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          )}
        </View>

        <Text style={[styles.helperText, { color: theme.colors.subtitle }]}>
          Contacts are called in the order listed below. You can save up to {MAX_CONTACTS} emergency contacts.
        </Text>

        {/* Add/Edit Form */}
        {showForm && (
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
              {editingId ? "Edit Contact" : "New Emergency Contact"}
            </Text>

            <FormField
              label="Full Name *"
              placeholder="e.g. Mom, Rahul"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              error={formErrors.name}
              theme={theme}
              icon="person-outline"
            />
            <FormField
              label="Phone Number *"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
              error={formErrors.phone}
              keyboardType="phone-pad"
              theme={theme}
              icon="call-outline"
            />
            <FormField
              label="Relation (optional)"
              placeholder="e.g. Mother, Friend"
              value={form.relation}
              onChangeText={(v) => setForm((f) => ({ ...f, relation: v }))}
              theme={theme}
              icon="people-outline"
            />

            <View style={styles.formBtns}>
              <Pressable
                onPress={resetForm}
                style={[
                  styles.cancelFormBtn,
                  { borderColor: theme.colors.border },
                ]}
              >
                <Text style={{ color: theme.colors.subtitle, fontWeight: "700" }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[
                  styles.saveFormBtn,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {editingId ? "Update" : "Save Contact"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Contact List */}
        {emergencyContacts.length === 0 && !showForm && (
          <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
            <Ionicons
              name="people-outline"
              size={36}
              color={theme.colors.subtitle}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No emergency contacts yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.subtitle }]}>
              Add contacts so QuickFix can reach them during an emergency.
            </Text>
          </View>
        )}

        {emergencyContacts.map((contact, idx) => (
          <View
            key={contact.id}
            style={[
              styles.contactCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <View
              style={[
                styles.contactOrder,
                { backgroundColor: "#EF4444" },
              ]}
            >
              <Text style={styles.contactOrderText}>{idx + 1}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: theme.colors.text }]}>
                {contact.name}
              </Text>
              <Text
                style={[styles.contactPhone, { color: theme.colors.subtitle }]}
              >
                {contact.phone}
                {contact.relation ? " • " + contact.relation : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => handleEdit(contact)}
              style={[styles.iconAction, { backgroundColor: theme.colors.primary + "14" }]}
              hitSlop={8}
            >
              <Ionicons
                name="create-outline"
                size={17}
                color={theme.colors.primary}
              />
            </Pressable>
            <Pressable
              onPress={() => handleDelete(contact.id)}
              style={[styles.iconAction, { backgroundColor: theme.colors.error + "14", marginLeft: 8 }]}
              hitSlop={8}
            >
              <Ionicons
                name="trash-outline"
                size={17}
                color={theme.colors.error}
              />
            </Pressable>
          </View>
        ))}

        {/* Privacy note */}
        <View style={[styles.privacyNote, { borderColor: theme.colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.success} />
          <Text style={[styles.privacyText, { color: theme.colors.subtitle }]}>
            Your emergency contacts are stored securely on this device and are never shared.
          </Text>
        </View>
      </ScrollView>

      {/* --- SOS ACTIVE MODAL ----------------------------------------------- */}
      <Modal
        visible={sosModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl },
            ]}
          >
            {sosCountdown > 0 ? (
              <>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  SOS Activating in...
                </Text>
                <Text style={styles.countdown}>{sosCountdown}</Text>
                <Text style={[styles.modalSub, { color: theme.colors.subtitle }]}>
                  Calling {emergencyContacts[0]?.name || "contact"} next
                </Text>
                <Pressable onPress={cancelSOS} style={styles.cancelSOSBtn}>
                  <Text style={styles.cancelSOSText}>Cancel SOS</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.callingPulse}>
                  <Ionicons name="call" size={36} color="#fff" />
                </View>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Calling Emergency Contact
                </Text>
                <Text style={styles.callingName}>
                  {emergencyContacts[callingIndex]?.name || ""}
                </Text>
                <Text style={[styles.modalSub, { color: theme.colors.subtitle }]}>
                  {emergencyContacts[callingIndex]?.phone}
                </Text>
                <Text style={[styles.callProgress, { color: theme.colors.subtitle }]}>
                  Contact {callingIndex + 1} of {emergencyContacts.length}
                </Text>
                <Pressable onPress={cancelSOS} style={styles.cancelSOSBtn}>
                  <Text style={styles.cancelSOSText}>Stop SOS Calls</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  theme,
  icon,
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>{label}</Text>
      <View
        style={[
          styles.fieldRow,
          {
            backgroundColor: theme.colors.background,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={theme.colors.subtitle}
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.subtitle}
          keyboardType={keyboardType}
          style={{ flex: 1, color: theme.colors.text, fontSize: 14, fontWeight: "500" }}
        />
      </View>
      {error ? (
        <Text style={[styles.fieldError, { color: theme.colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 24,
    marginTop: 8,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  infoSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    lineHeight: 18,
  },
  sosButton: {
    alignSelf: "center",
    marginBottom: 32,
    borderRadius: 999,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  sosButtonInner: {
    width: 160,
    height: 160,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sosButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 6,
  },
  sosButtonSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  helperText: { fontSize: 12, fontWeight: "500", marginBottom: 18, lineHeight: 17 },
  formCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 18,
  },
  formTitle: { fontSize: 15, fontWeight: "800", marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "700", marginBottom: 7 },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  fieldError: { fontSize: 11, marginTop: 4, fontWeight: "500" },
  formBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelFormBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  saveFormBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  emptyCard: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", marginTop: 14, textAlign: "center" },
  emptySubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 17,
    paddingHorizontal: 16,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  contactOrder: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactOrderText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 14, fontWeight: "700" },
  contactPhone: { fontSize: 12, marginTop: 2 },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  privacyText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: "500" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    padding: 32,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 18,
    textAlign: "center",
  },
  countdown: {
    fontSize: 64,
    fontWeight: "900",
    color: "#EF4444",
    marginVertical: 10,
  },
  modalSub: { fontSize: 13, marginTop: 8, textAlign: "center" },
  callingPulse: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  callingName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#EF4444",
    marginTop: 16,
  },
  callProgress: { fontSize: 12, marginTop: 10, fontWeight: "600" },
  cancelSOSBtn: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "#EF444420",
  },
  cancelSOSText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "800",
  },
});