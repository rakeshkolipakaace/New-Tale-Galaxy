import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book3DProps {
  children: React.ReactNode;
  onFlip?: (direction: 'next' | 'prev') => void;
}

// This component manages the 3D flipping container
export function Book3D({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full h-full perspective-2000 transform-style-3d">
            {children}
        </div>
    );
}

// Individual Page Component that handles the flip animation
export function FlipPage({ 
    children, 
    zIndex, 
    direction = 0, // 0 = static, 1 = flipping to next (right to left), -1 = flipping to prev (left to right)
    onFlipComplete 
}: { 
    children: React.ReactNode, 
    zIndex: number, 
    direction?: number,
    onFlipComplete?: () => void
}) {
    // Rotation logic:
    // If direction is 1 (Next): Start at 0, rotate Y to -180
    // If direction is -1 (Prev): Start at -180, rotate Y to 0
    // If direction is 0: Static at 0
    
    // Actually, for a book:
    // Right pages sit at 0deg. Left pages (flipped) sit at -180deg.
    // When we flip NEXT: The current Right page rotates from 0 to -180.
    // When we flip PREV: The current Left page rotates from -180 to 0.

    return (
        <motion.div
            className="absolute inset-0 w-full h-full bg-paper backface-hidden origin-left shadow-xl"
            style={{ 
                zIndex,
                transformStyle: 'preserve-3d',
            }}
            initial={direction === 1 ? { rotateY: 0 } : direction === -1 ? { rotateY: -180 } : { rotateY: 0 }}
            animate={direction === 1 ? { rotateY: -180 } : direction === -1 ? { rotateY: 0 } : { rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={onFlipComplete}
        >
            {children}
        </motion.div>
    );
}

// Helper to highlight text sequentially
export function SequentialHighlighter({ text, transcript, isRecordMode, isExplainMode, onMispronounced }: { text: string, transcript: string, isRecordMode: boolean, isExplainMode: boolean, onMispronounced?: (word: string) => void }) {
    if (!isRecordMode && !isExplainMode) return <span>{text}</span>;

    // Normalize text and transcript for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    
    const textWords = text.split(' '); // Keep original punctuation/casing for display
    const cleanTextWords = normalize(text);
    const cleanTranscriptWords = normalize(transcript);

    // Find the furthest matching index
    let lastMatchIndex = -1;
    
    // Logic for Record Mode (matching transcript)
    if (isRecordMode) {
        let textCursor = 0;
        for (const tWord of cleanTranscriptWords) {
            let matched = false;
            for (let i = textCursor; i < Math.min(textCursor + 5, cleanTextWords.length); i++) {
                if (cleanTextWords[i] === tWord) {
                    textCursor = i + 1;
                    lastMatchIndex = i;
                    matched = true;
                    break;
                }
            }
            
            // If we didn't match and it's a reasonably long word, track it as potentially mispronounced
            if (!matched && tWord.length > 2 && onMispronounced) {
                const targetWord = cleanTextWords[textCursor];
                if (targetWord && targetWord !== tWord) {
                    // Use a timeout to avoid setting state during render
                    setTimeout(() => onMispronounced(targetWord), 0);
                }
            }
        }
    }

    return (
        <span>
            {textWords.map((word, i) => {
                const isRead = isRecordMode && i <= lastMatchIndex;
                const isCurrent = isRecordMode && i === lastMatchIndex + 1;
                
                return (
                    <span 
                        key={i} 
                        className={`transition-all duration-300 px-0.5 rounded-sm inline-block ${
                            isExplainMode 
                                ? "border-b-2 border-blue-400 font-medium bg-blue-50/50" 
                                : isRead
                                    ? "bg-green-100 text-green-800 font-medium" 
                                    : isCurrent
                                        ? "bg-yellow-100 border-b-2 border-yellow-400"
                                        : ""
                        }`}
                    >
                        {word}{' '}
                    </span>
                );
            })}
        </span>
    );
}
