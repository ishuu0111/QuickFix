import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { SearchBar, CategoryCard, ServiceCard, ProfessionalCard, Avatar, SOSButton } from "../components";
import ReferralModal from "../components/ReferralModal";
import { categories, banners, services, professionals } from "../data/dummyData";
import { useResponsive, useScrollBottomPad } from "../utils/responsive";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const isWeb = Platform.OS === "web";

export default function HomeScreen({ navigation }) {
  const { theme, user, detectLocation, isLocating } = useApp();
  const insets = useSafeAreaInsets();
  const { isMobile, isTablet, isDesktop, width: screenWidth, webContainerStyle } = useResponsive();
  const [activeBanner, setActiveBanner] = useState(0);
  const [search, setSearch] = useState("");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);
  const bottomPad = useScrollBottomPad();

  // Mobile banner carousel dimensions
  const MOBILE_BANNER_WIDTH = Math.min(screenWidth - 32, 440);

  const onBannerScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / MOBILE_BANNER_WIDTH);
    setActiveBanner(idx);
  };

  const filteredServices = debouncedSearch
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : services;

  const filteredProfessionals = debouncedSearch
    ? professionals.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.role.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : professionals;

  const topRated = [...filteredServices].sort((a, b) => b.rating - a.rating);
  const isFiltering = debouncedSearch.length > 0;

  // Responsive column counts
  const serviceCols = isDesktop ? 3 : isTablet ? 3 : 2;
  const categoryCols = isDesktop ? 8 : 4;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + (isWeb ? 16 : 10),
        paddingBottom: bottomPad,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Central Responsive Shell that adapts to phone / tab / laptop / desktop */}
      <View style={webContainerStyle}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.greeting, { color: theme.colors.subtitle }]}>
              Hello, {user?.name ? user.name.split(" ")[0] : "User"} 👋
            </Text>
            <Pressable
              onPress={detectLocation}
              style={({ pressed }) => [styles.locationRow, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="location" size={17} color={theme.colors.primary} />
              <Text style={[styles.locationText, { color: theme.colors.text }]} numberOfLines={1}>
                {user.location || "Marturu"}
              </Text>
              {isLocating ? (
                <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginLeft: 4 }} />
              ) : (
                <Ionicons name="locate-outline" size={16} color={theme.colors.primary} style={{ marginLeft: 2 }} />
              )}
            </Pressable>
          </View>

          {/* Right Header Actions */}
          <View style={styles.topRightActions}>
            <SOSButton onManageContacts={() => navigation.navigate("SOS")} />
            <Pressable onPress={() => navigation.navigate("Profile")} style={styles.avatarPressable}>
              <Avatar name={user.name} size={isMobile ? 42 : 46} color={user.avatarColor} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onFilterPress={() => navigation.navigate("Categories")}
            placeholder="Search for repair, cleaning, plumbing, electricians..."
          />
        </View>

        {/* Filtered Search View */}
        {isFiltering ? (
          <>
            <SectionHeader title={`Results for "${debouncedSearch}"`} theme={theme} />
            {filteredServices.length === 0 && filteredProfessionals.length === 0 ? (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={40} color={theme.colors.subtitle} />
                <Text style={[styles.noResultsText, { color: theme.colors.subtitle }]}>
                  No matching services or specialists found
                </Text>
              </View>
            ) : (
              <View style={styles.gridWrap}>
                {filteredServices.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.delay(index * 40).duration(300)}
                    style={{ width: `${100 / (isMobile ? 1 : 2)}%`, padding: 6 }}
                  >
                    <ServiceCard
                      service={item}
                      horizontal
                      onPress={() => navigation.navigate("ServiceDetails", { service: item })}
                    />
                  </Animated.View>
                ))}
                {filteredProfessionals.map((pro, index) => (
                  <Animated.View
                    key={pro.id}
                    entering={FadeInDown.delay(index * 40).duration(300)}
                    style={{ width: `${100 / (isMobile ? 1 : 2)}%`, padding: 6 }}
                  >
                    <ProfessionalCard
                      professional={pro}
                      onPress={() => navigation.navigate("ServiceDetails", { service: services[0] })}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            {/* Promotional Banners: 3-column row on Desktop / Tablet; Carousel on Mobile */}
            {!isMobile ? (
              <View style={styles.desktopBannerRow}>
                {banners.map((item) => (
                  <LinearGradient
                    key={item.id}
                    colors={item.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.desktopBannerCard, { borderRadius: theme.radius.xl }]}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={styles.bannerTitle}>{item.title}</Text>
                      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.bannerIconWrap}>
                      <Ionicons name={item.icon} size={30} color="#fff" />
                    </View>
                  </LinearGradient>
                ))}
              </View>
            ) : (
              <View style={{ marginTop: 16 }}>
                <FlatList
                  data={banners}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={onBannerScroll}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ gap: 12 }}
                  renderItem={({ item }) => (
                    <LinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.banner, { width: MOBILE_BANNER_WIDTH, borderRadius: theme.radius.xl }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bannerTitle}>{item.title}</Text>
                        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                      </View>
                      <View style={styles.bannerIconWrap}>
                        <Ionicons name={item.icon} size={32} color="#fff" />
                      </View>
                    </LinearGradient>
                  )}
                />
                <View style={styles.dotsRow}>
                  {banners.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: i === activeBanner ? theme.colors.primary : theme.colors.border,
                          width: i === activeBanner ? 20 : 6,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Popular Services: 3x2 Grid on Desktop / Tablet (zero orphaned cards!) */}
            <SectionHeader
              title="Popular Services"
              onPress={() => navigation.navigate("Categories")}
              theme={theme}
            />
            <View style={styles.gridWrap}>
              {services.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(index * 40).duration(350)}
                  style={{ width: `${100 / serviceCols}%`, padding: 6 }}
                >
                  <ServiceCard
                    service={item}
                    fillWidth
                    onPress={() => navigation.navigate("ServiceDetails", { service: item })}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Categories: Clean Grid across all 8 Categories */}
            <SectionHeader
              title="Service Categories"
              onPress={() => navigation.navigate("Categories")}
              theme={theme}
            />
            <View style={styles.gridWrap}>
              {categories.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: `${100 / categoryCols}%`,
                    padding: 6,
                    alignItems: "center",
                  }}
                >
                  <CategoryCard
                    category={item}
                    onPress={() => navigation.navigate("Categories", { categoryId: item.id })}
                  />
                </View>
              ))}
            </View>

            {/* Featured Professionals */}
            <SectionHeader title="Verified Specialists Nearby" theme={theme} />
            <View style={styles.gridWrap}>
              {professionals.slice(0, isMobile ? 2 : 2).map((pro, index) => (
                <Animated.View
                  key={pro.id}
                  entering={FadeInDown.delay(index * 60).duration(400)}
                  style={{ width: `${100 / (isMobile ? 1 : 2)}%`, padding: 6 }}
                >
                  <ProfessionalCard
                    professional={pro}
                    onPress={() => navigation.navigate("ServiceDetails", { service: topRated[0] })}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Top Rated Services */}
            <SectionHeader title="Top Rated Services" theme={theme} />
            <View style={styles.gridWrap}>
              {topRated.slice(0, isMobile ? 3 : 3).map((s, index) => (
                <Animated.View
                  key={s.id}
                  entering={FadeIn.delay(index * 60).duration(400)}
                  style={{ width: `${100 / (isMobile ? 1 : 3)}%`, padding: 6 }}
                >
                  <ServiceCard
                    service={s}
                    horizontal
                    onPress={() => navigation.navigate("ServiceDetails", { service: s })}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Refer & Earn Card */}
            <View style={{ marginTop: 18, marginBottom: 8 }}>
              <Pressable onPress={() => setShowReferralModal(true)}>
                <LinearGradient
                  colors={theme.gradients.dark}
                  style={[styles.offerCard, { borderRadius: theme.radius.xl }]}
                >
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={styles.offerTitle}>Refer & Earn ₹150 Wallet Cash</Text>
                    <Text style={styles.offerSubtitle}>
                      Share QuickFix with friends in Marturu & nearby. You both get ₹150 instantly!
                    </Text>
                  </View>
                  <Ionicons name="gift" size={38} color={theme.colors.accent} />
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* Referral Modal */}
      <ReferralModal
        visible={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        theme={theme}
        user={user}
      />
    </ScrollView>
  );
}

function SectionHeader({ title, onPress, theme }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      {onPress && (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPressable: {
    cursor: "pointer",
  },
  greeting: { fontSize: 13.5, fontWeight: "600" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },
  locationText: { fontSize: 16, fontWeight: "800", flexShrink: 1 },
  searchSection: { marginTop: 14, marginBottom: 8 },

  // Promotional Banner Styles
  desktopBannerRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  desktopBannerCard: {
    flex: 1,
    height: 124,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(13,110,253,0.12)",
  },
  banner: {
    height: 124,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  bannerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  dot: { height: 6, borderRadius: 3 },

  // Grid wrapper
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 13, fontWeight: "700" },

  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
  },
  offerTitle: { color: "#fff", fontSize: 17, fontWeight: "800" },
  offerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12.5,
    marginTop: 4,
    fontWeight: "500",
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 50,
    gap: 12,
  },
  noResultsText: { fontSize: 14.5, fontWeight: "600" },
});