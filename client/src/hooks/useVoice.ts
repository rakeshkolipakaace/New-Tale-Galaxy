import { useState, useEffect, useCallback } from 'react';
import { useVoiceRecorder, useVoiceStream } from '../../replit_integrations/audio';
import { useAudioPlayback } from '../../replit_integrations/audio/useAudioPlayback';

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recorder = useVoiceRecorder();
  
  const stream = useVoiceStream({
    onTranscript: (_delta: string, full: string) => {
      setTranscript(full);
    },
    onComplete: (full: string) => {
      setTranscript(full);
    }
  });

  const startListening = useCallback(async () => {
    setTranscript('');
    setIsListening(true);
    await recorder.startRecording();
  }, [recorder]);

  const stopListening = useCallback(async () => {
    setIsListening(false);
    const blob = await recorder.stopRecording();
    try {
      await stream.streamVoiceResponse('/api/conversations/1/messages', blob);
    } catch (error) {
      console.error('Transcription error:', error);
    }
  }, [recorder, stream]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, startListening, stopListening, resetTranscript };
}

export function useTextToSpeech({ onEnd }: { onEnd?: () => void } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { pushAudio, init, clear, state } = useAudioPlayback();
  
  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    setTranscript('');
    await init();
    clear();
    
    try {
      const response = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('TTS failed');
      
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "audio") {
              pushAudio(event.data);
            } else if (event.type === "transcript") {
              setTranscript(prev => prev + (event.data || ''));
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  }, [init, clear, pushAudio]);

  useEffect(() => {
    if (state === 'ended' && isSpeaking) {
      setIsSpeaking(false);
      onEnd?.();
    }
  }, [state, isSpeaking, onEnd]);

  const stop = useCallback(() => {
    clear();
    setIsSpeaking(false);
    setTranscript('');
  }, [clear]);

  return { isSpeaking, speak, stop, transcript };
}
