import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { Header, Card, Button } from "../components";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";

const FAQS = [
  {
    q: "How do I track my assigned service professional?",
    a: "Go to Bookings -> Select Active Booking -> tap 'Live Tracking'. You can monitor the real-time map location and arrival ETA.",
  },
  {
    q: "How does the Emergency SOS button work?",
    a: "Pressing the SOS button initiates an automatic sequential phone dialer trigger to your registered emergency contacts in order.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Yes! Open your booking details in the Bookings tab and tap 'Cancel Booking'. You can rebook anytime.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Cash on Delivery, and QuickFix Wallet.",
  },
];

export default function HelpSupportScreen({ navigation }) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! Welcome to QuickFix Support. How can we help you today?", sender: "bot" },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg.trim();
    const newMsgs = [...messages, { id: Date.now().toString(), text: userText, sender: "user" }];
    setMessages(newMsgs);
    setInputMsg("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out! A QuickFix support representative will connect with you shortly.";
      if (userText.toLowerCase().includes("sos") || userText.toLowerCase().includes("emergency")) {
        botReply = "For immediate emergencies, tap the red SOS button or call our emergency hotline directly at 1800-QUICKFIX.";
      } else if (userText.toLowerCase().includes("refund") || userText.toLowerCase().includes("cancel")) {
        botReply = "Cancellations made 1 hour prior to service are 100% refundable directly to your QuickFix Wallet.";
      }
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: botReply, sender: "bot" }]);
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Help & Support" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 30 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Contact Cards */}
        <View style={styles.contactRow}>
          <Pressable
            onPress={() => setChatVisible(true)}
            style={[styles.contactCard, { backgroundColor: theme.colors.primary + "14", borderColor: theme.colors.primary }]}
          >
            <Ionicons name="chatbubbles" size={26} color={theme.colors.primary} />
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Live Chat</Text>
            <Text style={[styles.contactSub, { color: theme.colors.subtitle }]}>Instant AI Assistant</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("tel:18001234567")}
            style={[styles.contactCard, { backgroundColor: theme.colors.success + "14", borderColor: theme.colors.success }]}
          >
            <Ionicons name="call" size={26} color={theme.colors.success} />
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Call Helpline</Text>
            <Text style={[styles.contactSub, { color: theme.colors.subtitle }]}>Toll Free 24/7</Text>
          </Pressable>
        </View>

        {/* FAQs Header */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>Frequently Asked Questions</Text>

        {FAQS.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <Card key={index} style={{ marginBottom: 10, padding: 14 }}>
              <Pressable
                onPress={() => setExpandedIndex(isExpanded ? null : index)}
                style={styles.faqHeader}
              >
                <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>{faq.q}</Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.colors.subtitle}
                />
              </Pressable>
              {isExpanded && (
                <Text style={[styles.faqAnswer, { color: theme.colors.subtitle }]}>{faq.a}</Text>
              )}
            </Card>
          );
        })}

        {/* Support Ticket Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtitle, marginTop: 24 }]}>Email Support</Text>
        <Card style={{ padding: 18 }}>
          <Text style={{ color: theme.colors.text, fontSize: 13.5, fontWeight: "700" }}>
            Have a specific issue with a booking?
          </Text>
          <Text style={{ color: theme.colors.subtitle, fontSize: 12, marginTop: 4 }}>
            Write to support@quickfix.app or raise a ticket directly from your completed booking screen.
          </Text>
          <Button
            title="Start Live Support Chat"
            variant="outline"
            onPress={() => setChatVisible(true)}
            style={{ marginTop: 14 }}
          />
        </Card>
      </ScrollView>

      {/* Live Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" onRequestClose={() => setChatVisible(false)}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Header
            title="QuickFix Support Chat"
            subtitle="Online 24/7"
            showBack
            onBack={() => setChatVisible(false)}
          />

          <ScrollView contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1, justifyContent: "flex-end" }}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.chatBubble,
                  m.sender === "user"
                    ? { backgroundColor: theme.colors.primary, alignSelf: "flex-end" }
                    : { backgroundColor: theme.colors.card, alignSelf: "flex-start", borderWidth: 1, borderColor: theme.colors.border },
                ]}
              >
                <Text style={{ color: m.sender === "user" ? "#fff" : theme.colors.text, fontSize: 13.5 }}>
                  {m.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.chatInputRow, { backgroundColor: theme.colors.card, borderTopWidth: 1, borderColor: theme.colors.border }]}>
            <TextInput
              value={inputMsg}
              onChangeText={setInputMsg}
              placeholder="Type your message..."
              placeholderTextColor={theme.colors.subtitle}
              style={{ flex: 1, color: theme.colors.text, fontSize: 14 }}
              onSubmitEditing={handleSendChat}
            />
            <Pressable onPress={handleSendChat} style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="send" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  contactRow: { flexDirection: "row", gap: 14 },
  contactCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
  },
  contactTitle: { fontSize: 14, fontWeight: "800", marginTop: 8 },
  contactSub: { fontSize: 11, marginTop: 2, fontWeight: "600" },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { fontSize: 13.5, fontWeight: "700", flex: 1, paddingRight: 10 },
  faqAnswer: { fontSize: 12.5, marginTop: 10, lineHeight: 18, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)", paddingTop: 8 },
  chatBubble: { maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  chatInputRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
});
