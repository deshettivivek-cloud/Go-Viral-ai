# 🚀 GoViral AI — Content Virality Analyzer

> Upload your video or post and let AI score its viral potential, explain what works, and suggest edits to maximize reach.

![GoViral AI](https://img.shields.io/badge/AI-Powered-F5A623?style=for-the-badge) ![Platform](https://img.shields.io/badge/Platform-Web-1C1C1F?style=for-the-badge) ![Gemini](https://img.shields.io/badge/Gemini_2.0-Flash-4285F4?style=for-the-badge)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Virality Score** | AI-generated 0–100 score with animated gauge visualization |
| 🎣 **Hook Analysis** | First 3 seconds breakdown — frame impact, opening text, visual movement |
| ✍️ **Caption Optimizer** | Side-by-side original vs AI-optimized caption with copy button |
| 🏆 **Competitor Insights** | Compare your content against viral benchmarks |
| 🔥 **Trending Recommendations** | Hashtags, trending audio, best posting times, format tips |
| 📈 **6-Category Breakdown** | Hook Strength, Pacing, Visual Quality, Audio Impact, Caption, Trend Alignment |

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS, JavaScript (no framework)
- **Backend:** Node.js, Express.js
- **AI Engine:** Google Gemini 2.0 Flash API
- **Upload:** Multer + Drag & Drop API
- **Charts:** Custom Canvas-based animated gauges
- **Design:** Premium dark theme with amber/gold accents, particle animations, glassmorphism

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/goviral-ai.git
cd goviral-ai

# 2. Install server dependencies
cd server && npm install

# 3. (Optional) Add your Gemini API key
# Edit server/.env and set GEMINI_API_KEY=your_key_here
# Get a free key at https://aistudio.google.com

# 4. Start the server
node server.js

# 5. Open in browser
# http://localhost:3000
```

> **Note:** The app runs in **demo mode** without an API key, generating realistic sample analysis results. Add a Gemini API key for real AI-powered analysis.

## 📁 Project Structure

```
├── index.html              # Main SPA
├── css/styles.css           # Design system (dark theme + animations)
├── js/
│   ├── app.js              # Main controller
│   ├── upload.js           # Drag & drop file upload
│   ├── analyzer.js         # API communication + demo mode
│   ├── dashboard.js        # Results rendering
│   ├── charts.js           # Animated gauge component
│   └── particles.js        # Hero background animation
├── server/
│   ├── server.js           # Express server
│   ├── routes/analyze.js   # Analysis API endpoint
│   ├── services/gemini.js  # Gemini AI integration
│   └── .env.example        # Environment variables template
└── ai-logs/                # AI conversation logs
```

## 🎯 How It Works

1. **Upload** — Drop a video/image or paste your caption
2. **Select Platform** — Choose TikTok, Instagram, YouTube, or Twitter/X
3. **AI Analysis** — Gemini 2.0 Flash analyzes your content across 6 categories
4. **Get Results** — Animated virality score, detailed breakdown, and actionable feedback
5. **Optimize** — Copy optimized captions, use recommended hashtags, follow format tips

## 📜 License

MIT License — feel free to use, modify, and share.

---

Built with ♥ for the **Build a Go Viral Clone** contest — Powered by [Google Gemini](https://ai.google.dev)
