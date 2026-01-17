import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
           finalTranscript += event.results[i][0].transcript;
        }
        // We append to the existing transcript state for a continuous stream
        // But for this "karaoke" style, we might want to just keep the latest session's text 
        // effectively to match against the current page.
        // Actually, let's just use the cumulative transcript for the current session.
        setTranscript(prev => {
            // A simple way is to just return the latest results if we reset on page turn
            return finalTranscript; 
        });
        
        // Better approach for stability:
        // Just extract the latest "final" result and append it? 
        // For simplicity in this prototype, let's rely on the recognition engine's buffer
        // which usually gives us the full phrase so far in the current session.
        let fullStr = '';
        for(let i=0; i<event.results.length; i++) {
            fullStr += event.results[i][0].transcript;
        }
        setTranscript(fullStr);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        // Don't auto-stop on no-speech, just keep listening
        if (event.error === 'not-allowed') {
             setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
          // Only restart if explicitly still in "listening" state
          // and we haven't manually stopped it
          if (isListening && recognitionRef.current) {
             try {
                // Check if already started to avoid error
                recognitionRef.current.start();
             } catch (e: any) {
                 // Ignore "already started" errors or other transient issues
                 if (e.name !== 'InvalidStateError') {
                     console.error('Failed to restart recognition:', e);
                 }
             }
          }
      };
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);
    if (recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch (e: any) {
            if (e.name === 'InvalidStateError') {
                // Already started, this is fine
            } else {
                console.error('Error starting recognition:', e);
            }
        }
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch(e) { }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    // If we are listening, we might want to restart the session to clear the buffer
    if(recognitionRef.current && isListening) {
        try {
            recognitionRef.current.stop(); 
        } catch(e) {}
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, resetTranscript };
}

export function useTextToSpeech({ onEnd }: { onEnd?: () => void } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Keep a ref to the onEnd callback so we can use the latest version without re-creating the utterance effect
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndRef.current) onEndRef.current();
      };
      utterance.onstart = () => setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, stop };
}
