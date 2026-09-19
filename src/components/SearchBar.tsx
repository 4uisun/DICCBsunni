import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, CornerDownLeft, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
  currentWord?: string;
}

const POPULAR_WORDS = [
  "resilience",
  "scrutiny",
  "collaborate",
  "meticulous",
  "sustainable",
  "articulate",
  "empathy",
  "ambiguous"
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  currentWord
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync query when currentWord changes
  useEffect(() => {
    if (currentWord && currentWord !== query) {
      setQuery(currentWord);
    }
  }, [currentWord]);

  // Global hotkey '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dictionary/suggest?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
            setShowDropdown(true);
            setSelectedIndex(-1);
          }
        }
      } catch {
        // Silently ignore suggestions error
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetWord = selectedIndex >= 0 && suggestions[selectedIndex] 
      ? suggestions[selectedIndex] 
      : query.trim();
      
    if (targetWord) {
      setShowDropdown(false);
      onSearch(targetWord);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelectWord = (word: string) => {
    setQuery(word);
    setShowDropdown(false);
    onSearch(word);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-stone-200/90 focus-within:border-stone-800 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
          <div className="pl-4 sm:pl-5 text-stone-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : (
              <Search className="w-5 h-5 text-stone-500" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any English word (e.g. resilience, collaborate, scrutiny)..."
            className="w-full py-4 pl-3 pr-28 text-base sm:text-lg font-sans text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
            autoComplete="off"
            spellCheck="false"
            id="dictionary-search-input"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                title="Clear"
                id="search-clear-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded border border-stone-200">
              <span>Press</span>
              <kbd className="font-semibold text-stone-600">Enter</kbd>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              id="search-submit-btn"
            >
              <span>Search</span>
              <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 max-h-72 overflow-y-auto"
            id="autocomplete-dropdown"
          >
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
              <span>Suggested Matches</span>
              <span className="text-[10px]">Use ↑↓ to navigate</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSelectWord(suggestion)}
                className={`w-full text-left px-4 py-2.5 text-sm sm:text-base flex items-center justify-between transition-colors ${
                  selectedIndex === index
                    ? "bg-stone-100 text-stone-900 font-medium"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
                id={`suggestion-${index}`}
              >
                <span className="font-sans">{suggestion}</span>
                <span className="text-xs font-mono text-stone-400">Lookup</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Suggested Quick Words */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap text-xs text-stone-500">
        <span className="font-medium flex items-center gap-1 text-stone-400">
          <Sparkles className="w-3 h-3 text-amber-500" /> Examples:
        </span>
        {POPULAR_WORDS.map((word) => (
          <button
            key={word}
            onClick={() => handleSelectWord(word)}
            className="px-2.5 py-1 rounded-md bg-stone-200/70 hover:bg-stone-300 text-stone-700 font-sans transition-colors cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};
