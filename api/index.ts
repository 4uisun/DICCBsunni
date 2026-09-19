import express from "express";
import { getFullDictionaryEntry, fetchDatamuseSuggestions } from "../server/dictionaryService.js";

const app = express();
app.use(express.json());

const FEATURED_WORDS = [
  "resilience",
  "scrutiny",
  "collaborate",
  "meticulous",
  "sustainable",
  "articulate",
  "empathy",
  "ambiguous",
  "pragmatic",
  "comprehensive"
];

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Autocomplete suggestions
app.get("/api/dictionary/suggest", async (req, res) => {
  const q = (req.query.q as string || "").trim();
  if (!q || q.length < 2) {
    return res.json({ suggestions: [] });
  }
  try {
    const suggestions = await fetchDatamuseSuggestions(q);
    res.json({ suggestions });
  } catch (err: any) {
    res.json({ suggestions: [] });
  }
});

// Word of the Day
app.get("/api/dictionary/word-of-the-day", async (_req, res) => {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FEATURED_WORDS.length;
  const word = FEATURED_WORDS[dayIndex];
  try {
    const entry = await getFullDictionaryEntry(word);
    if (entry) {
      return res.json({ entry });
    }
  } catch (e) {
    console.error("Error loading word of the day:", e);
  }
  res.json({ word });
});

// Full dictionary lookup
app.get("/api/dictionary/lookup", async (req, res) => {
  const word = (req.query.word as string || "").trim();
  if (!word) {
    return res.status(400).json({ error: "Word query parameter is required" });
  }

  try {
    const entry = await getFullDictionaryEntry(word);
    if (!entry) {
      return res.status(404).json({
        error: `No definitions or collocations found for "${word}".`,
        suggestions: await fetchDatamuseSuggestions(word)
      });
    }
    res.json({ entry });
  } catch (error: any) {
    console.error("Dictionary lookup error:", error);
    res.status(500).json({
      error: "Failed to fetch dictionary information. Please try again.",
      details: error?.message
    });
  }
});

export default app;
