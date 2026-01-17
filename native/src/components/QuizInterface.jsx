import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QuizInterface({
  questions,
  onComplete,
  onReadAgain,
  onBackToStories,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      selectedAnswer === questions[currentQuestion].correctAnswer;
    const nextScore = score + (isCorrect ? 1 : 0);
    setScore(nextScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
    } else {
      setFinalScore(nextScore);
      setShowResult(true);
      if (onComplete) {
        onComplete({
          score: nextScore,
          total: questions.length,
          percentage: (nextScore / questions.length) * 100,
        });
      }
    }
  };

  if (showResult) {
    const resolvedScore = finalScore ?? score;
    const percentage = (resolvedScore / questions.length) * 100;
    let message = "Great job! Keep reading!";
    if (percentage === 100) message = "Perfect Score! You're a reading master!";
    else if (percentage >= 80) message = "Excellent work! Almost perfect!";
    else if (percentage >= 60)
      message = "Good job! You understood the story well!";

    return (
      <View style={styles.resultContainer}>
        <View style={styles.awardCircle}>
          <Ionicons name="trophy" size={48} color="#CA8A04" />
        </View>

        <Text style={styles.resultTitle}>Quiz Complete!</Text>
        <Text style={styles.resultScore}>
          You scored {resolvedScore} out of {questions.length}
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.resultMessage}>{message}</Text>

        <View style={styles.resultButtons}>
          {onReadAgain && (
            <TouchableOpacity
              style={styles.readAgainButton}
              onPress={onReadAgain}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.readAgainText}>Read Again</Text>
            </TouchableOpacity>
          )}
          {onBackToStories && (
            <TouchableOpacity
              style={styles.moreStoriesButton}
              onPress={onBackToStories}
            >
              <Ionicons name="home" size={20} color="#1E293B" />
              <Text style={styles.moreStoriesText}>More Stories</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1}/{questions.length}
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <Text style={styles.questionText}>
        {questions[currentQuestion].question}
      </Text>

      <ScrollView style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionButton,
              selectedAnswer === idx && styles.optionSelected,
              idx > 0 && styles.optionMargin,
            ]}
            onPress={() => handleAnswer(idx)}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === idx && styles.optionTextSelected,
              ]}
            >
              {opt}
            </Text>
            {selectedAnswer === idx && (
              <Ionicons name="checkmark" size={18} color="#2563EB" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedAnswer === null && styles.submitButtonDisabled,
        ]}
        onPress={submitAnswer}
        disabled={selectedAnswer === null}
      >
        <Text style={styles.submitButtonText}>
          {currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2563EB",
  },
  questionText: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1E293B",
    marginBottom: 32,
    lineHeight: 36,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  optionMargin: {
    marginTop: 12,
  },
  optionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 18,
    fontWeight: 500,
    color: "#1E293B",
    flex: 1,
  },
  optionTextSelected: {
    color: "#1E3A8A",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  awardCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FEF9C3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: "#1E293B",
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 22,
    color: "#475569",
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    maxWidth: 300,
    height: 16,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 8,
  },
  resultMessage: {
    fontSize: 18,
    color: "#64748B",
    fontStyle: "italic",
    marginBottom: 40,
    textAlign: "center",
  },
  resultButtons: {
    flex: 1,
    maxWidth: 400,
  },
  readAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  readAgainText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  moreStoriesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  moreStoriesText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 12,
  },
});
