export interface PhoneticInfo {
  text?: string;
  audio?: string;
  accent?: 'US' | 'UK' | 'AU' | 'General';
  sourceUrl?: string;
}

export interface DefinitionItem {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface MeaningGroup {
  partOfSpeech: string;
  definitions: DefinitionItem[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface CollocationItem {
  phrase: string;
  pattern: string; // e.g. "Verb + Noun", "Adj + Noun"
  example: string;
  note?: string; // e.g. "Formal register", "Often used in business"
}

export interface CollocationCategories {
  verbNoun: CollocationItem[];
  adjectiveNoun: CollocationItem[];
  prepositional: CollocationItem[];
  adverbial: CollocationItem[];
  idiomsPhrases: CollocationItem[];
}

export interface WordFamily {
  noun?: string[];
  verb?: string[];
  adjective?: string[];
  adverb?: string[];
}

export interface SynonymNuance {
  word: string;
  nuance: string;
  register?: string; // e.g. "Formal", "Academic", "Literary", "Everyday", "Informal"
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: PhoneticInfo[];
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  frequency?: 'High' | 'Medium' | 'Academic' | 'Specialized';
  origin?: string;
  meanings: MeaningGroup[];
  collocations: CollocationCategories;
  wordFamily?: WordFamily;
  usageNotes?: string[];
  synonymNuances?: SynonymNuance[];
  accreditations: {
    sources: string[];
    license?: { name: string; url: string };
    corpusStandards: string[];
  };
}

export interface SearchHistoryItem {
  word: string;
  timestamp: number;
  partOfSpeech?: string;
  cefr?: string;
}
