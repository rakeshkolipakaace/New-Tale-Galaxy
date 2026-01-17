import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { genres, ageGroups, stories } from "../lib/storyData";

export default function HomeScreen({ navigation }) {
  const [selectedAge, setSelectedAge] = useState("3-5");
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [agePickerAnim] = useState(() => new Animated.Value(0));

  const handleGenrePress = (genre) => {
    navigation.navigate("StorySelection", { genreId: genre.id, selectedAge });
  };

  const toggleAgePicker = () => {
    const next = !showAgePicker;
    if (next) {
      setShowAgePicker(true);
      Animated.timing(agePickerAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(agePickerAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShowAgePicker(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={["#E6F0FF", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.headerIcon}>
                <Ionicons name="sparkles" size={18} color="#2563EB" />
              </View>
              <Text style={styles.title}>Story Time</Text>
              <Text style={styles.subtitle}>Choose your adventure</Text>
            </View>

            <TouchableOpacity
              style={styles.ageSelector}
              onPress={toggleAgePicker}
              activeOpacity={0.9}
            >
              <Text style={styles.ageSelectorText}>
                {ageGroups.find((a) => a.value === selectedAge)?.label}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>

            {showAgePicker && (
              <Animated.View
                style={[
                  styles.agePicker,
                  {
                    opacity: agePickerAnim,
                    transform: [
                      {
                        translateY: agePickerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {ageGroups.map((age) => (
                  <TouchableOpacity
                    key={age.value}
                    style={[
                      styles.ageOption,
                      selectedAge === age.value && styles.ageOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedAge(age.value);
                      toggleAgePicker();
                    }}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.ageOptionText,
                        selectedAge === age.value &&
                          styles.ageOptionTextSelected,
                      ]}
                    >
                      {age.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          <View style={styles.genreGrid}>
            {genres.map((genre, index) => {
              const genreStories = stories[genre.id] || [];
              const storyCount = genreStories.filter(
                (s) => s.ageGroup === selectedAge
              ).length;

              return (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.genreCard,
                    index > 0 && styles.genreCardMargin,
                  ]}
                  onPress={() => handleGenrePress(genre)}
                  activeOpacity={0.92}
                >
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={genre.image}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{genre.title}</Text>
                      <View style={styles.cardIcon}>
                        <Feather name="book-open" size={18} color="#3B82F6" />
                      </View>
                    </View>

                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {genre.description}
                    </Text>

                    <View style={styles.cardFooter}>
                      <View style={styles.storyCount}>
                        <Text style={styles.storyCountText}>
                          {storyCount} Stories
                        </Text>
                      </View>
                      <View style={styles.exploreContainer}>
                        <Text style={styles.exploreText}>Explore</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={12}
                          color="#94A3B8"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  ageSelector: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  ageSelectorText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
    marginRight: 8,
  },
  agePicker: {
    position: "absolute",
    top: 64,
    right: 20,
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  ageOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  ageOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  ageOptionText: {
    fontSize: 16,
    color: "#1E293B",
  },
  ageOptionTextSelected: {
    color: "#2563EB",
    fontWeight: 600,
  },
  titleContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 6,
  },
  genreGrid: {
    paddingHorizontal: 20,
  },
  genreCard: {
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
  },
  genreCardMargin: {
    marginTop: 20,
  },
  cardImageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storyCount: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  storyCountText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2563EB",
  },
  exploreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  exploreText: {
    fontSize: 12,
    fontWeight: 500,
    color: "#94A3B8",
    marginRight: 4,
  },
});
