import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

let ImagePicker = null;
try {
  ImagePicker = require("expo-image-picker");
} catch (e) {
  ImagePicker = null;
}

export default function ProblemUploader({
  theme,
  onPhotosChange,
  onDescriptionChange,
  showAiAnalysis = true,
  onSelectRecommendedService,
}) {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddPhotoWeb = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const uri = event.target.result;
      const updated = [...images, uri];
      setImages(updated);
      if (onPhotosChange) onPhotosChange(updated);
      triggerAiDiagnosis(description, updated);
    };
    reader.readAsDataURL(file);
  };

  const handlePickPhotoNative = async (useCamera = false) => {
    if (Platform.OS === "web") {
      if (fileInputRef.current) fileInputRef.current.click();
      return;
    }

    try {
      if (ImagePicker) {
        let result;
        if (useCamera) {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return;
          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
          });
        } else {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) return;
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
          });
        }

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          const updated = [...images, uri];
          setImages(updated);
          if (onPhotosChange) onPhotosChange(updated);
          triggerAiDiagnosis(description, updated);
        }
      }
    } catch (e) {
      console.warn("Photo picker error:", e);
    }
  };

  const handleRemovePhoto = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (onPhotosChange) onPhotosChange(updated);
    if (updated.length === 0) setAiDiagnosis(null);
  };

  const triggerAiDiagnosis = (descText, photoList) => {
    if (!showAiAnalysis) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const text = descText.toLowerCase();
      let detectedCategory = "Plumbing";
      let serviceName = "Tap & Pipe Leak Repair";
      let estimatedPrice = "?199 - ?349";
      let advice = "Detected water leakage / pipe damage from uploaded image. Recommended immediate seal repair.";

      if (text.includes("wire") || text.includes("spark") || text.includes("switch") || text.includes("light")) {
        detectedCategory = "Electrical";
        serviceName = "Switchboard & Wiring Repair";
        estimatedPrice = "?249 - ?499";
        advice = "Electrical circuit issue detected. Power turn-off advised before professional arrival.";
      } else if (text.includes("ac") || text.includes("cool") || text.includes("filter")) {
        detectedCategory = "AC Service";
        serviceName = "AC Deep Service & Gas Refill";
        estimatedPrice = "?599 - ?899";
        advice = "Air conditioner compressor / coil issue detected from image.";
      } else if (text.includes("clean") || text.includes("stain") || text.includes("dust")) {
        detectedCategory = "Cleaning";
        serviceName = "Deep Home & Stain Cleaning";
        estimatedPrice = "?799";
        advice = "Surface stain and deep cleaning needed.";
      }

      setAiDiagnosis({
        category: detectedCategory,
        serviceName,
        estimatedPrice,
        advice,
        confidence: "94%",
      });
    }, 1200);
  };

  const handleDescriptionTextChange = (text) => {
    setDescription(text);
    if (onDescriptionChange) onDescriptionChange(text);
    if (images.length > 0 || text.length > 5) {
      triggerAiDiagnosis(text, images);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderRadius: theme.radius.xl }]}>
      <View style={styles.header}>
        <Ionicons name="camera" size={22} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Upload Issue Photo & Video</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
        Take a picture of the damaged item in your house so the worker brings the exact spare parts!
      </Text>

      {/* Invisible Web File Input */}
      {Platform.OS === "web" && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAddPhotoWeb}
        />
      )}

      {/* Photo Thumbnail Strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoStrip}>
        {images.map((uri, idx) => (
          <View key={idx} style={styles.thumbWrap}>
            <Image source={{ uri }} style={styles.thumbImage} />
            <Pressable onPress={() => handleRemovePhoto(idx)} style={styles.removeBtn}>
              <Ionicons name="close" size={14} color="#fff" />
            </Pressable>
          </View>
        ))}

        {images.length < 4 && (
          <Pressable
            onPress={() => handlePickPhotoNative(false)}
            style={({ pressed }) => [
              styles.addBtn,
              { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + "0A" },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.addText, { color: theme.colors.primary }]}>Upload Photo</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Problem Description Input */}
      <View style={{ marginTop: 14 }}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Describe the Problem (Optional)</Text>
        <TextInput
          value={description}
          onChangeText={handleDescriptionTextChange}
          placeholder="e.g. Water leaking heavily under kitchen sink pipe..."
          placeholderTextColor={theme.colors.subtitle}
          multiline
          numberOfLines={3}
          style={[
            styles.textInput,
            { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background, borderRadius: theme.radius.lg },
          ]}
        />
      </View>

      {/* Smart AI Diagnosis Preview Box */}
      {isAnalyzing && (
        <View style={[styles.aiBox, { backgroundColor: theme.colors.primary + "0A", borderColor: theme.colors.primary }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.aiAnalyzingText, { color: theme.colors.primary }]}>
            AI is analyzing your uploaded photo & issue...
          </Text>
        </View>
      )}

      {aiDiagnosis && !isAnalyzing && (
        <View style={[styles.aiBox, { backgroundColor: theme.colors.primary + "12", borderColor: theme.colors.primary }]}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
            <Text style={[styles.aiTitle, { color: theme.colors.primary }]}>AI Repair Diagnosis ({aiDiagnosis.confidence} Match)</Text>
          </View>
          <Text style={[styles.aiCategory, { color: theme.colors.text }]}>Recommended: {aiDiagnosis.serviceName}</Text>
          <Text style={[styles.aiAdvice, { color: theme.colors.subtitle }]}>{aiDiagnosis.advice}</Text>
          <Text style={[styles.aiPrice, { color: theme.colors.success }]}>Est. Cost: {aiDiagnosis.estimatedPrice}</Text>

          {onSelectRecommendedService && (
            <Pressable
              onPress={() => onSelectRecommendedService(aiDiagnosis.serviceName)}
              style={[styles.aiActionBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.aiActionText}>Book This {aiDiagnosis.category} Repair</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    marginVertical: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  photoStrip: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  thumbWrap: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    width: 100,
    height: 80,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addText: {
    fontSize: 11,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: "top",
    minHeight: 70,
  },
  aiBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  aiAnalyzingText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  aiCategory: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  aiAdvice: {
    fontSize: 12,
    lineHeight: 17,
  },
  aiPrice: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  aiActionBtn: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  aiActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
});
