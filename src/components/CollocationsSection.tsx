import React, { useState } from "react";
import { 
  Layers, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { CollocationCategories, CollocationItem } from "../types.js";
import { speakText } from "../utils/audio.js";

interface CollocationsSectionProps {
  collocations: CollocationCategories;
  word: string;
}

type TabKey = "all" | "verbNoun" | "adjectiveNoun" | "prepositional" | "adverbial" | "idiomsPhrases";

const TAB_CONFIG: Array<{ key: TabKey; label: string; description: string }> = [
  { key: "all", label: "All Collocations", description: "Comprehensive native word combinations" },
  { key: "verbNoun", label: "Verb + Noun", description: "Verbs that naturally pair with this word" },
  { key: "adjectiveNoun", label: "Adjective + Noun", description: "Adjectives commonly describing this word" },
  { key: "prepositional", label: "Prepositional", description: "Prepositions and dependent particles" },
  { key: "adverbial", label: "Adverbial", description: "Adverbs modifying degree, frequency, or manner" },
  { key: "idiomsPhrases", label: "Idioms & Fixed Phrases", description: "Set expressions and idiomatic usages" },
];

export const CollocationsSection: React.FC<CollocationsSectionProps> = ({
  collocations,
  word,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getItemsForTab = (tab: TabKey): CollocationItem[] => {
    switch (tab) {
      case "verbNoun":
        return collocations.verbNoun || [];
      case "adjectiveNoun":
        return collocations.adjectiveNoun || [];
      case "prepositional":
        return collocations.prepositional || [];
      case "adverbial":
        return collocations.adverbial || [];
      case "idiomsPhrases":
        return collocations.idiomsPhrases || [];
      case "all":
      default:
        return [
          ...(collocations.verbNoun || []),
          ...(collocations.adjectiveNoun || []),
          ...(collocations.prepositional || []),
          ...(collocations.adverbial || []),
          ...(collocations.idiomsPhrases || []),
        ];
    }
  };

  const currentItems = getItemsForTab(activeTab);

  const handlePlayAudio = (sentence: string, id: string) => {
    setPlayingId(id);
    speakText(sentence, "US");
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleCopyPhrase = (phrase: string, id: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalCount = 
    (collocations.verbNoun?.length || 0) +
    (collocations.adjectiveNoun?.length || 0) +
    (collocations.prepositional?.length || 0) +
    (collocations.adverbial?.length || 0) +
    (collocations.idiomsPhrases?.length || 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8" id="collocations-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Authoritative Collocations
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-stone-100 text-stone-700 border border-stone-200 font-semibold">
                {totalCount} patterns
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans">
              Certified pairings referencing the Oxford Collocations Dictionary & British National Corpus
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Naturally sounding native combinations for <strong>{word}</strong></span>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="pt-5 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {TAB_CONFIG.map((tab) => {
            const count = tab.key === "all" ? totalCount : (collocations[tab.key]?.length || 0);
            if (count === 0 && tab.key !== "all") return null;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-stone-900 text-stone-100 shadow-sm"
                    : "bg-stone-100/80 hover:bg-stone-200/70 text-stone-600"
                }`}
                id={`collocation-tab-${tab.key}`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.key ? "bg-stone-700 text-stone-200" : "bg-stone-200 text-stone-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-stone-400 italic pt-1">
          {TAB_CONFIG.find(t => t.key === activeTab)?.description}
        </p>
      </div>

      {/* Collocation Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentItems.map((item, idx) => {
          const cardId = `${activeTab}-${idx}`;
          const isCopied = copiedId === cardId;
          const isPlaying = playingId === cardId;

          return (
            <div
              key={cardId}
              className="bg-stone-50/70 hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300 rounded-xl p-4.5 transition-all flex flex-col justify-between group shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              id={`collocation-card-${idx}`}
            >
              <div>
                {/* Header: Pattern badge + Copy button */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200/80 shadow-2xs">
                    {item.pattern}
                  </span>

                  <button
                    onClick={() => handleCopyPhrase(item.phrase, cardId)}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-200/60 transition-colors"
                    title="Copy collocation"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* The Phrase */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {item.phrase}
                </h3>

                {/* Nuance Note */}
                {item.note && (
                  <p className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200/50 rounded-md px-2 py-1 mt-2 inline-block font-sans">
                    💡 {item.note}
                  </p>
                )}
              </div>

              {/* Example Sentence with Audio */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-start justify-between gap-3">
                <p className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed">
                  <span className="text-stone-400 select-none mr-1">“</span>
                  {item.example}
                  <span className="text-stone-400 select-none ml-1">”</span>
                </p>

                <button
                  onClick={() => handlePlayAudio(item.example, cardId)}
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isPlaying 
                      ? "bg-amber-100 text-amber-800 animate-pulse" 
                      : "text-stone-400 hover:text-stone-700 hover:bg-stone-200/70"
                  }`}
                  title="Listen to example sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12 text-stone-500 font-sans">
          No collocations listed under this specific filter.
        </div>
      )}
    </div>
  );
};
