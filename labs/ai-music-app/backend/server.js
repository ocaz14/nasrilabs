import express from "express";
import fetch from "node-fetch";
import OpenAI from "openai";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎯 Prompt Generator
async function generatePrompt(mood) {
  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional music producer AI"
      },
      {
        role: "user",
        content: `Create a detailed music generation prompt for this mood: ${mood}. Include genre, instruments, tempo, atmosphere. No explanation.`
      }
    ]
  });

  return res.choices[0].message.content;
}

// 🎤 Lyrics Generator (optional)
async function generateLyrics(mood) {
  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: `Write short song lyrics (verse + chorus) for mood: ${mood}`
      }
    ]
  });

  return res.choices[0].message.content;
}

// 🎧 Main Route
app.post("/generate", async (req, res) => {
  const { mood } = req.body;

  try {
    // 1. Generate prompt
    let prompt;

    try {
      prompt = await generatePrompt(mood);
    } catch (err) {
      console.log("⚠️ OpenAI failed, using fallback");

      prompt = `High quality ${mood} music, immersive, cinematic, no vocals`;
    }

    // 2. Optional lyrics
    const lyrics = await generateLyrics(mood);

    // 3. Call Music API (pseudo)
    const musicRes = await fetch("https://api.suno.ai/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_SUNO_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        lyrics
      })
    });

    const data = await musicRes.json();

    res.json({
      audioUrl: data.audio_url,
      prompt,
      lyrics
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate music" });
  }
});

app.listen(3000, () => {
  console.log("🔥 Smart AI Music Backend running on port 3000");
});