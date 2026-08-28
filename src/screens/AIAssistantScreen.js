import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { Header, Card } from "../components";
import ProblemUploader from "../components/ProblemUploader";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";
import { sendChatMessage } from "../services/api.js";
const isWeb = Platform.OS === "web";

const LANGUAGES = [
  { code: "en", name: "English", flag: "" },
  { code: "hi", name: "(Hindi)", flag: "" },
  { code: "te", name: "(Telugu)", flag: "" },
  { code: "ta", name: "(Tamil)", flag: "" },
  { code: "kn", name: "(Kannada)", flag: "" },
  { code: "mr", name: "(Marathi)", flag: "" },
  { code: "bn", name: "(Bengali)", flag: "" },
  { code: "es", name: "Español (Spanish)", flag: "" },
];

const MULTILINGUAL_RESPONSES = {
  en: {
    greeting: "Hello! I am QuickFix AI Assistant ??. How can I help you fix your home issues today?",
    placeholder: "Ask anything e.g. How to fix leaking tap or AC not cooling?",
    pipeLeak: "For pipe leakage: 1) Turn off main water valve. 2) Tap & Pipe Leak Repair costs ?199. Would you like me to book a plumber now?",
    acIssue: "AC not cooling usually means dirty air filter or gas refill needed. QuickFix AC Deep Service is ?599.",
    general: "I can help diagnose your problem, estimate costs, and book verified professionals instantly. Feel free to upload a photo of the repair area!",
  },
  hi: {
    greeting: "QuickFix AI",
    placeholder: "",
    pipeLeak: "For pipe leakage: 1) Turn off main water valve. 2) Tap & Pipe Leak Repair costs ?199. Would you like me to book a plumber now?",
    acIssue: "AC not cooling usually means dirty air filter or gas refill needed. QuickFix AC Deep Service is ?599.",
    general: "I can help diagnose your problem, estimate costs, and book verified professionals instantly. Feel free to upload a photo of the repair area!",
  },
  te: {
    greeting: "QuickFix AI",
    placeholder: "",
    pipeLeak: "1) Turn off main water valve. 2) Tap & Pipe Leak Repair costs ?199. Would you like me to book a plumber now?",
    acIssue: "AC not cooling usually means dirty air filter or gas refill needed. QuickFix AC Deep Service is ?599.",
    general: "I can help diagnose your problem, estimate costs, and book verified professionals instantly. Feel free to upload a photo of the repair area!",
  },
  ta: {
    greeting: "QuickFix AI",
    placeholder: "",
    pipeLeak: "For pipe leakage: 1) Turn off main water valve. 2) Tap & Pipe Leak Repair costs ?199. Would you like me to book a plumber now?",
    acIssue: "AC not cooling usually means dirty air filter or gas refill needed. QuickFix AC Deep Service is ?599.",
    general: "I can help diagnose your problem, estimate costs, and book verified professionals instantly. Feel free to upload a photo of the repair area!",
  },
};

export default function AIAssistantScreen({ navigation }) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const [sessionId] = useState(
    () => `quickfix_${Date.now()}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const t = MULTILINGUAL_RESPONSES[selectedLang] || MULTILINGUAL_RESPONSES.en;

  const [messages, setMessages] = useState([
    { id: "1", text: t.greeting, sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");


  const handleSend = async () => {
    const userMsg = inputText.trim();

    if (!userMsg || isLoading) return;

    // Add user message immediately
    const userMessage = {
      id: `user_${Date.now()}`,
      text: userMsg,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage(
        userMsg,
        sessionId
      );

      if (result.success) {
        const botMessage = {
          id: `bot_${Date.now()}`,
          text: result.response || "Sorry, I couldn't generate a response.",
          sender: "bot",
        };

        setMessages((prev) => [
          ...prev,
          botMessage,
        ]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("AI CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectLang = (code) => {
    setSelectedLang(code);
    setShowLangPicker(false);
    const newT = MULTILINGUAL_RESPONSES[code] || MULTILINGUAL_RESPONSES.en;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: `Language changed. ${newT.greeting}`, sender: "bot" },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title="AI Repair Assistant"
        subtitle={LANGUAGES.find((l) => l.code === selectedLang)?.name || "English"}
        showBack
        onBack={() => navigation.goBack()}
        rightIcon="globe-outline"
        onRightPress={() => setShowLangPicker(true)}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 90 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Selector Bar */}
        <Pressable
          onPress={() => setShowLangPicker(true)}
          style={[styles.langBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        >
          <Ionicons name="language" size={18} color={theme.colors.primary} />
          <Text style={[styles.langText, { color: theme.colors.text }]}>
            Current Language: {LANGUAGES.find((l) => l.code === selectedLang)?.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.subtitle} />
        </Pressable>

        {/* Upload Photo Button Toggle */}
        <Pressable
          onPress={() => setShowUploader(!showUploader)}
          style={[styles.uploadToggle, { backgroundColor: theme.colors.primary + "14", borderColor: theme.colors.primary }]}
        >
          <Ionicons name="camera-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.uploadToggleText, { color: theme.colors.primary }]}>
            {showUploader ? "Hide Photo Diagnoser" : "?? Upload Photo of Home Damage for AI Diagnosis"}
          </Text>
        </Pressable>

        {showUploader && (
          <ProblemUploader
            theme={theme}
            showAiAnalysis
            onSelectRecommendedService={(svcName) => {
              navigation.navigate("Categories");
            }}
          />
        )}

        {/* Messages Feed */}
        <View style={{ marginTop: 12, gap: 12 }}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.sender === "user"
                  ? { backgroundColor: theme.colors.primary, alignSelf: "flex-end" }
                  : { backgroundColor: theme.colors.card, alignSelf: "flex-start", borderWidth: 1, borderColor: theme.colors.border },
              ]}
            >
              <Text style={{ color: m.sender === "user" ? "#fff" : theme.colors.text, fontSize: 14, lineHeight: 20 }}>
                {m.text}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: theme.colors.card,
                  alignSelf: "flex-start",
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.subtitle,
                  fontSize: 14,
                }}
              >
                QuickFix AI is typing...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.card, borderTopWidth: 1, borderColor: theme.colors.border, paddingBottom: insets.bottom + 10 },
          isWeb && { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center" },
        ]}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={t.placeholder}
          placeholderTextColor={theme.colors.subtitle}
          style={{ flex: 1, color: theme.colors.text, fontSize: 14, paddingHorizontal: 12, paddingVertical: 10 }}
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
          style={[
            styles.sendBtn,
            {
              backgroundColor: theme.colors.primary,
              opacity: isLoading || !inputText.trim() ? 0.5 : 1,
            },
          ]}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </Pressable>
      </View>
      {/* Language Picker Modal */}
      <Modal visible={showLangPicker} transparent animationType="slide" onRequestClose={() => setShowLangPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select AI Preferred Language</Text>
            <ScrollView style={{ maxHeight: 320, marginTop: 14 }}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => handleSelectLang(lang.code)}
                  style={[
                    styles.langRow,
                    { borderColor: theme.colors.border },
                    selectedLang === lang.code && { backgroundColor: theme.colors.primary + "14" },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>{lang.flag}</Text>
                  <Text style={[styles.langRowText, { color: theme.colors.text, fontWeight: selectedLang === lang.code ? "800" : "600" }]}>
                    {lang.name}
                  </Text>
                  {selectedLang === lang.code && <Ionicons name="checkmark" size={18} color={theme.colors.primary} />}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowLangPicker(false)} style={styles.closeBtn}>
              <Text style={{ color: theme.colors.subtitle, fontWeight: "700" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 12 },
  langBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  langText: { flex: 1, fontSize: 13, fontWeight: "700" },
  uploadToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  uploadToggleText: { fontSize: 13, fontWeight: "800" },
  bubble: { maxWidth: "84%", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalCard: { width: "100%", maxWidth: 380, padding: 24 },
  modalTitle: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  langRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderWidth: 1, borderRadius: 12, marginBottom: 8 },
  langRowText: { flex: 1, fontSize: 14 },
  closeBtn: { alignSelf: "center", marginTop: 14, paddingVertical: 6 },
});