import React, { useState } from "react";
import { Quote, Volume2, Copy, Check, Gauge } from "lucide-react";
import { DictionaryEntry } from "../types.js";
import { speakText } from "../utils/audio.js";

interface ExamplesSectionProps {
  entry: DictionaryEntry;
}

export const ExamplesSection: React.FC<ExamplesSectionProps> = ({ entry }) => {
  const [playbackRate, setPlaybackRate] = useState<number>(0.95);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Aggregate all example sentences across definitions and collocations
  const rawExamples: Array<{ text: string; source: string; category?: string }> = [];

  entry.meanings.forEach((m) => {
    m.definitions.forEach((d) => {
      if (d.example) {
        rawExamples.push({
          text: d.example,
          source: `Sense: ${m.partOfSpeech}`,
          category: "General Definition"
        });
      }
    });
  });

  const allCollocs = [
    ...(entry.collocations?.verbNoun || []),
    ...(entry.collocations?.adjectiveNoun || []),
    ...(entry.collocations?.prepositional || []),
    ...(entry.collocations?.adverbial || []),
    ...(entry.collocations?.idiomsPhrases || []),
  ];

  allCollocs.forEach((c) => {
    if (c.example && !rawExamples.some(e => e.text === c.example)) {
      rawExamples.push({
        text: c.example,
        source: `Collocation: ${c.phrase}`,
        category: c.pattern
      });
    }
  });

  const handlePlay = (text: string, idx: number) => {
    setPlayingIdx(idx);
    speakText(text, "US", playbackRate);
    setTimeout(() => setPlayingIdx(null), 2500);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  // Helper to highlight the target word in sentence
  const renderHighlightedText = (text: string, target: string) => {
    const regex = new RegExp(`\\b(${target}[a-z]*)\\b`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (part.toLowerCase().startsWith(target.toLowerCase())) {
        return (
          <strong key={i} className="text-amber-900 font-semibold bg-amber-100/70 px-1 py-0.5 rounded">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  if (rawExamples.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8" id="examples-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Authentic Contextual Examples
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Real-world sentences illustrating natural usage, syntax, and sentence structure
            </p>
          </div>
        </div>

        {/* Playback speed toggle */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium text-stone-600">
          <Gauge className="w-3.5 h-3.5 ml-1.5 text-stone-500" />
          <span className="text-[11px] text-stone-400 mr-1">Speed:</span>
          <button
            onClick={() => setPlaybackRate(0.8)}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              playbackRate === 0.8 ? "bg-white font-bold text-stone-900 shadow-2xs" : "hover:text-stone-900"
            }`}
          >
            0.8x (Slow)
          </button>
          <button
            onClick={() => setPlaybackRate(0.95)}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              playbackRate === 0.95 ? "bg-white font-bold text-stone-900 shadow-2xs" : "hover:text-stone-900"
            }`}
          >
            1.0x (Normal)
          </button>
        </div>
      </div>

      <div className="pt-6 space-y-4">
        {rawExamples.map((item, idx) => {
          const isPlaying = playingIdx === idx;
          const isCopied = copiedIdx === idx;

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50/60 hover:bg-stone-50 border border-stone-200/80 transition-all flex items-start justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-600">
                    {item.source}
                  </span>
                  {item.category && (
                    <span className="text-[10px] text-stone-400 font-sans">
                      • {item.category}
                    </span>
                  )}
                </div>

                <p className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed italic">
                  “{renderHighlightedText(item.text, entry.word)}”
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => handleCopy(item.text, idx)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
                  title="Copy sentence"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handlePlay(item.text, idx)}
                  className={`p-2 rounded-lg transition-all ${
                    isPlaying 
                      ? "bg-amber-100 text-amber-900 shadow-sm animate-pulse" 
                      : "bg-white hover:bg-stone-200/80 text-stone-700 border border-stone-200"
                  }`}
                  title="Listen to sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
