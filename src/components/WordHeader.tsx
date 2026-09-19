import React, { useState } from "react";
import { 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  History,
  Sparkles
} from "lucide-react";
import { DictionaryEntry } from "../types.js";
import { playPronunciationAudio } from "../utils/audio.js";

interface WordHeaderProps {
  entry: DictionaryEntry;
  isSaved: boolean;
  onToggleSave: () => void;
  onWordClick?: (word: string) => void;
  onViewThesaurus?: () => void;
}

const CEFR_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  A1: { label: "A1 • Beginner", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  A2: { label: "A2 • Elementary", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  B1: { label: "B1 • Intermediate", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  B2: { label: "B2 • Upper-Intermediate", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  C1: { label: "C1 • Advanced", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  C2: { label: "C2 • Proficiency", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
};

export const WordHeader: React.FC<WordHeaderProps> = ({
  entry,
  isSaved,
  onToggleSave,
  onWordClick,
  onViewThesaurus,
}) => {
  const [copied, setCopied] = useState(false);
  const [playingAccent, setPlayingAccent] = useState<'US' | 'UK' | null>(null);

  // Extract top unique synonyms for instant header preview
  const topSynonyms = Array.from(new Set([
    ...entry.meanings.flatMap(m => [
      ...(m.synonyms || []),
      ...m.definitions.flatMap(d => d.synonyms || [])
    ])
  ])).filter(w => w && w.toLowerCase() !== entry.word.toLowerCase()).slice(0, 6);

  // Locate US & UK audio or general audio
  const usPhonetic = entry.phonetics.find(p => p.accent === 'US' && p.audio);
  const ukPhonetic = entry.phonetics.find(p => p.accent === 'UK' && p.audio);
  const anyAudioPhonetic = entry.phonetics.find(p => p.audio);

  const handlePlayAudio = (accent: 'US' | 'UK') => {
    setPlayingAccent(accent);
    const audioUrl = accent === 'US' 
      ? (usPhonetic?.audio || anyAudioPhonetic?.audio) 
      : (ukPhonetic?.audio || anyAudioPhonetic?.audio);

    playPronunciationAudio(audioUrl, entry.word, accent);
    setTimeout(() => setPlayingAccent(null), 1200);
  };

  const handleCopyWordInfo = () => {
    const primaryDef = entry.meanings[0]?.definitions[0]?.definition || "";
    const collocationsText = entry.collocations?.verbNoun?.slice(0, 2).map(c => c.phrase).join(", ");
    const textToCopy = `${entry.word} (${entry.phonetic || ""})\nCEFR: ${entry.cefrLevel || "B2"}\nDefinition: ${primaryDef}\nKey Collocations: ${collocationsText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cefrStyle = entry.cefrLevel && CEFR_LABELS[entry.cefrLevel] 
    ? CEFR_LABELS[entry.cefrLevel] 
    : CEFR_LABELS.B2;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8" id="word-header-card">
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* CEFR Badge */}
          {entry.cefrLevel && (
            <span 
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border flex items-center gap-1.5 ${cefrStyle.bg} ${cefrStyle.color} ${cefrStyle.border}`}
              title="Common European Framework of Reference for Languages"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {cefrStyle.label}
            </span>
          )}

          {/* Frequency tier */}
          {entry.frequency && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
              {entry.frequency} Frequency
            </span>
          )}

          {/* Accreditations tag */}
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Authoritative Lexicon</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyWordInfo}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Copy Word & Definition"
            id="copy-word-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleSave}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isSaved
                ? "bg-amber-100/80 border-amber-300 text-amber-900"
                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
            id="save-word-btn"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-700" />
                <span>Saved to Vocabulary</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-stone-500" />
                <span>Save Word</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Word Title & Phonetics */}
      <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
            {entry.word}
          </h1>

          {/* IPA Phonetic & Audio Triggers */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-stone-600">
            {entry.phonetic && (
              <span className="font-mono text-base sm:text-lg text-stone-600 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200/80">
                {entry.phonetic}
              </span>
            )}

            {/* US Pronunciation */}
            <button
              onClick={() => handlePlayAudio('US')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                playingAccent === 'US'
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-300"
              }`}
              id="pronounce-us-btn"
            >
              <Volume2 className={`w-3.5 h-3.5 ${playingAccent === 'US' ? 'animate-pulse' : 'text-stone-500'}`} />
              <span>US Audio</span>
            </button>

            {/* UK Pronunciation */}
            <button
              onClick={() => handlePlayAudio('UK')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                playingAccent === 'UK'
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-300"
              }`}
              id="pronounce-uk-btn"
            >
              <Volume2 className={`w-3.5 h-3.5 ${playingAccent === 'UK' ? 'animate-pulse' : 'text-stone-500'}`} />
              <span>UK Audio</span>
            </button>
          </div>

          {/* Quick Synonyms Pill Row */}
          {topSynonyms.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-stone-500 uppercase tracking-wider text-[11px] font-mono">
                Key Synonyms:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {topSynonyms.map((syn) => (
                  <button
                    key={syn}
                    onClick={() => onWordClick?.(syn)}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-medium transition-colors cursor-pointer shadow-2xs"
                    title={`Lookup synonym "${syn}"`}
                  >
                    {syn}
                  </button>
                ))}
                {onViewThesaurus && (
                  <button
                    onClick={onViewThesaurus}
                    className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    + View Thesaurus
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Origin / Etymology preview */}
        {entry.origin && (
          <div className="max-w-md bg-stone-50/80 border border-stone-200/80 rounded-xl p-3 text-xs text-stone-600 font-sans">
            <div className="font-semibold text-stone-800 flex items-center gap-1 mb-1">
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>Etymology & Linguistic Roots</span>
            </div>
            <p className="leading-relaxed line-clamp-2">{entry.origin}</p>
          </div>
        )}
      </div>
    </div>
  );
};
