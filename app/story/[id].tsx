
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
  isSkipped,
}: {
  word: string;
  isHighlighted: boolean;
  isUnderlined: boolean;
  isCurrent: boolean;
  mode: Mode;
  isSkipped: boolean;
}) {
  const bgColor =
    isCurrent && mode === "explain"
      ? Colors.highlight
      : isCurrent && mode === "record"
        ? "rgba(78, 205, 196, 0.45)"
        : isHighlighted && mode === "record"
          ? Colors.highlightRecord
          : "transparent";

  const underlineColor = isUnderlined && mode === "explain" ? Colors.underline : "transparent";

  const textColor =
    isSkipped && mode === "record"
      ? Colors.missedWord
      : isHighlighted && mode === "record"
        ? Colors.accentGreen
        : "#3B2F1E";

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
          color: textColor,
        },
      ]}
    >
      {word}{" "}
    </Text>
  );
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
  const [skippedWords, setSkippedWords] = useState<Set<number>>(new Set());
  const [allSkippedWords, setAllSkippedWords] = useState<{ page: number; words: string[] }[]>([]);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentPageRef = useRef(0);
  const modeRef = useRef<Mode>("idle");
  const recognitionRef = useRef<any>(null);
  const explainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordsRef = useRef<string[]>([]);
  const matchIndexRef = useRef(0);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  if (!story) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorText}>Story not found</Text>
      </View>
    );
  }

  const currentPageData = story.pages[currentPage];
  const words = currentPageData.text.split(/\s+/);
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

  const goToNextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setCurrentWordIndex(-1);
      setHighlightedWords(new Set());
      setSkippedWords(new Set());
      if (mode === "explain") stopExplain();
      // Keep recording active when manually moving to next page
      if (mode === "record") {
        matchIndexRef.current = 0;
      }
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentWordIndex(-1);
      setHighlightedWords(new Set());
      setSkippedWords(new Set());
      if (mode === "explain") stopExplain();
      // Keep recording active when manually moving to prev page
      if (mode === "record") {
        matchIndexRef.current = 0;
      }
    }
  };

  const speakCurrentPageAndContinue = useCallback(() => {
    const page = story.pages[currentPageRef.current];
    if (!page) return;

    const fullText = page.text;
    const pageWords = fullText.split(/\s+/);
    const totalWords = pageWords.length;

    const speechRate = 0.92;
    const WORD_HIGHLIGHT_INTERVAL_MS = 320; // ← most important tuning value

    let wordIdx = 0;

    // Word-by-word highlight
    explainIntervalRef.current = setInterval(() => {
      if (modeRef.current !== "explain") {
        clearIntervalIfExists();
        return;
      }

      if (wordIdx < totalWords) {
        setCurrentWordIndex(wordIdx);
        wordIdx++;
      } else {
        clearIntervalIfExists();
      }
    }, WORD_HIGHLIGHT_INTERVAL_MS);

    function clearIntervalIfExists() {
      if (explainIntervalRef.current) {
        clearInterval(explainIntervalRef.current);
        explainIntervalRef.current = null;
      }
    }

    Speech.speak(fullText, {
      rate: speechRate,
      pitch: 1.0,
      language: "en-US",

      onDone: () => {
        clearIntervalIfExists();

        if (modeRef.current !== "explain") return;

        if (currentPageRef.current < story.pages.length - 1) {
          const nextPage = currentPageRef.current + 1;
          setCurrentPage(nextPage);
          setCurrentWordIndex(-1);
          setHighlightedWords(new Set());
          setSkippedWords(new Set());

          setTimeout(() => {
            if (modeRef.current === "explain") {
              speakCurrentPageAndContinue();
            }
          }, 900);
        } else {
          setMode("idle");
          modeRef.current = "idle";
          setCurrentWordIndex(-1);
        }
      },

      onStopped: () => {
        clearIntervalIfExists();
      },

      onError: (err) => {
        console.warn("Speech error:", err);
        clearIntervalIfExists();
      },
    });
  }, [story.pages]);

  const startExplain = useCallback(() => {
    if (mode === "record") return;
    if (mode === "explain") {
      stopExplain();
      return;
    }

    setMode("explain");
    modeRef.current = "explain";
    setCurrentWordIndex(-1);
    setHighlightedWords(new Set());
    setSkippedWords(new Set());
    setRecordError(null);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    speakCurrentPageAndContinue();
  }, [mode, speakCurrentPageAndContinue, stopExplain]);

  const stopRecord = useCallback(() => {
    if (modeRef.current === "record") {
      const pageWords = wordsRef.current;
      const currentSkippedIndices = Array.from(skippedWords);
      if (currentSkippedIndices.length > 0) {
        const skippedTexts = currentSkippedIndices
          .sort((a, b) => a - b)
          .map((idx) => pageWords[idx]);
        setAllSkippedWords((prev) => {
          const existing = prev.find((p) => p.page === currentPageRef.current);
          if (existing) {
            return prev.map((p) =>
              p.page === currentPageRef.current ? { ...p, words: skippedTexts } : p
            );
          }
          return [...prev, { page: currentPageRef.current, words: skippedTexts }];
        });
      }
    }

    setMode("idle");
    modeRef.current = "idle";
    setCurrentWordIndex(-1);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) { }
      recognitionRef.current = null;
    }
  }, [skippedWords]);

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
    setSkippedWords(new Set());
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
      const newSkipped = new Set<number>();
      let storyIdx = 0;

      for (let si = 0; si < spokenWords.length && storyIdx < storyWordsNorm.length; si++) {
        const spoken = spokenWords[si];
        if (!spoken) continue;

        let searchEnd = Math.min(storyIdx + 5, storyWordsNorm.length);

        for (let j = storyIdx; j < searchEnd; j++) {
          const storyWord = storyWordsNorm[j];
          if (
            storyWord === spoken ||
            (storyWord.length > 2 &&
              spoken.length > 2 &&
              (storyWord.startsWith(spoken) || spoken.startsWith(storyWord)))
          ) {
            for (let k = storyIdx; k < j; k++) {
              newSkipped.add(k);
            }
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
      setSkippedWords(new Set(newSkipped));
      setCurrentWordIndex(Math.max(matchIndexRef.current - 1, 0));

      if (storyIdx >= storyWordsNorm.length && storyWordsNorm.length > 0) {
        if (currentPageRef.current < story.pages.length - 1) {
          const nextPage = currentPageRef.current + 1;
          // Save skipped words before moving to next page
          const currentSkippedIndices = Array.from(newSkipped);

          // Identify which words were actually missed on this page
          const pageWords = wordsRef.current;
          const skippedTexts = currentSkippedIndices
            .sort((a, b) => a - b)
            .map((idx) => pageWords[idx]);

          if (skippedTexts.length > 0) {
            setAllSkippedWords((prev) => {
              const existing = prev.find((p) => p.page === currentPageRef.current);
              if (existing) {
                return prev.map((p) =>
                  p.page === currentPageRef.current ? { ...p, words: skippedTexts } : p
                );
              }
              return [...prev, { page: currentPageRef.current, words: skippedTexts }];
            });
          }

          // STOP: We don't auto-advance in record mode anymore. 
          // The user must click the next button or stop recording.
          // This fixes the "jumping to next next page" issue.

          /* 
          setTimeout(() => {
            if (modeRef.current === "record") {
              setCurrentPage(nextPage);
              setCurrentWordIndex(-1);
              setHighlightedWords(new Set());
              setSkippedWords(new Set());
              matchIndexRef.current = 0;
            }
          }, 1000);
          */
        } else {
          // Last page completed in record mode
          const currentSkippedIndices = Array.from(newSkipped);
          if (currentSkippedIndices.length > 0) {
            const pageWords = wordsRef.current;
            const skippedTexts = currentSkippedIndices
              .sort((a, b) => a - b)
              .map((idx) => pageWords[idx]);
            setAllSkippedWords((prev) => {
              const existing = prev.find((p) => p.page === currentPageRef.current);
              if (existing) {
                return prev.map((p) =>
                  p.page === currentPageRef.current ? { ...p, words: skippedTexts } : p
                );
              }
              return [...prev, { page: currentPageRef.current, words: skippedTexts }];
            });
          }
          setTimeout(() => {
            stopRecord();
            setShowSummary(true);
          }, 1500);
        }
      }
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
        } catch (e) { }
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
        explainIntervalRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) { }
      }
    };
  }, []);

  const topPadding = Platform.OS === "web" ? webTopInset : insets.top;
  const bottomPadding = Platform.OS === "web" ? webBottomInset : insets.bottom;

  const backButtonOverlayStyle = {
    position: "absolute" as const,
    top: topPadding + 8,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  };

  return (
    <View style={styles.container}>
      {showSummary && (
        <View style={[StyleSheet.absoluteFill, styles.summaryOverlay, { zIndex: 2000 }]}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Reading Summary</Text>
            <ScrollView style={styles.summaryScroll}>
              {allSkippedWords.length > 0 ? (
                <>
                  <Text style={styles.summarySubtitle}>Words to practice:</Text>
                  {allSkippedWords.map((p, i) => (
                    <View key={i} style={styles.summaryPageRow}>
                      <Text style={styles.summaryPageLabel}>Page {p.page + 1}:</Text>
                      <View style={styles.summaryWordsList}>
                        {p.words.map((w, j) => (
                          <View key={j} style={styles.summaryWordBadge}>
                            <Text style={styles.summaryWordText}>{w}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <View style={styles.perfectScore}>
                  <Ionicons name="trophy" size={48} color="#D4A574" />
                  <Text style={styles.perfectText}>Perfect Reading!</Text>
                  <Text style={styles.perfectSub}>You didn't skip any words.</Text>
                </View>
              )}
            </ScrollView>
            <Pressable
              onPress={() => {
                setShowSummary(false);
                setAllSkippedWords([]);
              }}
              style={({ pressed }) => [styles.summaryCloseBtn, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={styles.summaryCloseText}>Back to Story</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Pressable
        onPress={() => {
          stopExplain();
          stopRecord();
          router.back();
        }}
        style={({ pressed }) => [backButtonOverlayStyle, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.text} />
      </Pressable>

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
                  source={currentPageData.image || story.image}
                  style={[styles.storyImage, !isWide && { height: 220 }]}
                  resizeMode="cover"
                />
                <View style={styles.imageCaption}>
                  <Text style={styles.imageCaptionTitle}>{story.title}</Text>
                  {/* <Text style={styles.imageCaptionAuthor}>by {story.author}</Text>
                  <View style={styles.imageCaptionMeta}>
                    <View style={styles.ageTag}>
                      <Text style={styles.ageTagText}>
                        Ages {story.ageMin}-{story.ageMax}
                      </Text>
                    </View>
                    <Text style={styles.imageCaptionTime}>{story.readTime} read</Text>
                  </View> */}
                  <View style={styles.pageIndicator}>
                    <Text style={styles.pageIndicatorText}>
                      Page {currentPage + 1} of {story.pages.length}
                    </Text>
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
                      isSkipped={skippedWords.has(index)}
                      isUnderlined={
                        mode === "explain" && index <= currentWordIndex && currentWordIndex >= 0
                      }
                      mode={mode}
                    />
                  ))}
                </Text>

                {currentPage === story.pages.length - 1 && (
                  <View style={styles.moralBox}>
                    <Ionicons name="sparkles" size={14} color="#D4A574" />
                    <Text style={styles.moralText}>{story.moral}</Text>
                  </View>
                )}
              </View>
            </View>

            {mode === "record" && highlightedWords.size > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((highlightedWords.size / words.length) * 100, 100)}%`,
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

      <View style={[styles.bottomBar, { paddingBottom: bottomPadding + 16 }]}>
        <View style={styles.bottomBarRow}>
          <Pressable
            onPress={goToPrevPage}
            style={({ pressed }) => [
              styles.navCircleBtn,
              currentPage === 0 && styles.navCircleBtnDisabled,
              { opacity: pressed ? 0.7 : currentPage === 0 ? 0.3 : 1 },
            ]}
            disabled={currentPage === 0}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </Pressable>

          <View style={styles.actionButtonsContainer}>
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
                {mode === "explain" ? "Stop" : "Listen"}
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

          <Pressable
            onPress={goToNextPage}
            style={({ pressed }) => [
              styles.navCircleBtn,
              currentPage === story.pages.length - 1 && styles.navCircleBtnDisabled,
              { opacity: pressed ? 0.7 : currentPage === story.pages.length - 1 ? 0.3 : 1 },
            ]}
            disabled={currentPage === story.pages.length - 1}
          >
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    height: 200,
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
  pageIndicator: {
    marginTop: 8,
    alignItems: "center",
  },
  pageIndicatorText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#8B7355",
    backgroundColor: "#F0E6D9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  textSection: {
    minHeight: 100,
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 4,
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
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bottomBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "center",
  },
  navCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navCircleBtnDisabled: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
    minWidth: 110,
    justifyContent: "center",
  },
  actionBtnActive: {
    backgroundColor: Colors.primary,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  actionBtnTextActive: {
    color: Colors.white,
  },
  recordBtn: {
    borderColor: Colors.accent,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
  },
  recordBtnActive: {
    backgroundColor: Colors.accent,
  },
  recordBtnText: {
    color: Colors.accent,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  summaryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  summaryCard: {
    backgroundColor: "#FDF8F0",
    borderRadius: 20,
    width: "100%",
    maxHeight: "80%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  summaryTitle: {
    fontSize: 24,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#3B2F1E",
    textAlign: "center",
    marginBottom: 20,
  },
  summarySubtitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#8B7355",
    marginBottom: 12,
  },
  summaryScroll: {
    marginBottom: 20,
  },
  summaryPageRow: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8DDD0",
    paddingBottom: 12,
  },
  summaryPageLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#A0916E",
    marginBottom: 8,
  },
  summaryWordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryWordBadge: {
    backgroundColor: "rgba(192, 57, 43, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(192, 57, 43, 0.2)",
  },
  summaryWordText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#C0392B",
  },
  summaryCloseBtn: {
    backgroundColor: "#3B2F1E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryCloseText: {
    color: "#FDF8F0",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  perfectScore: {
    alignItems: "center",
    paddingVertical: 30,
  },
  perfectText: {
    fontSize: 20,
    fontFamily: "PlayfairDisplay_700Bold",
    color: "#3B2F1E",
    marginTop: 16,
  },
  perfectSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8B7355",
    marginTop: 4,
  },
});
