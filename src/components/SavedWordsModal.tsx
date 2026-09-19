import React from "react";
import { X, Bookmark, Trash2, ArrowRight, Download, BookOpen } from "lucide-react";
import { DictionaryEntry } from "../types.js";

interface SavedWordItem {
  word: string;
  cefrLevel?: string;
  primaryDefinition?: string;
  savedAt: number;
}

interface SavedWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: SavedWordItem[];
  onSelectWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onClearAll: () => void;
}

export const SavedWordsModal: React.FC<SavedWordsModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onSelectWord,
  onRemoveWord,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const text = savedWords
      .map(w => `${w.word}\t${w.cefrLevel || ""}\t${w.primaryDefinition || ""}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocabulary_list_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Saved Vocabulary ({savedWords.length})
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Review your bookmarked words and collocations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {savedWords.length === 0 ? (
            <div className="text-center py-12 text-stone-400 font-sans space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">No saved words yet.</p>
              <p className="text-xs">Click the bookmark icon on any word to save it for study.</p>
            </div>
          ) : (
            savedWords.map((item) => (
              <div
                key={item.word}
                className="p-3.5 rounded-xl border border-stone-200/80 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-all flex items-center justify-between gap-3 group"
              >
                <div 
                  onClick={() => {
                    onSelectWord(item.word);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors">
                      {item.word}
                    </span>
                    {item.cefrLevel && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">
                        {item.cefrLevel}
                      </span>
                    )}
                  </div>
                  {item.primaryDefinition && (
                    <p className="text-xs text-stone-600 font-sans line-clamp-1 mt-0.5">
                      {item.primaryDefinition}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onSelectWord(item.word);
                      onClose();
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200/60 transition-colors"
                    title="View word"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveWord(item.word)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {savedWords.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
            >
              Clear All
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export List (TSV)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
