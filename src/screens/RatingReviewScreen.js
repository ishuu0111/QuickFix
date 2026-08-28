import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Button, RatingStars, Avatar } from "../components";
import { SuccessCheck } from "../components/Illustration";
import { submitReview } from "../services/api";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";
const TAGS = ["On time", "Professional", "Great work", "Friendly", "Clean finish", "Good value"];

export default function RatingReviewScreen({ navigation, route }) {
  const { theme, activeBooking, rateBooking } = useApp();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitReview({ rating, review, tags });
      // Mark the active booking as rated
      if (activeBooking?.bookingId) {
        rateBooking(activeBooking.bookingId);
      }
    } catch (_) {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <View style={[styles.center, isWeb && { maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center", width: "100%" }]}>
          <SuccessCheck size={110} />
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>Thank you for your feedback!</Text>
          <Text style={[styles.successSubtitle, { color: theme.colors.subtitle }]}>
            Your review helps us improve our service quality
          </Text>
        </View>
        <Button
          title="Back to Home"
          size="lg"
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          style={{ marginHorizontal: 24, marginBottom: insets.bottom + 20 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={[styles.scroll, isWeb && { maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center", width: "100%" }]}>
        <Animated.View entering={FadeInUp.duration(400)} style={styles.center}>
          <Avatar name={activeBooking?.professional?.name || "Professional"} size={72} color={activeBooking?.professional?.avatarColor} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Rate your experience</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
            How was your service with {activeBooking?.professional?.name || "our professional"}?
          </Text>
          <View style={{ marginTop: 22 }}>
            <RatingStars rating={rating} editable onChange={setRating} size={38} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150).duration(400)} style={styles.tagsWrap}>
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[
                  styles.tagChip,
                  { backgroundColor: active ? theme.colors.primary : theme.colors.card, borderColor: active ? theme.colors.primary : theme.colors.border },
                ]}
              >
                <Text style={{ color: active ? "#fff" : theme.colors.text, fontSize: 12, fontWeight: "700" }}>{tag}</Text>
              </Pressable>
            );
          })}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Write a review (optional)..."
            placeholderTextColor={theme.colors.subtitle}
            multiline
            style={[
              styles.textArea,
              { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
            ]}
          />
        </Animated.View>
      </View>

      <Button
        title={loading ? "Submitting..." : "Submit Review"}
        size="lg"
        onPress={handleSubmit}
        disabled={loading}
        style={{ marginHorizontal: 24, marginBottom: insets.bottom + 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  scroll: { paddingHorizontal: 24, paddingTop: 20 },
  center: { alignItems: "center" },
  title: { fontSize: 20, fontWeight: "800", marginTop: 18 },
  subtitle: { fontSize: 13, textAlign: "center", marginTop: 8, lineHeight: 19, paddingHorizontal: 10 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 28, justifyContent: "center" },
  tagChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  textArea: { marginTop: 24, minHeight: 110, padding: 16, fontSize: 14, borderWidth: 1, textAlignVertical: "top" },
  successTitle: { fontSize: 19, fontWeight: "800", marginTop: 24, textAlign: "center" },
  successSubtitle: { fontSize: 13, textAlign: "center", marginTop: 10, lineHeight: 19, paddingHorizontal: 30 },
});
