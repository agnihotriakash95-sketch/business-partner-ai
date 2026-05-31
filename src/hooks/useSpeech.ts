import { useCallback, useMemo, useState } from 'react';

type SpeechLanguage = 'English' | 'Hindi';

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: ArrayLike<{ 0: { transcript: string } }>;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const voiceForLanguage = (language: SpeechLanguage) => (language === 'Hindi' ? 'hi-IN' : 'en-IN');

export const useSpeech = () => {
  const [listening, setListening] = useState(false);
  const supported = useMemo(
    () => 'speechSynthesis' in window || 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    []
  );

  const speak = useCallback((text: string, language: SpeechLanguage = 'English') => {
    if (!('speechSynthesis' in window) || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u0900-\u097F]/.test(text) ? 'hi-IN' : voiceForLanguage(language);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith(utterance.lang) && /google|samantha|daniel|neural|premium/i.test(v.name)
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

  const listen = useCallback((onText: (text: string) => void, language: SpeechLanguage = 'English') => {
    const Recognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = voiceForLanguage(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => onText(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    setListening(true);
    recognition.start();
  }, []);

  return { supported, listening, listen, speak };
};
