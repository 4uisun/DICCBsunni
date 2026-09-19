import React, { useState } from "react";
import { 
  Split, 
  Copy, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Filter, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { DictionaryEntry, MeaningGroup, SynonymNuance } from "../types.js";

interface SynonymsSectionProps {
  entry: DictionaryEntry;
  onWordClick: (word: string) => void;
}

export const SynonymsSection: React.FC<SynonymsSectionProps> = ({
  entry,
  onWordClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterPos, setFilterPos] = useState<string>("all");
  const [showType, setShowType] = useState<"all" | "synonyms" | "antonyms">("all");

  // Collect all unique parts of speech
  const partsOfSpeech = Array.from(new Set(entry.meanings.map(m => m.partOfSpeech)));

  // Aggregate all unique synonyms across all definitions and meaning groups
  const allSynonyms = Array.from(new Set([
    ...entry.meanings.flatMap(m => [
      ...(m.synonyms || []),
      ...m.definitions.flatMap(d => d.synonyms || [])
    ])
  ])).filter(w => w && w.toLowerCase() !== entry.word.toLowerCase());

  // Aggregate all unique antonyms across all definitions and meaning groups
  const allAntonyms = Array.from(new Set([
    ...entry.meanings.flatMap(m => [
      ...(m.antonyms || []),
      ...m.definitions.flatMap(d => d.antonyms || [])
    ])
  ])).filter(w => w && w.toLowerCase() !== entry.word.toLowerCase());

  const handleCopyAllSynonyms = () => {
    const text = `Synonyms for "${entry.word}":\n${allSynonyms.join(", ")}\n\nAntonyms:\n${allAntonyms.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMeanings = filterPos === "all"
    ? entry.meanings
    : entry.meanings.filter(m => m.partOfSpeech === filterPos);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8" id="synonyms-thesaurus-section">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800">
            <Split className="w-4 h-4 rotate-90" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Authoritative Synonyms & Antonyms
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900 font-semibold border border-emerald-200">
                Thesaurus
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Accredited lexical equivalents, semantic nuances, and contrastive vocabulary
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAllSynonyms}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy all synonyms and antonyms"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Quick Summary Cloud */}
      <div className="bg-stone-50/80 border border-stone-200/80 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Core Lexical Cloud for "{entry.word}"</span>
          </div>
          <span className="text-xs text-stone-500 font-sans">
            {allSynonyms.length} Synonyms • {allAntonyms.length} Antonyms
          </span>
        </div>

        {/* Synonyms Cloud */}
        {allSynonyms.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <span>Synonyms:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {allSynonyms.map((syn) => (
                <button
                  key={syn}
                  onClick={() => onWordClick(syn)}
                  className="group px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 border border-stone-200 hover:border-emerald-300 text-sm font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title={`Look up "${syn}"`}
                >
                  <span>{syn}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Antonyms Cloud */}
        {allAntonyms.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
            <span className="text-xs font-semibold text-rose-800 flex items-center gap-1">
              <span>Opposites / Antonyms:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {allAntonyms.map((ant) => (
                <button
                  key={ant}
                  onClick={() => onWordClick(ant)}
                  className="group px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-900 border border-stone-200 hover:border-rose-300 text-sm font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title={`Look up antonym "${ant}"`}
                >
                  <span>{ant}</span>
                  <ArrowRight className="w-3 h-3 text-rose-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nuance Comparison Box (When available) */}
      {entry.synonymNuances && entry.synonymNuances.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Synonym Nuance & Usage Distinctions
            </h3>
            <span className="text-xs text-stone-500 font-sans">
              (How to choose the precise English word)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {entry.synonymNuances.map((nuanceItem, idx) => (
              <div 
                key={idx} 
                className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-2 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onWordClick(nuanceItem.word)}
                    className="font-serif font-bold text-base text-stone-900 hover:text-amber-800 underline decoration-stone-300 hover:decoration-amber-600 underline-offset-4 transition-colors cursor-pointer"
                  >
                    {nuanceItem.word}
                  </button>
                  {nuanceItem.register && (
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-stone-200/80 text-stone-700">
                      {nuanceItem.register}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {nuanceItem.nuance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Senses Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Synonyms Grouped by Lexical Meaning
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {partsOfSpeech.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-400 mr-1 font-medium">Part of speech:</span>
                <button
                  onClick={() => setFilterPos("all")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                    filterPos === "all"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  All
                </button>
                {partsOfSpeech.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setFilterPos(pos)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                      filterPos === pos
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meanings and Senses List */}
        <div className="space-y-6">
          {filteredMeanings.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-stone-900 text-sm italic px-2.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                  {group.partOfSpeech}
                </span>
                <div className="h-px flex-1 bg-stone-100" />
              </div>

              <div className="space-y-4">
                {group.definitions.map((def, dIdx) => {
                  const hasSyns = def.synonyms && def.synonyms.length > 0;
                  const hasAnts = def.antonyms && def.antonyms.length > 0;

                  return (
                    <div 
                      key={dIdx}
                      className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-stone-400 bg-stone-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {dIdx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base text-stone-800 font-sans font-medium">
                            {def.definition}
                          </p>
                          {def.example && (
                            <p className="text-xs sm:text-sm text-stone-500 font-serif italic">
                              "{def.example}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Synonyms for this specific definition */}
                      {hasSyns && (
                        <div className="pt-2 border-t border-stone-100 flex items-start gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-emerald-800 mt-1 min-w-[70px]">
                            Synonyms:
                          </span>
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {def.synonyms!.map((syn) => (
                              <button
                                key={syn}
                                onClick={() => onWordClick(syn)}
                                className="px-2.5 py-1 rounded-md bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 text-xs font-medium transition-colors cursor-pointer"
                              >
                                {syn}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Antonyms for this specific definition */}
                      {hasAnts && (
                        <div className="pt-1 flex items-start gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-rose-800 mt-1 min-w-[70px]">
                            Antonyms:
                          </span>
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {def.antonyms!.map((ant) => (
                              <button
                                key={ant}
                                onClick={() => onWordClick(ant)}
                                className="px-2.5 py-1 rounded-md bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-200/60 text-xs font-medium transition-colors cursor-pointer"
                              >
                                {ant}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
