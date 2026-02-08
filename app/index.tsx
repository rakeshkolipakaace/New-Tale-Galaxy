import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { stories, Story } from "@/constants/stories";

const AGES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function AgeChip({
  age,
  selected,
  onPress,
}: {
  age: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.ageChip,
        selected && styles.ageChipSelected,
        { transform: [{ scale: pressed ? 0.92 : 1 }] },
      ]}
    >
      <Text style={[styles.ageChipText, selected && styles.ageChipTextSelected]}>
        {age}
      </Text>
      {selected && <Text style={styles.ageChipLabel}>yrs</Text>}
    </Pressable>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/story/[id]", params: { id: story.id } })}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Image source={story.image} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <LinearGradient
          colors={["transparent", "rgba(15, 26, 46, 0.95)"]}
          style={styles.cardGradientOverlay}
        >
          <View style={styles.cardBadgeRow}>
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>
                {story.ageMin}-{story.ageMax} yrs
              </Text>
            </View>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={11} color={Colors.textSecondary} />
              <Text style={styles.timeBadgeText}>{story.readTime}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {story.title}
          </Text>
          <Text style={styles.cardMoral} numberOfLines={1}>
            {story.moral}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  const filteredStories = useMemo(() => {
    if (selectedAge === null) return stories;
    return stories.filter((s) => selectedAge >= s.ageMin && selectedAge <= s.ageMax);
  }, [selectedAge]);

  const topPad = (Platform.OS === "web" ? webTopInset : insets.top) + 16;
  const bottomPad = (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredStories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: topPad, paddingBottom: bottomPad },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerGreeting}>Welcome to</Text>
                <Text style={styles.headerTitle}>StoryVoice</Text>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name="book" size={28} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Pick your age to find the perfect story
            </Text>

            <View style={styles.ageSection}>
              <Text style={styles.ageSectionTitle}>How old are you?</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ageRow}
              >
                <Pressable
                  onPress={() => setSelectedAge(null)}
                  style={({ pressed }) => [
                    styles.ageChip,
                    selectedAge === null && styles.ageChipSelected,
                    { transform: [{ scale: pressed ? 0.92 : 1 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.ageChipText,
                      selectedAge === null && styles.ageChipTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                {AGES.map((age) => (
                  <AgeChip
                    key={age}
                    age={age}
                    selected={selectedAge === age}
                    onPress={() => setSelectedAge(age)}
                  />
                ))}
              </ScrollView>
            </View>

            <Text style={styles.storiesCount}>
              {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"} available
            </Text>
          </View>
        }
        renderItem={({ item }) => <StoryCard story={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No stories for this age</Text>
            <Text style={styles.emptySubtext}>Try selecting a different age</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    marginTop: 4,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 8,
  },
  ageSection: {
    marginTop: 22,
  },
  ageSectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginBottom: 12,
  },
  ageRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  ageChip: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ageChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ageChipText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  ageChipTextSelected: {
    color: Colors.background,
    fontSize: 16,
  },
  ageChipLabel: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    color: Colors.background,
    marginTop: -2,
  },
  storiesCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textMuted,
    marginTop: 18,
  },
  card: {
    width: "48%",
    aspectRatio: 0.72,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  cardGradientOverlay: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 40,
  },
  cardBadgeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  ageBadge: {
    backgroundColor: "rgba(245, 166, 35, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ageBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: Colors.background,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(30, 45, 74, 0.85)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    lineHeight: 20,
  },
  cardMoral: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
});
