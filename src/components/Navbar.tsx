import React from "react";
import { BookOpen, Bookmark, Clock, ShieldCheck, Sparkles } from "lucide-react";

interface NavbarProps {
  onWordSelect: (word: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
  onWordOfTheDay: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onWordSelect,
  savedCount,
  onOpenSaved,
  onOpenHistory,
  onWordOfTheDay,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Accreditation Stamp */}
        <div 
          onClick={() => onWordSelect("resilience")}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600/30 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                English Collocation
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Certified Lexicon
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans hidden md:block">
              Authoritative English-to-English • Oxford & Cambridge Collocations • BNC Corpus
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onWordOfTheDay}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            title="Explore Word of the Day"
            id="nav-wotd-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Word of the Day</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            title="Recent Searches"
            id="nav-history-btn"
          >
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Recent</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-colors"
            title="Saved Words"
            id="nav-saved-btn"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 font-mono">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
