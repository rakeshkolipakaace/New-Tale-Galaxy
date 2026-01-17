import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Award, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuizQuestion } from '@/lib/storyData';

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete?: () => void;
  onReadAgain?: () => void;
  onBackToStories?: () => void;
  mispronouncedWords?: string[];
}

export function QuizInterface({ questions, onComplete, onReadAgain, onBackToStories, mispronouncedWords = [] }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      if (onComplete) onComplete();
    }
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    let message = "Great job! Keep reading!";
    if (percentage === 100) message = "Perfect Score! You're a reading master!";
    else if (percentage >= 80) message = "Excellent work! Almost perfect!";
    else if (percentage >= 60) message = "Good job! You understood the story well!";

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4"
        >
          <Award className="w-12 h-12 text-yellow-600" />
        </motion.div>
        
        <h2 className="text-3xl sm:text-4xl font-story font-bold text-slate-800">Quiz Complete!</h2>
        <p className="text-xl sm:text-2xl text-slate-600">You scored {score} out of {questions.length}</p>
        
        <div className="w-full max-w-md bg-slate-200 rounded-full h-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-green-500 h-full"
          />
        </div>
        
        <p className="text-slate-500 italic text-lg">{message}</p>

        {mispronouncedWords.length > 0 && (
          <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-100 text-left w-full max-w-md">
            <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Words to practice:
            </h4>
            <div className="flex flex-wrap gap-2">
              {mispronouncedWords.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium shadow-sm">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-6">
          {onReadAgain && (
            <Button
              onClick={onReadAgain}
              className="flex-1 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              data-testid="button-read-again"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Read Again
            </Button>
          )}
          {onBackToStories && (
            <Button
              onClick={onBackToStories}
              variant="outline"
              className="flex-1 py-6 text-lg rounded-xl border-2 border-slate-200 hover:bg-slate-100 font-bold"
              data-testid="button-back-stories"
            >
              <Home className="w-5 h-5 mr-2" />
              More Stories
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Question {currentQuestion + 1}/{questions.length}
        </span>
        <span className="text-sm font-bold text-blue-600">Score: {score}</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-story font-bold text-slate-800 mb-8 leading-relaxed">
        {questions[currentQuestion].question}
      </h3>

      <div className="space-y-3 flex-1">
        {questions[currentQuestion].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
              ${selectedAnswer === idx 
                ? 'border-blue-600 bg-blue-50 text-blue-900' 
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            data-testid={`quiz-option-${idx}`}
          >
            <span className="font-medium text-base sm:text-lg">{opt}</span>
            {selectedAnswer === idx && <Check className="w-5 h-5 text-blue-600" />}
          </button>
        ))}
      </div>

      <Button 
        onClick={submitAnswer}
        disabled={selectedAnswer === null}
        className="mt-8 w-full py-6 text-lg rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide disabled:opacity-50"
        data-testid="button-submit-answer"
      >
        {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
      </Button>
    </div>
  );
}
