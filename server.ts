import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getFullDictionaryEntry, fetchDatamuseSuggestions } from "./server/dictionaryService.js";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    const suggestions = await fetchDatamuseSuggestions(q);
    res.json({ suggestions });
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

  // Full dictionary lookup (meaning + collocations + examples + accreditations)
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

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dictionary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
