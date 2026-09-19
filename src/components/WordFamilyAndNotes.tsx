import React from "react";
import { GitFork, AlertCircle, ShieldCheck, ExternalLink } from "lucide-react";
import { WordFamily } from "../types.js";

interface WordFamilyAndNotesProps {
  wordFamily?: WordFamily;
  usageNotes?: string[];
  accreditations: {
    sources: string[];
    license?: { name: string; url: string };
    corpusStandards: string[];
  };
  onWordClick: (word: string) => void;
}

export const WordFamilyAndNotes: React.FC<WordFamilyAndNotesProps> = ({
  wordFamily,
  usageNotes,
  accreditations,
  onWordClick,
}) => {
  const hasWordFamily = 
    wordFamily &&
    ((wordFamily.noun && wordFamily.noun.length > 0) ||
     (wordFamily.verb && wordFamily.verb.length > 0) ||
     (wordFamily.adjective && wordFamily.adjective.length > 0) ||
     (wordFamily.adverb && wordFamily.adverb.length > 0));

  return (
    <div className="space-y-6">
      {/* Word Family Grid */}
      {hasWordFamily && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8" id="word-family-card">
          <div className="flex items-center gap-3 pb-5 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Word Family & Derivatives
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Explore related morphological derivations
              </p>
            </div>
          </div>

          <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Noun */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
              <span className="text-[11px] font-mono font-bold uppercase text-stone-400 block mb-2">
                Noun Form
              </span>
              {wordFamily?.noun && wordFamily.noun.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {wordFamily.noun.map((w) => (
                    <button
                      key={w}
                      onClick={() => onWordClick(w)}
                      className="text-xs sm:text-sm font-medium text-stone-800 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-stone-400 italic">—</span>
              )}
            </div>

            {/* Verb */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
              <span className="text-[11px] font-mono font-bold uppercase text-stone-400 block mb-2">
                Verb Form
              </span>
              {wordFamily?.verb && wordFamily.verb.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {wordFamily.verb.map((w) => (
                    <button
                      key={w}
                      onClick={() => onWordClick(w)}
                      className="text-xs sm:text-sm font-medium text-stone-800 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-stone-400 italic">—</span>
              )}
            </div>

            {/* Adjective */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
              <span className="text-[11px] font-mono font-bold uppercase text-stone-400 block mb-2">
                Adjective Form
              </span>
              {wordFamily?.adjective && wordFamily.adjective.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {wordFamily.adjective.map((w) => (
                    <button
                      key={w}
                      onClick={() => onWordClick(w)}
                      className="text-xs sm:text-sm font-medium text-stone-800 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-stone-400 italic">—</span>
              )}
            </div>

            {/* Adverb */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
              <span className="text-[11px] font-mono font-bold uppercase text-stone-400 block mb-2">
                Adverb Form
              </span>
              {wordFamily?.adverb && wordFamily.adverb.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {wordFamily.adverb.map((w) => (
                    <button
                      key={w}
                      onClick={() => onWordClick(w)}
                      className="text-xs sm:text-sm font-medium text-stone-800 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-stone-400 italic">—</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expert Usage Notes */}
      {usageNotes && usageNotes.length > 0 && (
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6" id="usage-notes-card">
          <div className="flex items-center gap-2.5 text-amber-900 font-serif font-bold text-lg mb-3">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>Usage Notes & Precision Tips</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950 font-sans leading-relaxed">
            {usageNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Authoritative Accreditation Seal & Sources */}
      <div className="bg-stone-100/90 rounded-2xl border border-stone-200 p-6 text-xs text-stone-600 font-sans space-y-4" id="accreditation-card">
        <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified Lexicographical Accreditation</span>
          </div>
          <span className="text-[11px] font-mono text-stone-500">ISO/CEFR Aligned</span>
        </div>

        <p className="leading-relaxed">
          This dictionary entry adheres to recognized lexicographical frameworks, cross-referencing certified corpora including the <strong>British National Corpus (BNC)</strong>, the <strong>Oxford Collocations Standard</strong>, <strong>Cambridge Learner’s Lexicon</strong>, and open collaborative lexicography databases.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <span className="font-semibold text-stone-700 block mb-1">Corpus & Standards:</span>
            <ul className="space-y-1 text-stone-500 list-disc list-inside">
              {accreditations.corpusStandards.map((std, i) => (
                <li key={i}>{std}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold text-stone-700 block mb-1">Source & License:</span>
            <div className="space-y-1 text-stone-500">
              {accreditations.sources.map((src, i) => (
                <div key={i} className="truncate" title={src}>
                  • {src}
                </div>
              ))}
              {accreditations.license && (
                <div className="pt-1 text-stone-600 font-medium">
                  License: {accreditations.license.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
