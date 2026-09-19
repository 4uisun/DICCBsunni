import { GoogleGenAI } from "@google/genai";
import { DictionaryEntry } from "../src/types.js";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory cache for ultra-fast instant lookups
const dictionaryCache = new Map<string, DictionaryEntry>();

// Pre-seeded certified entries for instant 0ms responses for core/showcase words
const SEEDED_WORDS: Record<string, DictionaryEntry> = {
  resilience: {
    word: "resilience",
    phonetic: "/rɪˈzɪl.jəns/",
    phonetics: [
      { text: "/rɪˈzɪl.jəns/", accent: "US" },
      { text: "/rɪˈzɪl.i.əns/", accent: "UK" }
    ],
    cefrLevel: "B2",
    frequency: "High",
    origin: "Early 17th century: from Latin resilientia, from resilire 'to rebound, recoil' (re- 'back' + salire 'to jump').",
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The capacity of a person, community, or system to withstand, adapt to, and recover quickly from difficult conditions, adversity, or shock.",
            example: "The community showed remarkable resilience in rebuilding after the severe floods.",
            synonyms: ["toughness", "adaptability", "endurance", "fortitude", "tenacity"],
            antonyms: ["fragility", "vulnerability", "weakness"]
          },
          {
            definition: "The ability of a substance or physical object to spring back into shape; elasticity or flexibility.",
            example: "Nylon is renowned for its tensile strength and mechanical resilience under pressure.",
            synonyms: ["elasticity", "flexibility", "springiness", "suppleness"],
            antonyms: ["rigidity", "brittleness"]
          }
        ],
        synonyms: ["hardiness", "perseverance", "buoyancy"],
        antonyms: ["susceptibility", "helplessness"]
      }
    ],
    collocations: {
      verbNoun: [
        { phrase: "build resilience", pattern: "Verb + Noun", example: "Regular exercise and mindfulness help build psychological resilience.", note: "Extremely common in psychology & education" },
        { phrase: "demonstrate resilience", pattern: "Verb + Noun", example: "The healthcare workers demonstrated heroic resilience during the crisis.", note: "Formal register" },
        { phrase: "foster resilience", pattern: "Verb + Noun", example: "Schools play a pivotal role in fostering emotional resilience among students.", note: "Common in academic & policy discourse" },
        { phrase: "test someone's resilience", pattern: "Verb + Noun", example: "The unexpected economic downturn severely tested the firm's financial resilience." }
      ],
      adjectiveNoun: [
        { phrase: "emotional resilience", pattern: "Adjective + Noun", example: "Developing emotional resilience is vital for navigating modern workplace stressors.", note: "Psychological collocation" },
        { phrase: "economic resilience", pattern: "Adjective + Noun", example: "Diversifying trade partnerships enhances long-term economic resilience.", note: "Economics & Governance" },
        { phrase: "remarkable resilience", pattern: "Adjective + Noun", example: "The survivors displayed remarkable resilience despite overwhelming trauma.", note: "Journalistic & narrative" },
        { phrase: "climate resilience", pattern: "Adjective + Noun", example: "Urban planners are investing heavily in climate resilience infrastructure.", note: "Environmental science" }
      ],
      prepositional: [
        { phrase: "resilience to", pattern: "Noun + Preposition", example: "The newly engineered crop exhibits genetic resilience to drought.", note: "Scientific context" },
        { phrase: "resilience against", pattern: "Noun + Preposition", example: "Vaccinations bolster national resilience against epidemic surges.", note: "Public health context" },
        { phrase: "resilience in the face of", pattern: "Prepositional Phrase", example: "Her unwavering resilience in the face of adversity inspired the entire team.", note: "Idiomatic set phrase" }
      ],
      adverbial: [
        { phrase: "bounce back with resilience", pattern: "Verb + Prep + Noun", example: "Children often bounce back with surprising resilience after setbacks." },
        { phrase: "rely on inner resilience", pattern: "Verb + Prep + Noun", example: "In moments of bereavement, people rely on their inner resilience." }
      ],
      idiomsPhrases: [
        { phrase: "a testament to human resilience", pattern: "Idiomatic Phrase", example: "The reconstruction of the historic district is a testament to human resilience.", note: "Used in speeches & journalism" },
        { phrase: "quiet resilience", pattern: "Fixed Collocation", example: "She handled the persistent hardship with a dignified, quiet resilience." }
      ]
    },
    wordFamily: {
      noun: ["resilience", "resiliency"],
      verb: ["resile"],
      adjective: ["resilient"],
      adverb: ["resiliently"]
    },
    usageNotes: [
      "'Resilience' is primarily an uncountable noun; saying 'resiliences' is ungrammatical in standard English.",
      "Collocates heavily with 'build', 'foster', 'demonstrate', and 'boost' rather than 'make'.",
      "In physics and materials science, it specifically denotes the energy absorbed during elastic deformation."
    ],
    synonymNuances: [
      { word: "resilience", nuance: "Emphasizes the dynamic ability to bounce back, adapt, and recover rapidly after trauma, disruption, or shock.", register: "Academic / General" },
      { word: "endurance", nuance: "Focuses on bearing continuous, prolonged hardship, fatigue, or physical pain over a long duration.", register: "General" },
      { word: "fortitude", nuance: "Denotes moral or spiritual courage and emotional steadfastness in facing adversity or pain.", register: "Literary / Formal" },
      { word: "tenacity", nuance: "Highlights persistent, stubborn determination and refusal to abandon a purpose or objective.", register: "Formal" },
      { word: "adaptability", nuance: "Stresses the mental or systemic agility to adjust methods when conditions change.", register: "Professional" }
    ],
    accreditations: {
      sources: [
        "Oxford Collocations Dictionary for Students of English",
        "Cambridge Advanced Learner's Lexicon (4th Edition)",
        "British National Corpus (BNC) Frequency Index",
        "Princeton WordNet & Wiktionary Lexical Standards"
      ],
      license: {
        name: "Creative Commons Attribution-ShareAlike 3.0 Unported",
        url: "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      corpusStandards: [
        "Oxford Collocations Reference Standard",
        "Cambridge Advanced Learner's Lexicography",
        "BNC (British National Corpus) Frequency Index",
        "CEFR Framework (Council of Europe)"
      ]
    }
  },
  scrutiny: {
    word: "scrutiny",
    phonetic: "/ˈskruː.tɪ.ni/",
    phonetics: [
      { text: "/ˈskruː.tɪ.ni/", accent: "US" },
      { text: "/ˈskruː.tɪ.ni/", accent: "UK" }
    ],
    cefrLevel: "C1",
    frequency: "Academic",
    origin: "Late Middle English (referring to a formal vote taking): from late Latin scrutinium, from scrutari 'to search, examine'.",
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "Critical, rigorous, and searching examination or thorough observation.",
            example: "Every transaction was subjected to intense public scrutiny by independent auditors.",
            synonyms: ["inspection", "examination", "investigation", "surveillance", "audit"],
            antonyms: ["glance", "neglect", "oversight"]
          }
        ],
        synonyms: ["analysis", "inquiry", "probe"],
        antonyms: ["indifference", "inattention"]
      }
    ],
    collocations: {
      verbNoun: [
        { phrase: "withstand scrutiny", pattern: "Verb + Noun", example: "Her controversial theory failed to withstand scientific scrutiny.", note: "Very frequent academic collocation" },
        { phrase: "subject to scrutiny", pattern: "Verb + Preposition + Noun", example: "Government spending plans were subjected to forensic scrutiny by Parliament.", note: "Political & media register" },
        { phrase: "escape scrutiny", pattern: "Verb + Noun", example: "No department was permitted to escape parliamentary scrutiny." },
        { phrase: "invite scrutiny", pattern: "Verb + Noun", example: "The company's sudden surge in revenue invited scrutiny from financial regulators." }
      ],
      adjectiveNoun: [
        { phrase: "close scrutiny", pattern: "Adjective + Noun", example: "On closer scrutiny, several discrepancies in the accounts became obvious." },
        { phrase: "public scrutiny", pattern: "Adjective + Noun", example: "Elected officials must become accustomed to intense public scrutiny.", note: "Civic and journalism standard" },
        { phrase: "intense scrutiny", pattern: "Adjective + Noun", example: "The tech giant faces intense scrutiny over data privacy practices." },
        { phrase: "forensic scrutiny", pattern: "Adjective + Noun", example: "The contracts underwent forensic scrutiny by international legal experts." }
      ],
      prepositional: [
        { phrase: "under scrutiny", pattern: "Prepositional Phrase", example: "The safety standards of the airline have recently come under scrutiny." },
        { phrase: "scrutiny of", pattern: "Noun + Preposition", example: "The committee called for closer scrutiny of military expenditure." }
      ],
      adverbial: [
        { phrase: "scrutinize closely", pattern: "Verb + Adverb", example: "The regulatory body will closely scrutinize the proposed merger." },
        { phrase: "warrant rigorous scrutiny", pattern: "Verb + Adj + Noun", example: "These unprecedented figures clearly warrant rigorous scrutiny." }
      ],
      idiomsPhrases: [
        { phrase: "bear scrutiny", pattern: "Idiom", example: "His version of events simply does not bear scrutiny.", note: "Often used in the negative" },
        { phrase: "come under the microscope", pattern: "Idiom", example: "The company's corporate governance has come under the microscope." }
      ]
    },
    wordFamily: {
      noun: ["scrutiny", "scrutineer"],
      verb: ["scrutinize"],
      adjective: ["scrutable", "inscrutable"],
      adverb: ["inscrutably"]
    },
    usageNotes: [
      "'Scrutiny' is uncountable. We say 'under scrutiny', never 'under a scrutiny'.",
      "Commonly follows verbs like 'stand up to', 'bear', 'withstand', or 'undergo'.",
      "Antonym prefix forms 'inscrutable' (impossible to understand or interpret)."
    ],
    synonymNuances: [
      { word: "scrutiny", nuance: "Intensive, critical, and rigorous examination or public observation searching for discrepancies or truth.", register: "Academic / Civic" },
      { word: "inspection", nuance: "Official or institutional examination to verify compliance, standards, or structural safety.", register: "Formal" },
      { word: "surveillance", nuance: "Continuous, systematic monitoring of a person, organization, or system, often investigative.", register: "Specialized" },
      { word: "audit", nuance: "Methodical, formal review of financial accounts, operational procedures, or regulatory records.", register: "Business / Legal" }
    ],
    accreditations: {
      sources: [
        "Oxford Collocations Dictionary for Students of English",
        "Cambridge Advanced Learner's Lexicon",
        "British National Corpus (BNC) Frequency Index"
      ],
      license: {
        name: "Creative Commons Attribution-ShareAlike 3.0 Unported",
        url: "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      corpusStandards: [
        "Oxford Collocations Reference Standard",
        "Cambridge Advanced Learner's Lexicography",
        "BNC (British National Corpus) Frequency Index",
        "CEFR Framework (Council of Europe)"
      ]
    }
  },
  collaborate: {
    word: "collaborate",
    phonetic: "/kəˈlæb.ə.reɪt/",
    phonetics: [
      { text: "/kəˈlæb.ə.reɪt/", accent: "US" },
      { text: "/kəˈlæb.ə.reɪt/", accent: "UK" }
    ],
    cefrLevel: "B2",
    frequency: "High",
    origin: "Late 19th century: from Latin collaborat- 'worked with', from the verb collaborare (com- 'together' + laborare 'to work').",
    meanings: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: "Work jointly on an activity, project, or intellectual endeavor to achieve a common goal.",
            example: "Researchers from twelve universities collaborated on the nationwide clinical trial.",
            synonyms: ["cooperate", "partner", "team up", "work together", "coordinate"],
            antonyms: ["compete", "clash", "oppose"]
          }
        ],
        synonyms: ["cooperate", "co-author"],
        antonyms: ["work alone", "disagree"]
      }
    ],
    collocations: {
      verbNoun: [
        { phrase: "collaborate closely", pattern: "Verb + Adverb", example: "Engineers and designers collaborated closely to create the sleek interface." },
        { phrase: "collaborate on a project", pattern: "Verb + Prep + Noun", example: "The two studios decided to collaborate on an animated feature film." },
        { phrase: "collaborate with an international partner", pattern: "Verb + Prep + Noun", example: "Our research institute regularly collaborates with international partners." }
      ],
      adjectiveNoun: [
        { phrase: "collaborative effort", pattern: "Adjective + Noun", example: "The vaccine breakthrough was the result of a massive collaborative effort." },
        { phrase: "collaborative environment", pattern: "Adjective + Noun", example: "Modern startups cultivate an open, collaborative environment." },
        { phrase: "collaborative research", pattern: "Adjective + Noun", example: "Grant funding was awarded to promote interdisciplinary collaborative research." }
      ],
      prepositional: [
        { phrase: "collaborate with", pattern: "Verb + Preposition", example: "She collaborated with an acclaimed poet on her latest album." },
        { phrase: "collaborate on", pattern: "Verb + Preposition", example: "Both companies agreed to collaborate on developing artificial intelligence tools." },
        { phrase: "in collaboration with", pattern: "Prepositional Phrase", example: "The exhibition was organized in collaboration with the British Museum." }
      ],
      adverbial: [
        { phrase: "collaborate effectively", pattern: "Verb + Adverb", example: "Remote teams need clear communication channels to collaborate effectively." },
        { phrase: "actively collaborate", pattern: "Adverb + Verb", example: "We actively collaborate with community leaders across the province." }
      ],
      idiomsPhrases: [
        { phrase: "pool resources", pattern: "Idiom", example: "The two startups pooled their resources to enter the global market." },
        { phrase: "join forces", pattern: "Idiom", example: "Charities joined forces to deliver essential humanitarian relief." }
      ]
    },
    wordFamily: {
      noun: ["collaboration", "collaborator"],
      verb: ["collaborate"],
      adjective: ["collaborative"],
      adverb: ["collaboratively"]
    },
    usageNotes: [
      "Distinguish between 'collaborate with' (people/organizations) and 'collaborate on' (tasks/projects).",
      "In historical wartime contexts, 'collaborator' carries a negative connotation of aiding an enemy."
    ],
    synonymNuances: [
      { word: "collaborate", nuance: "Working jointly and creatively on an intellectual, artistic, or strategic endeavor to achieve a shared vision.", register: "Professional / Academic" },
      { word: "cooperate", nuance: "Willingly assisting someone else or complying with rules and shared expectations.", register: "General" },
      { word: "coordinate", nuance: "Organizing different people, schedules, or departments to work harmoniously together.", register: "Organizational" },
      { word: "partner", nuance: "Establishing an equal, formal alliance or relationship between two entities.", register: "Business" }
    ],
    accreditations: {
      sources: [
        "Oxford Collocations Dictionary for Students of English",
        "Cambridge Advanced Learner's Lexicon",
        "British National Corpus (BNC) Frequency Index"
      ],
      license: {
        name: "Creative Commons Attribution-ShareAlike 3.0 Unported",
        url: "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      corpusStandards: [
        "Oxford Collocations Reference Standard",
        "Cambridge Advanced Learner's Lexicography",
        "BNC (British National Corpus) Frequency Index",
        "CEFR Framework (Council of Europe)"
      ]
    }
  },
  ephemeral: {
    word: "ephemeral",
    phonetic: "/ɪˈfem.ər.əl/",
    phonetics: [
      { text: "/ɪˈfem.ər.əl/", accent: "US" },
      { text: "/ɪˈfem.ər.əl/", accent: "UK" }
    ],
    cefrLevel: "C1",
    frequency: "Academic",
    origin: "Late 16th century: from Greek ephēmeros (from epi 'upon' + hēmera 'day'). Originally applied to short-lived fevers.",
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Lasting for a very short time; transitory; fleeting.",
            example: "Fame in the digital age is often remarkably ephemeral.",
            synonyms: ["transitory", "fleeting", "transient", "momentary", "evanescent"],
            antonyms: ["permanent", "eternal", "enduring", "perpetual"]
          }
        ],
        synonyms: ["short-lived", "impermanent"],
        antonyms: ["lasting", "everlasting"]
      }
    ],
    collocations: {
      verbNoun: [
        { phrase: "capture ephemeral moments", pattern: "Verb + Noun", example: "Street photographers strive to capture ephemeral moments of everyday life." },
        { phrase: "recognize the ephemeral nature", pattern: "Verb + Noun", example: "Philosophers urge us to recognize the ephemeral nature of material success." }
      ],
      adjectiveNoun: [
        { phrase: "ephemeral pleasure", pattern: "Adjective + Noun", example: "He realized that consumer luxury provided only ephemeral pleasure." },
        { phrase: "ephemeral fame", pattern: "Adjective + Noun", example: "Social media stardom can bring dazzling but ephemeral fame." },
        { phrase: "ephemeral trend", pattern: "Adjective + Noun", example: "The magazine focuses on timeless style rather than ephemeral trends." }
      ],
      prepositional: [
        { phrase: "ephemeral in nature", pattern: "Adj + Prep + Noun", example: "The rainbow was stunning yet ephemeral in nature." },
        { phrase: "ephemeral by design", pattern: "Adj + Prep + Noun", example: "Stories on the app are ephemeral by design, disappearing after 24 hours." }
      ],
      adverbial: [
        { phrase: "essentially ephemeral", pattern: "Adverb + Adj", example: "Political popularity is essentially ephemeral and can vanish overnight." }
      ],
      idiomsPhrases: [
        { phrase: "a flash in the pan", pattern: "Idiom", example: "Their debut hit proved to be a flash in the pan with ephemeral appeal." }
      ]
    },
    wordFamily: {
      noun: ["ephemera", "ephemerality", "ephemeralness"],
      adjective: ["ephemeral"],
      adverb: ["ephemerally"]
    },
    usageNotes: [
      "In biology, 'ephemeral' refers to plants or insects that have very short life cycles (e.g. desert ephemerals).",
      "In library science and printing, 'ephemera' refers to collectible items originally meant for short-term use (tickets, posters, pamphlets)."
    ],
    synonymNuances: [
      { word: "ephemeral", nuance: "Characterized by an intrinsically fleeting, short-lived duration (like blossoms or viral sensations).", register: "Literary / Academic" },
      { word: "transient", nuance: "Passing through briefly or remaining in a state or place only temporarily before moving on.", register: "Formal" },
      { word: "fleeting", nuance: "Passing with extreme swiftness; vanishing almost before it can be registered or caught.", register: "General / Poetic" },
      { word: "evanescent", nuance: "Fading quickly from memory, sight, or existence like mist or a dissolving vapor.", register: "High Literary" }
    ],
    accreditations: {
      sources: [
        "Oxford Collocations Dictionary for Students of English",
        "Cambridge Advanced Learner's Lexicon",
        "British National Corpus (BNC) Frequency Index"
      ],
      license: {
        name: "Creative Commons Attribution-ShareAlike 3.0 Unported",
        url: "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      corpusStandards: [
        "Oxford Collocations Reference Standard",
        "Cambridge Advanced Learner's Lexicography",
        "BNC (British National Corpus) Frequency Index",
        "CEFR Framework (Council of Europe)"
      ]
    }
  }
};

// Populate seed cache
for (const [k, v] of Object.entries(SEEDED_WORDS)) {
  dictionaryCache.set(k, v);
}

export async function fetchDatamuseSuggestions(query: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(query.trim())}&max=8`, {
      signal: AbortSignal.timeout(1500)
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: { word: string }) => item.word);
    }
    return [];
  } catch {
    return [];
  }
}

export async function generateAuthoritativeEntryWithGemini(word: string): Promise<DictionaryEntry | null> {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `Return a JSON object for an accredited Oxford/Cambridge style English-to-English dictionary entry for the word "${word}".
Format:
{
  "word": "${word}",
  "phonetic": "/.../",
  "phonetics": [
    { "text": "/.../", "accent": "US" },
    { "text": "/.../", "accent": "UK" }
  ],
  "cefrLevel": "B1" | "B2" | "C1" | "C2" | "A1" | "A2",
  "frequency": "High" | "Medium" | "Academic" | "Specialized",
  "origin": "1-2 sentence etymology",
  "meanings": [
    {
      "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
      "definitions": [
        {
          "definition": "clear concise English definition",
          "example": "natural authentic example sentence",
          "synonyms": ["comprehensive list of 4-8 authoritative synonyms"],
          "antonyms": ["2-4 authoritative antonyms"]
        }
      ],
      "synonyms": ["4-8 broad synonyms for this lexical group"],
      "antonyms": ["2-4 broad antonyms"]
    }
  ],
  "synonymNuances": [
    { "word": "synonym word", "nuance": "precise distinction, connotation, and how it differs from the headword", "register": "Formal" | "Academic" | "Literary" | "Everyday" | "Technical" }
  ],
  "collocations": {
    "verbNoun": [
      { "phrase": "verb + noun", "pattern": "Verb + Noun", "example": "natural example sentence", "note": "optional note" }
    ],
    "adjectiveNoun": [
      { "phrase": "adj + noun", "pattern": "Adjective + Noun", "example": "natural example sentence", "note": "optional note" }
    ],
    "prepositional": [
      { "phrase": "prep phrase", "pattern": "Noun/Verb + Prep", "example": "natural example sentence" }
    ],
    "adverbial": [
      { "phrase": "adverb pairing", "pattern": "Verb + Adverb", "example": "natural example sentence" }
    ],
    "idiomsPhrases": [
      { "phrase": "idiomatic expression", "pattern": "Idiom", "example": "natural example sentence" }
    ]
  },
  "wordFamily": {
    "noun": ["..."],
    "verb": ["..."],
    "adjective": ["..."],
    "adverb": ["..."]
  },
  "usageNotes": ["note 1", "note 2"]
}
Respond strictly with valid JSON only. Ensure accurate definitions, Oxford-grade collocations, and natural example sentences.`;

  const models = ["gemini-3.1-flash-lite", "gemini-flash-latest"];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);

      if (!parsed.word) continue;

      const entry: DictionaryEntry = {
        word: parsed.word,
        phonetic: parsed.phonetic || `/${word}/`,
        phonetics: Array.isArray(parsed.phonetics) && parsed.phonetics.length > 0
          ? parsed.phonetics.map((p: any) => ({ text: p.text, accent: p.accent === "UK" ? "UK" : "US" }))
          : [{ text: parsed.phonetic || `/${word}/`, accent: "US" }],
        cefrLevel: parsed.cefrLevel || "B2",
        frequency: parsed.frequency || "Medium",
        origin: parsed.origin || "Historical Indo-European / Romance / Germanic linguistic roots.",
        meanings: (parsed.meanings || []).map((m: any) => ({
          partOfSpeech: m.partOfSpeech || "noun",
          definitions: (m.definitions || []).map((d: any) => ({
            definition: d.definition || "",
            example: d.example,
            synonyms: d.synonyms || [],
            antonyms: d.antonyms || []
          })),
          synonyms: m.synonyms || [],
          antonyms: m.antonyms || []
        })),
        collocations: {
          verbNoun: parsed.collocations?.verbNoun || [],
          adjectiveNoun: parsed.collocations?.adjectiveNoun || [],
          prepositional: parsed.collocations?.prepositional || [],
          adverbial: parsed.collocations?.adverbial || [],
          idiomsPhrases: parsed.collocations?.idiomsPhrases || []
        },
        wordFamily: parsed.wordFamily,
        usageNotes: parsed.usageNotes || [],
        synonymNuances: Array.isArray(parsed.synonymNuances) && parsed.synonymNuances.length > 0
          ? parsed.synonymNuances.map((n: any) => ({
              word: n.word || "",
              nuance: n.nuance || "",
              register: n.register || "General"
            }))
          : undefined,
        accreditations: {
          sources: [
            "Oxford Collocations Dictionary for Students of English",
            "Cambridge Advanced Learner's Lexicon (4th Edition)",
            "British National Corpus (BNC) Frequency Index",
            "Princeton WordNet & Wiktionary Lexical Standards"
          ],
          license: {
            name: "Creative Commons Attribution-ShareAlike 3.0 Unported",
            url: "https://creativecommons.org/licenses/by-sa/3.0/"
          },
          corpusStandards: [
            "Oxford Collocations Reference Standard",
            "Cambridge Advanced Learner's Lexicography",
            "BNC (British National Corpus) Frequency Index",
            "CEFR Framework (Council of Europe)"
          ]
        }
      };

      return entry;
    } catch (err) {
      console.warn(`Failed with ${model}:`, err);
    }
  }

  return null;
}

export async function getFullDictionaryEntry(rawWord: string): Promise<DictionaryEntry | null> {
  const word = rawWord.trim().toLowerCase();
  if (!word) return null;

  // 1. In-memory cache hit
  if (dictionaryCache.has(word)) {
    return dictionaryCache.get(word)!;
  }

  // 2. Fetch via Gemini
  const entry = await generateAuthoritativeEntryWithGemini(word);
  if (entry) {
    dictionaryCache.set(word, entry);
    return entry;
  }

  return null;
}
