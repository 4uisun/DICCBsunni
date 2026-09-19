import React, { useState } from "react";
import { BookOpen, Volume2, ArrowRight } from "lucide-react";
import { MeaningGroup } from "../types.js";
import { speakText } from "../utils/audio.js";

interface MeaningsSectionProps {
  meanings: MeaningGroup[];
  onWordClick: (word: string) => void;
}

export const MeaningsSection: React.FC<MeaningsSectionProps> = ({
  meanings,
  onWordClick,
}) => {
  const [selectedPos, setSelectedPos] = useState<string>("all");
  const [playingExampleIndex, setPlayingExampleIndex] = useState<string | null>(null);

  const partsOfSpeech = Array.from(new Set(meanings.map(m => m.partOfSpeech)));

  const filteredMeanings = selectedPos === "all"
    ? meanings
    : meanings.filter(m => m.partOfSpeech === selectedPos);

  const handlePlaySentence = (text: string, id: string) => {
    setPlayingExampleIndex(id);
    speakText(text, "US");
    setTimeout(() => setPlayingExampleIndex(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8" id="meanings-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Authoritative English Definitions
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              English-to-English lexical senses & grammatical definitions
            </p>
          </div>
        </div>

        {/* Part of Speech Filter Tabs */}
        {partsOfSpeech.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedPos("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedPos === "all"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All ({meanings.reduce((acc, m) => acc + m.definitions.length, 0)})
            </button>
            {partsOfSpeech.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold italic capitalize transition-colors ${
                  selectedPos === pos
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Definitions List */}
      <div className="pt-6 space-y-8">
        {filteredMeanings.map((group, groupIdx) => (
          <div key={`${group.partOfSpeech}-${groupIdx}`} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-stone-900 text-base italic px-2.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                {group.partOfSpeech}
              </span>
              <div className="h-px flex-1 bg-stone-100" />
            </div>

            <ol className="space-y-5">
              {group.definitions.map((defItem, defIdx) => {
                const exampleId = `${groupIdx}-${defIdx}`;
                return (
                  <li key={defIdx} className="flex items-start gap-3.5 group">
                    <span className="font-mono text-xs font-bold text-stone-400 bg-stone-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {defIdx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-stone-800 text-base sm:text-lg leading-relaxed font-sans font-normal">
                        {defItem.definition}
                      </p>

                      {/* Example sentence */}
                      {defItem.example && (
                        <div className="flex items-start justify-between gap-3 bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-sm text-stone-700 font-serif italic">
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 font-serif font-bold text-lg leading-none select-none">“</span>
                            <span className="leading-relaxed not-italic">{defItem.example}</span>
                          </div>
                          <button
                            onClick={() => handlePlaySentence(defItem.example!, exampleId)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors shrink-0"
                            title="Listen to example sentence"
                          >
                            <Volume2 className={`w-4 h-4 ${playingExampleIndex === exampleId ? 'text-amber-600 animate-pulse' : ''}`} />
                          </button>
                        </div>
                      )}

                      {/* Synonyms & Antonyms for this sense */}
                      {defItem.synonyms && defItem.synonyms.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500 pt-1">
                          <span className="font-semibold text-stone-400">Synonyms:</span>
                          {defItem.synonyms.slice(0, 6).map((syn) => (
                            <button
                              key={syn}
                              onClick={() => onWordClick(syn)}
                              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 font-sans cursor-pointer transition-colors"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}

                      {defItem.antonyms && defItem.antonyms.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500 pt-1">
                          <span className="font-semibold text-stone-400">Antonyms:</span>
                          {defItem.antonyms.slice(0, 5).map((ant) => (
                            <button
                              key={ant}
                              onClick={() => onWordClick(ant)}
                              className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60 font-sans cursor-pointer transition-colors"
                            >
                              {ant}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};
