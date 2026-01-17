import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { stories, genres } from "../lib/storyData";

const { width } = Dimensions.get("window");

export default function StorySelectionScreen({ route, navigation }) {
  const { genreId, selectedAge } = route.params;

  const genre = genres.find((g) => g.id === genreId);
  const allGenreStories = stories[genreId] || [];
  const genreStories = allGenreStories.filter(
    (story) => story.ageGroup === selectedAge
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleStoryPress = (story) => {
    navigation.navigate("Book", { genreId, storyId: story.id, selectedAge });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={genre?.colors || ["#DBEAFE", "#FFFFFF"]}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.genreLabel}>Genre</Text>
            <Text style={styles.genreTitle}>{genre?.title}</Text>
            <Text style={styles.storyCount}>
              {genreStories.length} stories for ages {selectedAge}
            </Text>
          </View>

          <View style={styles.genreImageContainer}>
            <Image
              source={genre?.image}
              style={styles.genreImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {genreStories.length > 0 ? (
          <View style={styles.storyGrid}>
            {genreStories.map((story, index) => (
              <TouchableOpacity
                key={story.id}
                style={[styles.storyCard, index > 0 && styles.storyCardMargin]}
                onPress={() => handleStoryPress(story)}
                activeOpacity={0.9}
              >
                <View style={styles.coverContainer}>
                  <Image
                    source={story.coverImage}
                    style={styles.coverImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.storyInfo}>
                  <Text style={styles.storyTitle} numberOfLines={2}>
                    {story.title}
                  </Text>
                  <Text style={styles.storyDescription} numberOfLines={2}>
                    {story.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No stories available for this age group yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },
  headerGradient: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerText: {
    flex: 1,
  },
  genreLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 4,
  },
  genreTitle: {
    fontSize: 40,
    fontWeight: 700,
    color: "#1E293B",
    marginBottom: 8,
  },
  storyCount: {
    fontSize: 16,
    color: "#475569",
  },
  genreImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    padding: 4,
  },
  genreImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  storyGrid: {},
  storyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    backgroundColor: "gold",
  },

  storyCardMargin: {
    marginTop: 30,
  },
  coverContainer: {
    width: "100%",
    aspectRatio: 4 / 3.5,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  storyInfo: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1E293B",
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    fontWeight: 700,
    color: "#64748B",
    marginBottom: 1,
    lineHeight: 20,
  },
  storyMeta: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
});
