import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar.js";
import { SearchBar } from "./components/SearchBar.js";
import { WordHeader } from "./components/WordHeader.js";
import { MeaningsSection } from "./components/MeaningsSection.js";
import { CollocationsSection } from "./components/CollocationsSection.js";
import { ExamplesSection } from "./components/ExamplesSection.js";
import { WordFamilyAndNotes } from "./components/WordFamilyAndNotes.js";
import { SavedWordsModal } from "./components/SavedWordsModal.js";
import { HistoryModal } from "./components/HistoryModal.js";
import { DictionaryEntry, SearchHistoryItem } from "./types.js";
import { 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Quote, 
  GitFork, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function App() {
  const [currentWord, setCurrentWord] = useState<string>("resilience");
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Section Navigation Tab (All in one view vs focused view)
  const [viewTab, setViewTab] = useState<"all" | "definitions" | "collocations" | "examples" | "family">("all");

  // LocalStorage for saved words & search history
  const [savedWords, setSavedWords] = useState<Array<{ word: string; cefrLevel?: string; primaryDefinition?: string; savedAt: number }>>(() => {
    try {
      const stored = localStorage.getItem("dict_saved_words");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem("dict_search_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Sync savedWords to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dict_saved_words", JSON.stringify(savedWords));
    } catch (e) {
      console.error(e);
    }
  }, [savedWords]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dict_search_history", JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Lookup function
  const lookupWord = useCallback(async (wordToSearch: string) => {
    const term = wordToSearch.trim().toLowerCase();
    if (!term) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(term)}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || `Could not find definition for "${term}".`);
        if (Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        }
        setEntry(null);
      } else if (data.entry) {
        setEntry(data.entry);
        setCurrentWord(data.entry.word);

        // Update search history
        setHistory(prev => {
          const filtered = prev.filter(h => h.word.toLowerCase() !== term);
          return [
            {
              word: data.entry.word,
              timestamp: Date.now(),
              cefr: data.entry.cefrLevel,
              partOfSpeech: data.entry.meanings[0]?.partOfSpeech
            },
            ...filtered.slice(0, 29)
          ];
        });
      }
    } catch (err: any) {
      setErrorMessage("Network error while communicating with dictionary server. Please try again.");
      setEntry(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load lookup
  useEffect(() => {
    lookupWord("resilience");
  }, [lookupWord]);

  // Toggle Save Word
  const handleToggleSave = () => {
    if (!entry) return;
    const exists = savedWords.some(w => w.word.toLowerCase() === entry.word.toLowerCase());
    if (exists) {
      setSavedWords(prev => prev.filter(w => w.word.toLowerCase() !== entry.word.toLowerCase()));
    } else {
      const primaryDef = entry.meanings[0]?.definitions[0]?.definition;
      setSavedWords(prev => [
        {
          word: entry.word,
          cefrLevel: entry.cefrLevel,
          primaryDefinition: primaryDef,
          savedAt: Date.now()
        },
        ...prev
      ]);
    }
  };

  const handleWordOfTheDay = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dictionary/word-of-the-day");
      const data = await res.json();
      if (data.entry) {
        setEntry(data.entry);
        setCurrentWord(data.entry.word);
      } else if (data.word) {
        lookupWord(data.word);
      }
    } catch {
      lookupWord("scrutiny");
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentWordSaved = entry 
    ? savedWords.some(w => w.word.toLowerCase() === entry.word.toLowerCase())
    : false;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Navigation */}
      <Navbar
        onWordSelect={(w) => lookupWord(w)}
        savedCount={savedWords.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onWordOfTheDay={handleWordOfTheDay}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Prominent Search Header */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 hidden md:block">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              English-to-English Collocation Dictionary
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Definitions • Native Collocations • Contextual Sentences • BNC & Oxford Certified Lexicon
            </p>
          </div>

          <SearchBar
            onSearch={(w) => lookupWord(w)}
            isLoading={isLoading}
            currentWord={currentWord}
          />
        </section>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700 mx-auto" />
            <p className="font-serif text-lg font-semibold text-stone-800">
              Retrieving certified dictionary data & collocations...
            </p>
            <p className="text-xs text-stone-400 font-sans">
              Verifying Wiktionary lexical senses and Oxford/BNC collocation patterns
            </p>
          </div>
        )}

        {/* Error / Not Found Message with Suggestions */}
        {!isLoading && errorMessage && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm space-y-4">
            <div className="flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <h3 className="font-serif text-lg font-bold">Word Not Found</h3>
                <p className="text-sm text-rose-700 font-sans mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="pt-3 border-t border-rose-100">
                <span className="text-xs font-semibold uppercase font-mono text-stone-500 block mb-2">
                  Did you mean one of these words?
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => lookupWord(sug)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{sug}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dictionary Results Container */}
        {!isLoading && entry && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Word Header Card */}
            <WordHeader
              entry={entry}
              isSaved={isCurrentWordSaved}
              onToggleSave={handleToggleSave}
            />

            {/* View Filter Pill Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200/80">
              <button
                onClick={() => setViewTab("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewTab === "all"
                    ? "bg-stone-900 text-stone-100 shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <span>Full Overview</span>
              </button>

              <button
                onClick={() => setViewTab("definitions")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewTab === "definitions"
                    ? "bg-stone-900 text-stone-100 shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Definitions ({entry.meanings.reduce((a, b) => a + b.definitions.length, 0)})</span>
              </button>

              <button
                onClick={() => setViewTab("collocations")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewTab === "collocations"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Collocations</span>
              </button>

              <button
                onClick={() => setViewTab("examples")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewTab === "examples"
                    ? "bg-stone-900 text-stone-100 shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Example Sentences</span>
              </button>

              <button
                onClick={() => setViewTab("family")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewTab === "family"
                    ? "bg-stone-900 text-stone-100 shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Word Family & Accreditation</span>
              </button>
            </div>

            {/* Tabbed View Rendering */}
            {(viewTab === "all" || viewTab === "definitions") && (
              <MeaningsSection
                meanings={entry.meanings}
                onWordClick={(w) => lookupWord(w)}
              />
            )}

            {(viewTab === "all" || viewTab === "collocations") && (
              <CollocationsSection
                collocations={entry.collocations}
                word={entry.word}
              />
            )}

            {(viewTab === "all" || viewTab === "examples") && (
              <ExamplesSection entry={entry} />
            )}

            {(viewTab === "all" || viewTab === "family") && (
              <WordFamilyAndNotes
                wordFamily={entry.wordFamily}
                usageNotes={entry.usageNotes}
                accreditations={entry.accreditations}
                onWordClick={(w) => lookupWord(w)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold text-stone-200">English Collocation Dictionary</span>
            <span className="text-stone-600">•</span>
            <span>Accredited English-to-English Lexicon</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Wiktionary CC BY-SA</span>
            <span>•</span>
            <span>BNC Corpus Standard</span>
            <span>•</span>
            <span>Oxford & Cambridge Collocation Models</span>
          </div>
        </div>
      </footer>

      {/* Saved Words Modal */}
      <SavedWordsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedWords={savedWords}
        onSelectWord={(w) => lookupWord(w)}
        onRemoveWord={(w) => setSavedWords(prev => prev.filter(x => x.word.toLowerCase() !== w.toLowerCase()))}
        onClearAll={() => setSavedWords([])}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectWord={(w) => lookupWord(w)}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
