import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Avatar, Button, MapCard, Badge, SOSButton } from "../components";
import { professionals } from "../data/dummyData";
import { useResponsive } from "../utils/responsive";
import {
  resolveAccurateLocation,
  getWorkerOriginLocation,
} from "../services/mappls";

const isWeb = Platform.OS === "web";

export default function LiveTrackingScreen({ navigation }) {
  const { theme, activeBooking, user } = useApp();
  const insets = useSafeAreaInsets();
  const { isMobile, isTablet, isDesktop, height: screenHeight, webContainerStyle } = useResponsive();

  const pro = activeBooking?.professional || professionals[0];
  const [minsLeft, setMinsLeft] = useState(8);
  const [kmsLeft, setKmsLeft] = useState(1.4);

  // User's accurate house coordinates in Marturu
  const userHouseCoords = resolveAccurateLocation(user?.location, user?.coords);
  const workerOriginCoords = getWorkerOriginLocation(userHouseCoords, user?.location);

  const isWideLayout = !isMobile;
  const mapHeight = isWideLayout ? Math.max(520, screenHeight - 180) : 340;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: insets.top + (isWeb ? 14 : 10),
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={[webContainerStyle, styles.headerContent]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.headerBackBtn, { backgroundColor: theme.colors.background }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </Pressable>

          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Live Worker Tracking</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.subtitle }]} numberOfLines={1}>
              {pro.name} is on the way to {user?.location || "Marturu"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SOSButton onManageContacts={() => navigation.navigate("SOS")} />
          </View>
        </View>
      </View>

      {/* Main Body */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={webContainerStyle}>
          {isWideLayout ? (
            /* ─── DESKTOP / TABLET: 2-COLUMN BALANCED DASHBOARD ─── */
            <View style={styles.wideRow}>
              {/* Left Column (60%): Interactive Map */}
              <View style={styles.wideMapCol}>
                <MapCard
                  origin={workerOriginCoords}
                  destination={userHouseCoords}
                  workerName={pro.name}
                  height={mapHeight}
                  onEtaUpdate={setMinsLeft}
                  onDistanceUpdate={setKmsLeft}
                />
              </View>

              {/* Right Column (40%): Clean Status Panel */}
              <View style={styles.wideDetailsCol}>
                {/* Live ETA Card */}
                <EtaCard theme={theme} minsLeft={minsLeft} kmsLeft={kmsLeft} />

                {/* Professional Details Card */}
                <ProfessionalDetailsCard pro={pro} theme={theme} />

                {/* Live Tracking Timeline */}
                <TimelineCard theme={theme} proName={pro.name} minsLeft={minsLeft} />

                {/* Security OTP Card */}
                <SecurityOtpCard theme={theme} />

                {/* Route Landmarks */}
                <RoutePointsCard
                  theme={theme}
                  originAddress={workerOriginCoords.address || "QuickFix Express Hub, Marturu"}
                  destAddress={user?.location || "Your House, Marturu"}
                />

                {/* Action Button */}
                <Button
                  title="Proceed to Payment"
                  onPress={() => navigation.navigate("Payment")}
                  style={{ marginTop: 14 }}
                  icon="card-outline"
                  iconPosition="left"
                />
              </View>
            </View>
          ) : (
            /* ─── MOBILE: CLEAN STACKED VIEW ─── */
            <View>
              {/* Interactive Map */}
              <MapCard
                origin={workerOriginCoords}
                destination={userHouseCoords}
                workerName={pro.name}
                height={mapHeight}
                onEtaUpdate={setMinsLeft}
                onDistanceUpdate={setKmsLeft}
              />

              <View style={{ marginTop: 14 }}>
                {/* Live ETA Card */}
                <EtaCard theme={theme} minsLeft={minsLeft} kmsLeft={kmsLeft} />

                {/* Professional Details Card */}
                <ProfessionalDetailsCard pro={pro} theme={theme} />

                {/* Security OTP Card */}
                <SecurityOtpCard theme={theme} />

                {/* Live Tracking Timeline */}
                <TimelineCard theme={theme} proName={pro.name} minsLeft={minsLeft} />

                {/* Route Landmarks */}
                <RoutePointsCard
                  theme={theme}
                  originAddress={workerOriginCoords.address || "QuickFix Express Hub, Marturu"}
                  destAddress={user?.location || "Your House, Marturu"}
                />

                <Button
                  title="Proceed to Payment"
                  onPress={() => navigation.navigate("Payment")}
                  style={{ marginTop: 14 }}
                  icon="card-outline"
                  iconPosition="left"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── SUB-COMPONENTS FOR CLEAN, UNDERSTANDABLE UI ─── */

function EtaCard({ theme, minsLeft, kmsLeft }) {
  const arrived = minsLeft <= 1;
  return (
    <View
      style={[
        styles.etaCard,
        {
          backgroundColor: arrived ? "rgba(34,197,94,0.1)" : "rgba(13,110,253,0.08)",
          borderColor: arrived ? "rgba(34,197,94,0.3)" : "rgba(13,110,253,0.25)",
        },
      ]}
    >
      <View
        style={[
          styles.etaIconCircle,
          { backgroundColor: arrived ? theme.colors.success : theme.colors.primary },
        ]}
      >
        <Ionicons name={arrived ? "checkmark-circle" : "bicycle"} size={22} color="#fff" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.etaTitleText,
            { color: arrived ? theme.colors.success : theme.colors.primary },
          ]}
        >
          {arrived ? "Worker has arrived at your house!" : `Arriving in ~${minsLeft} mins`}
        </Text>
        <Text style={[styles.etaSubtitleText, { color: theme.colors.subtitle }]}>
          {arrived ? "Please share OTP to begin" : `${kmsLeft} km away · Moving along NH16 route`}
        </Text>
      </View>
    </View>
  );
}

function ProfessionalDetailsCard({ pro, theme }) {
  return (
    <View
      style={[
        styles.proCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        theme.shadow.card,
      ]}
    >
      <Avatar name={pro.name} size={52} color={pro.avatarColor} verified={pro.verified} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.proNameText, { color: theme.colors.text }]}>{pro.name}</Text>
        <Text style={{ color: theme.colors.subtitle, fontSize: 12, marginTop: 1 }}>
          {pro.role || "Certified Specialist"} · ⭐ {pro.rating || "4.9"} (1,240 jobs)
        </Text>
        <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: "700", marginTop: 2 }}>
          🛵 Honda Activa 6G (AP 27 AB 1234)
        </Text>
      </View>
      <View style={styles.proActionBtns}>
        <Pressable
          onPress={() => Linking.openURL(`tel:${pro.phone || "+919876543210"}`)}
          style={[styles.iconActionBtn, { backgroundColor: theme.colors.success }]}
        >
          <Ionicons name="call" size={17} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`sms:${pro.phone || "+919876543210"}`)}
          style={[styles.iconActionBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function SecurityOtpCard({ theme }) {
  return (
    <View
      style={[
        styles.otpCard,
        {
          backgroundColor: "rgba(13,110,253,0.06)",
          borderColor: "rgba(13,110,253,0.2)",
        },
      ]}
    >
      <View style={styles.otpLeft}>
        <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={[styles.otpLabel, { color: theme.colors.text }]}>Service Verification Code</Text>
          <Text style={{ color: theme.colors.subtitle, fontSize: 11, marginTop: 1 }}>
            Share this 4-digit OTP only with your professional on arrival
          </Text>
        </View>
      </View>
      <View style={[styles.otpBadge, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.otpCodeText}>4821</Text>
      </View>
    </View>
  );
}

function TimelineCard({ theme, proName, minsLeft }) {
  return (
    <View
      style={[
        styles.timelineCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>Live Service Progress</Text>

      {/* Step 1: Confirmed */}
      <View style={styles.timelineRow}>
        <View style={[styles.timelineDot, { backgroundColor: theme.colors.success }]}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.timelineStepTitle, { color: theme.colors.text }]}>Booking Confirmed</Text>
          <Text style={{ color: theme.colors.subtitle, fontSize: 11 }}>Order received by Marturu station</Text>
        </View>
      </View>

      <View style={[styles.timelineConnector, { backgroundColor: theme.colors.success }]} />

      {/* Step 2: Assigned */}
      <View style={styles.timelineRow}>
        <View style={[styles.timelineDot, { backgroundColor: theme.colors.success }]}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.timelineStepTitle, { color: theme.colors.text }]}>Specialist Dispatched</Text>
          <Text style={{ color: theme.colors.subtitle, fontSize: 11 }}>{proName} assigned & equipped</Text>
        </View>
      </View>

      <View style={[styles.timelineConnector, { backgroundColor: theme.colors.primary }]} />

      {/* Step 3: On The Way */}
      <View style={styles.timelineRow}>
        <View style={[styles.timelineDot, { backgroundColor: theme.colors.primary }]}>
          <Text style={{ fontSize: 11 }}>🛵</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.timelineStepTitle, { color: theme.colors.primary }]}>
            On The Way (Live Map Tracking)
          </Text>
          <Text style={{ color: theme.colors.subtitle, fontSize: 11 }}>
            Estimated arrival in {minsLeft} minutes
          </Text>
        </View>
      </View>
    </View>
  );
}

function RoutePointsCard({ theme, originAddress, destAddress }) {
  return (
    <View
      style={[
        styles.routeCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>Trip Route Locations</Text>

      {/* Hub */}
      <View style={styles.routeRow}>
        <View style={[styles.pointCircle, { backgroundColor: "rgba(13,110,253,0.15)" }]}>
          <Text style={{ fontSize: 12 }}>🏬</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.pointSubText}>DISPATCH STATION</Text>
          <Text style={[styles.pointMainText, { color: theme.colors.text }]} numberOfLines={1}>
            {originAddress}
          </Text>
        </View>
      </View>

      <View style={styles.routeVerticalDash} />

      {/* House */}
      <View style={styles.routeRow}>
        <View style={[styles.pointCircle, { backgroundColor: "rgba(34,197,94,0.15)" }]}>
          <Text style={{ fontSize: 12 }}>🏠</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.pointSubText}>DESTINATION (YOUR HOUSE)</Text>
          <Text style={[styles.pointMainText, { color: theme.colors.text }]} numberOfLines={1}>
            {destAddress}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  headerSubtitle: { fontSize: 12, marginTop: 1 },

  // Wide layout styles (Desktop & Tablet)
  wideRow: {
    flexDirection: "row",
    gap: 24,
  },
  wideMapCol: {
    flex: 3,
  },
  wideDetailsCol: {
    flex: 2,
    gap: 12,
  },

  // Card styles
  etaCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  etaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  etaTitleText: { fontSize: 14.5, fontWeight: "800" },
  etaSubtitleText: { fontSize: 12, marginTop: 2, fontWeight: "500" },

  proCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  proNameText: { fontSize: 15, fontWeight: "800" },
  proActionBtns: { flexDirection: "row", gap: 8 },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  otpCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  otpLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  otpLabel: { fontSize: 13, fontWeight: "800" },
  otpBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  otpCodeText: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 2 },

  timelineCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionHeading: { fontSize: 13.5, fontWeight: "800", marginBottom: 12 },
  timelineRow: { flexDirection: "row", alignItems: "center" },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineStepTitle: { fontSize: 13, fontWeight: "700" },
  timelineConnector: {
    width: 2,
    height: 16,
    marginLeft: 11,
    marginVertical: 2,
  },

  routeCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 8,
  },
  routeRow: { flexDirection: "row", alignItems: "center" },
  pointCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pointSubText: { fontSize: 9.5, fontWeight: "800", color: "#64748B", letterSpacing: 0.5 },
  pointMainText: { fontSize: 12.5, fontWeight: "700", marginTop: 1 },
  routeVerticalDash: {
    width: 2,
    height: 14,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(13,110,253,0.3)",
    borderStyle: "dashed",
    marginLeft: 13,
    marginVertical: 2,
  },
});