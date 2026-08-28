import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "../context/AppContext";
import { Header, SearchBar, Badge, EmptyState } from "../components";
import { categories, services } from "../data/dummyData";
import { CONTENT_MAX_WIDTH } from "../utils/responsive";

const isWeb = Platform.OS === "web";
const SORT_OPTIONS = ["Popular", "Price: Low to High", "Rating"];

export default function CategoriesScreen({ navigation, route }) {
  const { theme } = useApp();
  const { width: screenWidth } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(route?.params?.categoryId || null);
  const [sortIndex, setSortIndex] = useState(0);
  const [showSort, setShowSort] = useState(false);

  // Responsive columns
  const numColumns = screenWidth >= 1024 ? 3 : screenWidth >= 640 ? 2 : 2;
  const cardWidthPct = numColumns === 3 ? "31.8%" : "48.2%";

  const filteredServices = useMemo(() => {
    let list = services;
    if (activeCategory) {
      const cat = categories.find((c) => c.id === activeCategory);
      list = list.filter((s) => s.category === cat?.name);
    }
    if (search) {
      list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (SORT_OPTIONS[sortIndex] === "Price: Low to High") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (SORT_OPTIONS[sortIndex] === "Rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [activeCategory, search, sortIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="All Services" showBack onBack={() => navigation.goBack()} />

      <View
        style={{
          maxWidth: isWeb ? CONTENT_MAX_WIDTH : undefined,
          width: "100%",
          alignSelf: isWeb ? "center" : undefined,
          flex: 1,
        }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onFilterPress={() => setShowSort(!showSort)}
            placeholder="Search for services..."
          />
        </View>

        {/* Category horizontal filter chips */}
        <FlatList
          data={[
            { id: null, name: "All", icon: "grid-outline", color: theme.colors.primary },
            ...categories,
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          style={styles.chipList}
          contentContainerStyle={styles.chipContent}
          renderItem={({ item }) => {
            const active = activeCategory === item.id;
            const chipColor = item.color || theme.colors.primary;
            return (
              <Pressable
                onPress={() => setActiveCategory(item.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: active ? chipColor : theme.colors.card,
                    borderColor: active ? chipColor : theme.colors.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={active ? "#fff" : chipColor}
                />
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? "#fff" : theme.colors.text,
                      fontWeight: active ? "700" : "600",
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        {/* Sort row */}
        <View style={styles.sortRow}>
          <Text style={{ color: theme.colors.subtitle, fontSize: 13, fontWeight: "600" }}>
            {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
          </Text>
          <Pressable style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
            <Ionicons name="swap-vertical-outline" size={14} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: "700" }}>
              Sort: {SORT_OPTIONS[sortIndex]}
            </Text>
          </Pressable>
        </View>

        {showSort && (
          <View
            style={[
              styles.sortDropdown,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
          >
            {SORT_OPTIONS.map((opt, idx) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setSortIndex(idx);
                  setShowSort(false);
                }}
                style={styles.sortOption}
              >
                <Text
                  style={{
                    color: sortIndex === idx ? theme.colors.primary : theme.colors.text,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {opt}
                </Text>
                {sortIndex === idx && (
                  <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Grid of services */}
        <FlatList
          data={filteredServices}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No services found"
              subtitle="Try a different search or select another category"
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 35).duration(300)}
              style={{ width: cardWidthPct, marginBottom: 16 }}
            >
              <GridCard
                service={item}
                theme={theme}
                onPress={() => navigation.navigate("ServiceDetails", { service: item })}
              />
            </Animated.View>
          )}
        />
      </View>
    </View>
  );
}

function GridCard({ service, theme, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.gridCard,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
        },
        theme.shadow.soft,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={[styles.gridIcon, { backgroundColor: service.color + "18" }]}>
        <Ionicons name={service.icon} size={28} color={service.color} />
      </View>
      <Text numberOfLines={1} style={[styles.gridName, { color: theme.colors.text }]}>
        {service.name}
      </Text>
      <View style={styles.gridBottomRow}>
        <Text style={[styles.gridPrice, { color: theme.colors.text }]}>₹{service.price}</Text>
        <Badge label={`★ ${service.rating}`} tone="warning" size="sm" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chipList: {
    flexGrow: 0,
    height: 52,
    marginVertical: 6,
  },
  chipContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignSelf: "center",
  },
  chipText: {
    fontSize: 13,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 2,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sortDropdown: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  gridCard: {
    padding: 16,
    borderWidth: 1,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  gridName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  gridBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: "800",
  },
});