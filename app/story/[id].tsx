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
import { AudioModule } from "expo-audio";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { stories } from "@/constants/stories";

type Mode = "idle" | "explain" | "record";

function WordToken({
  word,
  index,
  isHighlighted,
  isUnderlined,
  mode,
}: {
  word: string;
  index: number;
  isHighlighted: boolean;
  isUnderlined: boolean;
  mode: Mode;
}) {
  const bgColor =
    isHighlighted && mode === "explain"
      ? Colors.highlight
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
          borderRadius: isHighlighted ? 4 : 0,
          paddingHorizontal: isHighlighted ? 2 : 0,
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

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = stories.find((s) => s.id === id);
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const [mode, setMode] = useState<Mode>("idle");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());
  const modeRef = useRef<Mode>("idle");
  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const fullText = story.content;
    const totalWords = words.length;
    const avgCharsPerWord = fullText.length / totalWords;
    const speechRate = 0.85;
    const msPerWord = (60 / (150 * speechRate)) * 1000;

    let wordIdx = 0;
    const interval = setInterval(() => {
      if (modeRef.current !== "explain") {
        clearInterval(interval);
        return;
      }
      if (wordIdx < totalWords) {
        setCurrentWordIndex(wordIdx);
        wordIdx++;
      } else {
        clearInterval(interval);
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
        clearInterval(interval);
        setMode("idle");
        modeRef.current = "idle";
        setCurrentWordIndex(-1);
      },
      onStopped: () => {
        clearInterval(interval);
      },
    });
  }, [mode, story, words]);

  const stopRecord = useCallback(async () => {
    setMode("idle");
    modeRef.current = "idle";
    setCurrentWordIndex(-1);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);

  const startRecord = useCallback(async () => {
    if (mode === "explain") return;
    if (mode === "record") {
      stopRecord();
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setMode("record");
    modeRef.current = "record";
    setCurrentWordIndex(-1);
    setHighlightedWords(new Set());
    matchIndexRef.current = 0;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        Alert.alert(
          "Not Supported",
          "Speech recognition is not supported in this browser. Please use Chrome for the best experience."
        );
        setMode("idle");
        modeRef.current = "idle";
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        if (modeRef.current !== "record") return;

        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }

        const spokenWords = transcript
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter(Boolean);

        const storyWordsLower = wordsRef.current.map((w) =>
          w.toLowerCase().replace(/[^a-z0-9]/g, "")
        );

        const newHighlighted = new Set<number>();
        let matchIdx = 0;

        for (const spoken of spokenWords) {
          while (matchIdx < storyWordsLower.length) {
            if (
              storyWordsLower[matchIdx] === spoken ||
              storyWordsLower[matchIdx].includes(spoken) ||
              spoken.includes(storyWordsLower[matchIdx])
            ) {
              newHighlighted.add(matchIdx);
              matchIdx++;
              break;
            }
            if (matchIdx < matchIndexRef.current + 3) {
              matchIdx++;
            } else {
              break;
            }
          }
        }

        if (matchIdx > matchIndexRef.current) {
          matchIndexRef.current = matchIdx;
        }

        for (let i = 0; i < matchIndexRef.current; i++) {
          newHighlighted.add(i);
        }

        setHighlightedWords(newHighlighted);
        setCurrentWordIndex(matchIndexRef.current - 1);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.error("Speech recognition error:", event.error);
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
        Alert.alert("Error", "Could not start speech recognition.");
        setMode("idle");
        modeRef.current = "idle";
      }
    } else {
      try {
        const permissionStatus = await AudioModule.requestRecordingPermissionsAsync();
        if (!permissionStatus.granted) {
          Alert.alert(
            "Permission Required",
            "Microphone access is needed to record your reading."
          );
          setMode("idle");
          modeRef.current = "idle";
          return;
        }

        let wordIndex = 0;
        const msPerWord = 500;
        intervalRef.current = setInterval(() => {
          if (modeRef.current !== "record") {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
          }
          if (wordIndex < wordsRef.current.length) {
            setCurrentWordIndex(wordIndex);
            setHighlightedWords((prev) => {
              const next = new Set(prev);
              next.add(wordIndex);
              return next;
            });
            wordIndex++;
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            stopRecord();
          }
        }, msPerWord);
      } catch (e) {
        console.error("Recording error:", e);
        setMode("idle");
        modeRef.current = "idle";
      }
    }
  }, [mode, stopRecord]);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
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
                {mode === "explain" ? "Listening..." : "Recording..."}
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

        <View style={styles.textContainer}>
          <Text style={styles.storyText}>
            {words.map((word, index) => (
              <WordToken
                key={index}
                word={word}
                index={index}
                isHighlighted={
                  mode === "explain"
                    ? index === currentWordIndex
                    : highlightedWords.has(index)
                }
                isUnderlined={
                  mode === "explain" && index <= currentWordIndex && currentWordIndex >= 0
                }
                mode={mode}
              />
            ))}
          </Text>
        </View>

        {mode === "record" && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      ((highlightedWords.size || 0) / words.length) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {highlightedWords.size} / {words.length} words
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
