import React, { useRef, useCallback, useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  Vibration,
  Modal,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { useSOS } from "../context/SOSContext";
import { useApp } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

const isWeb = Platform.OS === "web";

function showAlert(title, message, buttons) {
  if (!buttons) buttons = [{ text: "OK" }];
  if (isWeb && typeof window !== "undefined") {
    if (buttons.length <= 1) {
      window.alert(title + "\n\n" + message);
      if (buttons[0] && buttons[0].onPress) buttons[0].onPress();
    } else {
      var result = window.confirm(title + "\n\n" + message);
      if (result && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      } else if (!result && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}

function makePhoneCall(phoneNumber) {
  var cleaned = phoneNumber.replace(/\s/g, "");
  if (isWeb && typeof window !== "undefined") {
    window.open("tel:" + cleaned, "_self");
  } else {
    var url = Platform.OS === "android" ? "tel:" + cleaned : "telprompt:" + cleaned;
    Linking.canOpenURL(url).then(function (supported) {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }
}

export default function SOSButton({ onManageContacts, style }) {
  const { emergencyContacts } = useSOS();
  const { theme } = useApp();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);
  const [callingIndex, setCallingIndex] = useState(0);
  const countdownRef = useRef(null);

  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
    return () => cancelAnimation(pulse);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulse.value }],
  }));

  const makeCall = useCallback(
    (index) => {
      if (index >= emergencyContacts.length) {
        setModalVisible(false);
        clearTimeout(countdownRef.current);
        showAlert("SOS Complete", "All emergency contacts have been notified. Stay safe!");
        return;
      }
      const contact = emergencyContacts[index];
      setCallingIndex(index);
      makePhoneCall(contact.phone);
      countdownRef.current = setTimeout(() => {
        makeCall(index + 1);
      }, 5000);
    },
    [emergencyContacts]
  );

  const handleSOSPress = () => {
    if (emergencyContacts.length === 0) {
      showAlert(
        "No Emergency Contacts",
        "Add emergency contacts so QuickFix can reach them during an emergency.",
        [
          {
            text: "Add Contacts Now",
            onPress: () => {
              if (onManageContacts) onManageContacts();
              else navigation.navigate("SOS");
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }
    if (Platform.OS !== "web") Vibration.vibrate([0, 300, 200, 300]);
    setCallingIndex(0);
    setSosCountdown(3);
    setModalVisible(true);
    let count = 3;
    const tick = () => {
      count -= 1;
      if (count > 0) {
        setSosCountdown(count);
        countdownRef.current = setTimeout(tick, 1000);
      } else {
        setSosCountdown(0);
        makeCall(0);
      }
    };
    countdownRef.current = setTimeout(tick, 1000);
  };

  const cancelSOS = () => {
    clearTimeout(countdownRef.current);
    setModalVisible(false);
  };

  return (
    <>
      <Animated.View style={[styles.topRightWrap, animatedStyle, style]}>
        <Pressable
          onPress={handleSOSPress}
          onPressIn={() => {
            scale.value = withTiming(0.92, { duration: 80 });
          }}
          onPressOut={() => {
            scale.value = withTiming(1, { duration: 100 });
          }}
          style={styles.sosInner}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS"
        >
          <Ionicons name="warning" size={15} color="#fff" />
          <Text style={styles.sosText}>SOS</Text>
        </Pressable>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: 24 }]}>
            {sosCountdown > 0 ? (
              <>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>SOS Activating in...</Text>
                <Text style={styles.countdownText}>{sosCountdown}</Text>
                <Text style={[styles.cardSub, { color: theme.colors.subtitle }]}>
                  Will call {emergencyContacts[0] ? emergencyContacts[0].name : "contact"}
                </Text>
                <Pressable onPress={cancelSOS} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancel SOS</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.callingCircle}>
                  <Ionicons name="call" size={32} color="#fff" />
                </View>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Calling Emergency Contact</Text>
                <Text style={styles.callingName}>
                  {emergencyContacts[callingIndex] ? emergencyContacts[callingIndex].name : ""}
                </Text>
                <Text style={[styles.cardSub, { color: theme.colors.subtitle }]}>
                  {emergencyContacts[callingIndex] ? emergencyContacts[callingIndex].phone : ""}
                </Text>
                <Text style={[styles.callProgress, { color: theme.colors.subtitle }]}>
                  Contact {callingIndex + 1} of {emergencyContacts.length}
                </Text>
                <Pressable onPress={cancelSOS} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Stop Calling</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  topRightWrap: {
    borderRadius: 999,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sosInner: {
    backgroundColor: "#EF4444",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sosText: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "900",
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    padding: 28,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
    textAlign: "center",
  },
  countdownText: {
    fontSize: 60,
    fontWeight: "900",
    color: "#EF4444",
    marginVertical: 6,
  },
  cardSub: { fontSize: 13, marginTop: 6, textAlign: "center" },
  callingCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  callingName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#EF4444",
    marginTop: 14,
  },
  callProgress: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 22,
    paddingVertical: 11,
    paddingHorizontal: 26,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },
  cancelText: { color: "#EF4444", fontSize: 13.5, fontWeight: "800" },
});