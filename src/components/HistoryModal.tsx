import React from "react";
import { X, Clock, Trash2, ArrowRight } from "lucide-react";
import { SearchHistoryItem } from "../types.js";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onSelectWord: (word: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectWord,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Recent Searches
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Recently looked-up dictionary words
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {history.length === 0 ? (
            <div className="text-center py-10 text-stone-400 font-sans text-xs">
              No recent searches yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={`${item.word}-${item.timestamp}`}
                onClick={() => {
                  onSelectWord(item.word);
                  onClose();
                }}
                className="px-3.5 py-2.5 rounded-xl hover:bg-stone-100/80 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-semibold text-stone-800 group-hover:text-amber-700 text-sm sm:text-base transition-colors">
                    {item.word}
                  </span>
                  {item.cefr && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-200/80 text-stone-600">
                      {item.cefr}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span className="text-[11px] font-mono">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3.5 border-t border-stone-100 bg-stone-50 flex justify-end text-xs">
            <button
              onClick={onClearHistory}
              className="text-stone-500 hover:text-rose-600 font-medium transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
