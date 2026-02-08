import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { stories, Story } from "@/constants/stories";

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/story/[id]", params: { id: story.id } })}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <LinearGradient
        colors={story.coverGradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <Ionicons
          name={story.icon as any}
          size={32}
          color="rgba(255,255,255,0.9)"
        />
      </LinearGradient>
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{story.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {story.title}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardAuthor}>{story.author}</Text>
          <View style={styles.dot} />
          <View style={styles.readTimeBadge}>
            <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.cardReadTime}>{story.readTime}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 16,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
          },
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
              Read stories aloud and track your reading
            </Text>
          </View>
        }
        renderItem={({ item, index }) => <StoryCard story={item} index={index} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={stories.length > 0}
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
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardGradient: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardCategory: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginTop: 3,
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  cardAuthor: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 6,
  },
  readTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  cardReadTime: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
});
