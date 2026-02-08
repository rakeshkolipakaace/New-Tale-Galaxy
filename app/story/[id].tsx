import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
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
  index,
  isHighlighted,
  isUnderlined,
  isCurrent,
  mode,
}: {
  word: string;
  index: number;
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
          color: isHighlighted && mode === "record" ? Colors.accentGreen : Colors.text,
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
        let found = false;

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
            found = true;
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
      if (event.error === "no-speech") return;
      if (event.error === "aborted") return;
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
        <View style={styles.storyHeader}>
          <Text style={styles.storyCategory}>{story.category}</Text>
          <Text style={styles.storyTitle}>{story.title}</Text>
          <View style={styles.storyMeta}>
            <Text style={styles.storyAuthor}>by {story.author}</Text>
            <View style={styles.metaDot} />
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.storyReadTime}>{story.readTime}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {recordError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={Colors.accent} />
            <Text style={styles.errorBannerText}>{recordError}</Text>
          </View>
        )}

        {mode === "record" && !recordError && (
          <View style={styles.recordHint}>
            <Ionicons name="mic" size={16} color={Colors.accentGreen} />
            <Text style={styles.recordHintText}>
              Start reading aloud — words will highlight as you speak
            </Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.storyText}>
            {words.map((word, index) => (
              <WordToken
                key={index}
                word={word}
                index={index}
                isHighlighted={highlightedWords.has(index)}
                isCurrent={index === currentWordIndex}
                isUnderlined={
                  mode === "explain" && index <= currentWordIndex && currentWordIndex >= 0
                }
                mode={mode}
              />
            ))}
          </Text>
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
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  storyHeader: {
    marginBottom: 16,
  },
  storyCategory: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 28,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    lineHeight: 36,
  },
  storyMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  storyAuthor: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  storyReadTime: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.accent,
    lineHeight: 18,
  },
  recordHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(78, 205, 196, 0.12)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(78, 205, 196, 0.25)",
  },
  recordHintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.accentGreen,
    lineHeight: 18,
  },
  textContainer: {
    paddingBottom: 16,
  },
  storyText: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  word: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    lineHeight: 32,
  },
  progressContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accentGreen,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    marginTop: 8,
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
