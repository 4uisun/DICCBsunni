let currentAudio: HTMLAudioElement | null = null;

export function playPronunciationAudio(audioUrl?: string, fallbackText?: string, accent: 'US' | 'UK' = 'US') {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // If a recorded audio file exists, try playing it first
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      audio.play().catch(() => {
        // If audio file fails (e.g. CORS or 404), fall back to SpeechSynthesis
        if (fallbackText) {
          speakText(fallbackText, accent);
        }
      });
      return;
    } catch {
      // Fall through to speech synthesis
    }
  }

  // Fallback to Web Speech API
  if (fallbackText) {
    speakText(fallbackText, accent);
  }
}

export function speakText(text: string, accent: 'US' | 'UK' = 'US', rate: number = 0.95) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel(); // Stop any currently speaking speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetLang = accent === 'UK' ? 'en-GB' : 'en-US';
    const preferredVoice = voices.find(v => v.lang.replace('_', '-') === targetLang && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      const fallbackVoice = voices.find(v => v.lang.startsWith('en'));
      if (fallbackVoice) utterance.voice = fallbackVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}
