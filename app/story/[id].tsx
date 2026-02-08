import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { stories } from "@/constants/stories";

type Mode = "idle" | "explain" | "record";

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function WordToken({
  word,
  isHighlighted,
  isUnderlined,
  isCurrent,
  mode,
}: {
  word: string;
  isHighlighted: boolean;
  isUnderlined: boolean;
  isCurrent: boolean;
  mode: Mode;
}) {
  const bgColor =
    isCurrent && mode === "explain"
      ? Colors.highlight
      : isCurrent && mode === "record"
        ? "rgba(78, 205, 196, 0.45)"
        : isHighlighted && mode === "record"
          ? Colors.highlightRecord
          : "transparent";

  const underlineColor =
    isUnderlined && mode === "explain" ? Colors.underline : "transparent";

  return (
    <Text
      style={[
        styles.word,
        {
          backgroundColor: bgColor,
          borderBottomWidth: isUnderlined ? 2 : 0,
          borderBottomColor: underlineColor,
          borderRadius: isHighlighted || isCurrent ? 4 : 0,
          paddingHorizontal: isHighlighted || isCurrent ? 2 : 0,
          color: isHighlighted && mode === "record" ? Colors.accentGreen : "#3B2F1E",
        },
      ]}
    >
      {word}{" "}
    </Text>
  );
}

function PulsingDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulsingDot, animStyle]} />;
}

function getSpeechRecognitionAPI(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = stories.find((s) => s.id === id);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const [mode, setMode] = useState<Mode>("idle");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());
  const [recordError, setRecordError] = useState<string | null>(null);
  const modeRef = useRef<Mode>("idle");
  const recognitionRef = useRef<any>(null);
  const explainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordsRef = useRef<string[]>([]);
  const matchIndexRef = useRef(0);

  if (!story) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorText}>Story not found</Text>
      </View>
    );
  }

  const words = story.content.split(/\s+/);
  wordsRef.current = words;

  const isWide = screenWidth > 600;
  const imageWidth = isWide ? screenWidth * 0.38 : screenWidth * 0.35;

  const stopExplain = useCallback(() => {
    Speech.stop();
    if (explainIntervalRef.current) {
      clearInterval(explainIntervalRef.current);
      explainIntervalRef.current = null;
    }
    setMode("idle");
    modeRef.current = "idle";
    setCurrentWordIndex(-1);
  }, []);

  const startExplain = useCallback(() => {
    if (mode === "record") return;
    if (mode === "explain") {
      stopExplain();
      return;
    }

    setMode("explain");
    modeRef.current = "explain";
    setCurrentWordIndex(0);
    setHighlightedWords(new Set());
    setRecordError(null);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const fullText = story.content;
    const totalWords = words.length;
    const speechRate = 0.85;
    const msPerWord = (60 / (150 * speechRate)) * 1000;

    let wordIdx = 0;
    explainIntervalRef.current = setInterval(() => {
      if (modeRef.current !== "explain") {
        if (explainIntervalRef.current) clearInterval(explainIntervalRef.current);
        return;
      }
      if (wordIdx < totalWords) {
        setCurrentWordIndex(wordIdx);
        wordIdx++;
      } else {
        if (explainIntervalRef.current) clearInterval(explainIntervalRef.current);
        setMode("idle");
        modeRef.current = "idle";
        setCurrentWordIndex(-1);
      }
    }, msPerWord);

    Speech.speak(fullText, {
      rate: speechRate,
      pitch: 1.0,
      language: "en-US",
      onDone: () => {
        if (explainIntervalRef.current) clearInterval(explainIntervalRef.current);
        setMode("idle");
        modeRef.current = "idle";
        setCurrentWordIndex(-1);
      },
      onStopped: () => {
        if (explainIntervalRef.current) clearInterval(explainIntervalRef.current);
      },
    });
  }, [mode, story, words, stopExplain]);

  const stopRecord = useCallback(() => {
    setMode("idle");
    modeRef.current = "idle";
    setCurrentWordIndex(-1);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);

  const startRecord = useCallback(() => {
    if (mode === "explain") return;
    if (mode === "record") {
      stopRecord();
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setRecordError(null);

    const SpeechRecognitionAPI = getSpeechRecognitionAPI();

    if (!SpeechRecognitionAPI) {
      setRecordError(
        Platform.OS === "web"
          ? "Speech recognition is not supported in this browser. Please open in Chrome."
          : "Speech recognition requires a web browser. Open this app in Chrome for the Record feature."
      );
      return;
    }

    setMode("record");
    modeRef.current = "record";
    setCurrentWordIndex(-1);
    setHighlightedWords(new Set());
    matchIndexRef.current = 0;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    const storyWordsNorm = wordsRef.current.map(normalizeWord);

    recognition.onresult = (event: any) => {
      if (modeRef.current !== "record") return;

      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }

      const spokenWords = fullTranscript
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.replace(/[^a-z0-9]/g, ""));

      const newHighlighted = new Set<number>();
      let storyIdx = 0;

      for (let si = 0; si < spokenWords.length && storyIdx < storyWordsNorm.length; si++) {
        const spoken = spokenWords[si];
        if (!spoken) continue;

        let searchEnd = Math.min(storyIdx + 5, storyWordsNorm.length);

        for (let j = storyIdx; j < searchEnd; j++) {
          const storyWord = storyWordsNorm[j];
          if (
            storyWord === spoken ||
            (storyWord.length > 2 && spoken.length > 2 && (storyWord.startsWith(spoken) || spoken.startsWith(storyWord)))
          ) {
            for (let k = storyIdx; k <= j; k++) {
              newHighlighted.add(k);
            }
            storyIdx = j + 1;
            break;
          }
        }
      }

      if (storyIdx > matchIndexRef.current) {
        matchIndexRef.current = storyIdx;
      }

      for (let i = 0; i < matchIndexRef.current; i++) {
        newHighlighted.add(i);
      }

      setHighlightedWords(new Set(newHighlighted));
      setCurrentWordIndex(Math.max(matchIndexRef.current - 1, 0));
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setRecordError("Microphone access was denied. Please allow microphone access and try again.");
        setMode("idle");
        modeRef.current = "idle";
      }
    };

    recognition.onend = () => {
      if (modeRef.current === "record") {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setRecordError("Could not start speech recognition. Please try again.");
      setMode("idle");
      modeRef.current = "idle";
    }
  }, [mode, stopRecord]);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (explainIntervalRef.current) {
        clearInterval(explainIntervalRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const topPadding = Platform.OS === "web" ? webTopInset : insets.top;
  const bottomPadding = Platform.OS === "web" ? webBottomInset : insets.bottom;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: topPadding + 8 }]}>
        <Pressable
          onPress={() => {
            stopExplain();
            stopRecord();
            router.back();
          }}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {story.title}
          </Text>
          {mode !== "idle" && (
            <View style={styles.modeIndicator}>
              <PulsingDot />
              <Text style={styles.modeText}>
                {mode === "explain" ? "Speaking..." : "Listening..."}
              </Text>
            </View>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bookContainer}>
          <View style={styles.bookSpine} />

          <View style={styles.bookPage}>
            <View style={[styles.bookLayout, !isWide && styles.bookLayoutNarrow]}>
              <View style={[styles.imageSection, { width: isWide ? imageWidth : "100%" }]}>
                <Image
                  source={story.image}
                  style={[
                    styles.storyImage,
                    !isWide && { height: 220 },
                  ]}
                  resizeMode="cover"
                />
                <View style={styles.imageCaption}>
                  <Text style={styles.imageCaptionTitle}>{story.title}</Text>
                  <Text style={styles.imageCaptionAuthor}>by {story.author}</Text>
                  <View style={styles.imageCaptionMeta}>
                    <View style={styles.ageTag}>
                      <Text style={styles.ageTagText}>
                        Ages {story.ageMin}-{story.ageMax}
                      </Text>
                    </View>
                    <Text style={styles.imageCaptionTime}>{story.readTime} read</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.textSection, isWide && { flex: 1 }]}>
                {recordError && (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={16} color="#C0392B" />
                    <Text style={styles.errorBannerText}>{recordError}</Text>
                  </View>
                )}

                {mode === "record" && !recordError && (
                  <View style={styles.recordHint}>
                    <Ionicons name="mic" size={14} color="#27AE60" />
                    <Text style={styles.recordHintText}>
                      Read aloud — words highlight as you speak
                    </Text>
                  </View>
                )}

                <Text style={styles.storyText}>
                  {words.map((word, index) => (
                    <WordToken
                      key={index}
                      word={word}
                      isHighlighted={highlightedWords.has(index)}
                      isCurrent={index === currentWordIndex}
                      isUnderlined={
                        mode === "explain" && index <= currentWordIndex && currentWordIndex >= 0
                      }
                      mode={mode}
                    />
                  ))}
                </Text>

                <View style={styles.moralBox}>
                  <Ionicons name="sparkles" size={14} color="#D4A574" />
                  <Text style={styles.moralText}>{story.moral}</Text>
                </View>
              </View>
            </View>

            {mode === "record" && highlightedWords.size > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          (highlightedWords.size / words.length) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {highlightedWords.size} / {words.length} words read
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPadding + 12 }]}>
        <Pressable
          onPress={startExplain}
          style={({ pressed }) => [
            styles.actionBtn,
            mode === "explain" && styles.actionBtnActive,
            mode === "record" && styles.actionBtnDisabled,
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
          disabled={mode === "record"}
        >
          <Ionicons
            name={mode === "explain" ? "stop" : "volume-high"}
            size={22}
            color={mode === "explain" ? Colors.white : Colors.primary}
          />
          <Text
            style={[
              styles.actionBtnText,
              mode === "explain" && styles.actionBtnTextActive,
            ]}
          >
            {mode === "explain" ? "Stop" : "Explain"}
          </Text>
        </Pressable>

        <Pressable
          onPress={startRecord}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.recordBtn,
            mode === "record" && styles.recordBtnActive,
            mode === "explain" && styles.actionBtnDisabled,
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
          disabled={mode === "explain"}
        >
          <Ionicons
            name={mode === "record" ? "stop" : "mic"}
            size={22}
            color={mode === "record" ? Colors.white : Colors.accent}
          />
          <Text
            style={[
              styles.actionBtnText,
              styles.recordBtnText,
              mode === "record" && styles.actionBtnTextActive,
            ]}
          >
            {mode === "record" ? "Stop" : "Record"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  topBarTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 5,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  modeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bookContainer: {
    flexDirection: "row",
  },
  bookSpine: {
    width: 6,
    backgroundColor: "#8B6F4E",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookPage: {
    flex: 1,
    backgroundColor: "#FDF8F0",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bookLayout: {
    flexDirection: "row",
    gap: 16,
  },
  bookLayoutNarrow: {
    flexDirection: "column",
  },
  imageSection: {
    overflow: "hidden",
  },
  storyImage: {
    width: "100%",
    height: "100%",
    minHeight: 180,
    borderRadius: 10,
  },
  imageCaption: {
    marginTop: 10,
    paddingBottom: 4,
  },
  imageCaptionTitle: {
    fontSize: 18,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#3B2F1E",
    lineHeight: 24,
  },
  imageCaptionAuthor: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8B7355",
    marginTop: 2,
  },
  imageCaptionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  ageTag: {
    backgroundColor: "#E8DDD0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ageTagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#6B5B47",
  },
  imageCaptionTime: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#A0916E",
  },
  textSection: {
    minHeight: 100,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(192, 57, 43, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(192, 57, 43, 0.2)",
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#C0392B",
    lineHeight: 16,
  },
  recordHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(39, 174, 96, 0.2)",
  },
  recordHintText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#27AE60",
    lineHeight: 16,
  },
  storyText: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  word: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#3B2F1E",
    lineHeight: 28,
  },
  moralBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5DDD0",
  },
  moralText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#8B6F4E",
    fontStyle: "italic",
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 5,
    backgroundColor: "#E5DDD0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27AE60",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#8B7355",
    marginTop: 6,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  actionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnDisabled: {
    opacity: 0.4,
    borderColor: Colors.textMuted,
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  actionBtnTextActive: {
    color: Colors.white,
  },
  recordBtn: {
    borderColor: Colors.accent,
  },
  recordBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  recordBtnText: {
    color: Colors.accent,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
});
