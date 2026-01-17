import { useState, useEffect } from 'react';
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { stories } from "@/lib/storyData";
import { useSpeechToText, useTextToSpeech } from "@/hooks/useVoice";
import { SequentialHighlighter } from "@/components/Book3D";
import { QuizInterface } from "@/components/QuizInterface";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, BookOpen, X, ChevronLeft, Award, PlayCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function Book() {
  const [match, params] = useRoute("/read/:genre/:storyId");
  const [, setLocation] = useLocation();
  const genreId = params?.genre || 'animals';
  const storyId = params?.storyId;
  
  // Find the specific story
  const genreStories = stories[genreId] || [];
  const story = genreStories.find(s => s.id === storyId) || genreStories[0];

  // States: 'cover' | 'reading' | 'ended' | 'quiz'
  const [bookState, setBookState] = useState<'cover' | 'reading' | 'ended' | 'quiz'>('cover');
  const [pageIndex, setPageIndex] = useState(0);
  const [mispronouncedWords, setMispronouncedWords] = useState<Set<string>>(new Set());
  
  // Controls automatic page turning
  const [autoTurnTrigger, setAutoTurnTrigger] = useState(0);

  // Turn page logic (hoisted for use in TTS callback)
  const turnPage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (pageIndex < story.pages.length - 1) {
        setPageIndex(p => p + 1);
        resetTranscript();
      } else {
        setBookState('ended');
      }
    } else {
      if (pageIndex > 0) {
        setPageIndex(p => p - 1);
        resetTranscript();
      } else {
        setBookState('cover');
      }
    }
  };

  // Voice Hooks
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
  
  // TTS Hook with Auto-Turn Callback
  const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech({
      onEnd: () => {
          setTimeout(() => {
              setAutoTurnTrigger(t => t + 1);
          }, 1000);
      }
  });
  
  // Local UI State
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [isExplainMode, setIsExplainMode] = useState(false);

  // Effect: Handle Auto-Turn Trigger
  useEffect(() => {
      if (autoTurnTrigger > 0 && isExplainMode && bookState === 'reading') {
          if (pageIndex < story.pages.length - 1) {
              turnPage('next');
          } else {
              setIsExplainMode(false);
              setBookState('ended');
          }
      }
  }, [autoTurnTrigger]);

  // Effect: Auto-read new page if Explain Mode is ON
  useEffect(() => {
      if (isExplainMode && bookState === 'reading') {
          const timer = setTimeout(() => {
              speak(story.pages[pageIndex].text);
          }, 800);
          return () => clearTimeout(timer);
      }
  }, [pageIndex, isExplainMode, bookState]);

  // Auto-stop recording/speaking when story ends
  useEffect(() => {
    if (bookState === 'ended' || bookState === 'quiz') {
      setIsRecordMode(false);
      stopListening();
      stopSpeaking();
      setIsExplainMode(false);
    }
  }, [bookState]);

  // Handle Record Toggle
  const toggleRecord = () => {
    if (isRecordMode) {
      setIsRecordMode(false);
      stopListening();
    } else {
      setIsRecordMode(true);
      setIsExplainMode(false);
      stopSpeaking();
      startListening();
    }
  };

  // Handle Explain Toggle 
  const toggleExplain = () => {
    if (isExplainMode) {
      setIsExplainMode(false);
      stopSpeaking();
    } else {
      setIsExplainMode(true);
      setIsRecordMode(false);
      stopListening();
    }
  };

  // Read Again - Reset to cover
  const handleReadAgain = () => {
    setPageIndex(0);
    setBookState('cover');
    setIsRecordMode(false);
    setIsExplainMode(false);
    stopListening();
    stopSpeaking();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-zinc-900 relative overflow-hidden">
      
      {/* Navigation / Close */}
      <div className="absolute top-4 left-4 z-50">
         <Button 
           variant="ghost" 
           className="rounded-full w-10 h-10 p-0 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md" 
           onClick={() => setLocation(`/book/${genreId}`)}
           data-testid="button-back"
         >
           <ChevronLeft className="w-6 h-6" />
         </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
              
              {/* STATE: COVER */}
              {bookState === 'cover' && (
                  <motion.div 
                      key="cover"
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 90 }}
                      transition={{ duration: 0.6 }}
                      className="w-full max-w-4xl h-full flex items-center justify-center"
                  >
                       <div className="text-center space-y-6 max-w-md sm:max-w-lg w-full p-8 md:p-12 bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-r-[12px] border-stone-200 relative overflow-hidden group">
                           {/* Book Spine Effect */}
                           <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-stone-300 to-stone-100 border-r border-stone-300"></div>
                           
                           <motion.img 
                              layoutId={`image-${story.title}`}
                              src={story.pages[0].image} 
                              className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full object-cover border-8 border-stone-100 shadow-2xl" 
                              alt={story.title}
                           />
                           
                           <div className="relative z-10">
                              <h1 className="text-3xl sm:text-4xl md:text-6xl font-story font-bold text-stone-800 mb-2">{story.title}</h1>
                              <p className="text-stone-500 text-base sm:text-lg">Swipe to open the book</p>
                           </div>

                           <Button 
                              onClick={() => setBookState('reading')}
                              className="w-full py-6 sm:py-8 text-xl sm:text-2xl rounded-2xl bg-stone-800 hover:bg-black text-white font-bold shadow-xl transition-all hover:scale-105"
                              data-testid="button-start-reading"
                           >
                              <BookOpen className="mr-3 w-6 h-6 sm:w-8 sm:h-8" /> Start Reading
                           </Button>
                       </div>
                  </motion.div>
              )}

              {/* STATE: READING */}
              {bookState === 'reading' && (
                  <motion.div 
                      key="book-spread"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-7xl h-full flex flex-col sm:flex-row relative"
                      style={{ perspective: '2000px' }}
                  >
                       {/* The Book Container */}
                       <div className="flex-1 flex flex-col sm:flex-row bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative border border-stone-200">
                           
                           {/* Left Page (Image) */}
                           <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-stone-50 border-b sm:border-b-0 sm:border-r border-stone-300 relative overflow-hidden p-4 sm:p-6 flex items-center justify-center">
                               <AnimatePresence mode="wait">
                                 <motion.div
                                    key={`img-${pageIndex}`}
                                    initial={{ opacity: 0, x: 100, rotateY: -30 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    exit={{ opacity: 0, x: -100, rotateY: 30 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="w-full h-full relative"
                                    style={{ transformStyle: 'preserve-3d' }}
                                 >
                                     <img 
                                        src={story.pages[pageIndex].image} 
                                        className="w-full h-full object-contain drop-shadow-2xl" 
                                        alt={`Page ${pageIndex + 1}`}
                                     />
                                 </motion.div>
                               </AnimatePresence>
                               <div className="absolute bottom-4 left-4 font-story text-stone-400 text-sm">Page {pageIndex + 1}</div>
                           </div>

                           {/* Right Page (Text) with Page Turn Animation */}
                           <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-[#fffbf0] relative overflow-hidden flex flex-col p-6 sm:p-8 md:p-16" style={{ perspective: '1500px' }}>
                                {/* Paper Texture */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
                                
                                {/* Page Turn Animation Overlay */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                      key={`text-${pageIndex}`}
                                      initial={{ 
                                        opacity: 0, 
                                        rotateY: -90,
                                        x: -50,
                                        transformOrigin: "left center"
                                      }}
                                      animate={{ 
                                        opacity: 1, 
                                        rotateY: 0,
                                        x: 0
                                      }}
                                      exit={{ 
                                        opacity: 0, 
                                        rotateY: 90,
                                        x: 50,
                                        transformOrigin: "right center"
                                      }}
                                      transition={{ 
                                        duration: 0.6, 
                                        ease: [0.4, 0, 0.2, 1]
                                      }}
                                      className="prose prose-sm sm:prose-lg md:prose-2xl font-story leading-loose text-stone-800 flex-1 overflow-y-auto z-10 scrollbar-hide relative"
                                      style={{ 
                                        transformStyle: 'preserve-3d',
                                        backfaceVisibility: 'hidden'
                                      }}
                                    >
                                        {/* Page Shadow Effect During Turn */}
                                        <motion.div
                                          className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-20"
                                          initial={{ opacity: 0.5 }}
                                          animate={{ opacity: 0 }}
                                          transition={{ duration: 0.3, delay: 0.3 }}
                                        />
                                        <p>
                                          <SequentialHighlighter 
                                              text={story.pages[pageIndex].text} 
                                              transcript={transcript} 
                                              isRecordMode={isRecordMode} 
                                              isExplainMode={isExplainMode}
                                              onMispronounced={(word) => {
                                                if (!word) return;
                                                setMispronouncedWords(prev => {
                                                  if (prev.has(word)) return prev;
                                                  const next = new Set(prev);
                                                  next.add(word);
                                                  return next;
                                                });
                                              }}
                                          />
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Swipe Arrows */}
                                <div className="mt-4 flex justify-between items-center text-stone-400 text-xs sm:text-sm font-bold uppercase tracking-widest z-30">
                                    <button 
                                      onClick={() => turnPage('prev')} 
                                      className="flex items-center gap-1 cursor-pointer hover:text-stone-600 transition-colors disabled:opacity-30"
                                      disabled={pageIndex === 0}
                                      data-testid="button-prev-page"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span className="hidden sm:inline">Previous</span>
                                    </button>
                                    <button 
                                      onClick={() => turnPage('next')} 
                                      className="flex items-center gap-1 cursor-pointer hover:text-stone-600 transition-colors"
                                      data-testid="button-next-page"
                                    >
                                      <span className="hidden sm:inline">Next</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                           </div>

                           {/* Center Spine Shadow (Hidden on mobile) */}
                           <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none z-20" />
                       </div>
                  </motion.div>
              )}

              {/* STATE: ENDED */}
              {bookState === 'ended' && (
                  <motion.div 
                      key="ended"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full flex items-center justify-center p-4"
                  >
                       <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-none shadow-2xl p-8 sm:p-12 text-center rounded-[40px]">
                          <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.2 }}
                              className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
                          >
                              <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
                          </motion.div>
                          <h2 className="text-4xl sm:text-6xl font-story font-bold mb-4 sm:mb-6 text-stone-800">The End</h2>
                          <p className="text-xl sm:text-2xl text-stone-500 mb-8 sm:mb-12">You've completed the story!</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              <Button 
                                  onClick={() => setBookState('quiz')}
                                  className="h-16 sm:h-20 text-lg sm:text-xl rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                  data-testid="button-start-quiz"
                              >
                                  Start Quiz
                              </Button>
                              <Button 
                                  variant="outline"
                                  onClick={() => setLocation(`/book/${genreId}`)}
                                  className="h-16 sm:h-20 text-lg sm:text-xl rounded-2xl border-4 border-stone-200 hover:bg-stone-100"
                                  data-testid="button-back-to-stories"
                              >
                                  Back to Stories
                              </Button>
                          </div>
                       </Card>
                  </motion.div>
              )}

              {/* STATE: QUIZ */}
              {bookState === 'quiz' && (
                  <motion.div 
                       key="quiz"
                       initial={{ y: "100%" }}
                       animate={{ y: 0 }}
                       exit={{ y: "100%" }}
                       transition={{ type: "spring", damping: 25 }}
                       className="absolute inset-0 bg-white z-50 overflow-y-auto"
                  >
                       <div className="min-h-full flex flex-col max-w-3xl mx-auto p-4 md:p-8">
                           <div className="flex justify-end mb-4">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="rounded-full w-12 h-12 bg-stone-100" 
                                 onClick={() => setBookState('ended')}
                                 data-testid="button-close-quiz"
                               >
                                   <X className="w-6 h-6" />
                               </Button>
                           </div>
                           <div className="flex-1">
                               <QuizInterface 
                                 questions={story.quiz} 
                                 onComplete={() => {}}
                                 onReadAgain={handleReadAgain}
                                 onBackToStories={() => setLocation(`/book/${genreId}`)}
                                 mispronouncedWords={Array.from(mispronouncedWords)}
                               />
                           </div>
                       </div>
                  </motion.div>
              )}

          </AnimatePresence>
      </div>

      {/* Footer Controls (Only visible when reading) */}
      {(bookState === 'reading') && (
          <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="h-20 sm:h-24 bg-white/10 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-8 sm:gap-12 px-4 sm:px-8 z-40 shadow-2xl"
          >
              {/* Explain Button */}
              <div className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer" onClick={toggleExplain} data-testid="button-explain">
                   <div className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                      isExplainMode ? "bg-blue-500 text-white scale-110" : "bg-white text-stone-400 hover:bg-blue-50 hover:text-blue-500"
                   )}>
                      {isSpeaking ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" /> : <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                   </div>
                   <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Explain</span>
              </div>

              {/* Record Button */}
              <div className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer" onClick={toggleRecord} data-testid="button-record">
                   <div className={cn(
                      "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4",
                      isRecordMode ? "bg-red-500 border-red-400 text-white scale-110 animate-pulse" : "bg-white border-transparent text-stone-400 hover:bg-red-50 hover:text-red-500"
                   )}>
                      {isRecordMode ? <Mic className="w-6 h-6 sm:w-8 sm:h-8" /> : <MicOff className="w-6 h-6 sm:w-8 sm:h-8" />}
                   </div>
                   <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Record</span>
              </div>
          </motion.div>
      )}
    </div>
  );
}
