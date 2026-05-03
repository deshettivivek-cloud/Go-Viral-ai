const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GeminiService = require('../services/gemini');

const router = express.Router();

// Configure multer
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// Rate limiting (simple in-memory)
const rateLimit = {};
function checkRate(ip) {
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < 60000);
  if (rateLimit[ip].length >= 10) return false;
  rateLimit[ip].push(now);
  return true;
}

router.post('/', upload.single('file'), async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRate(ip)) return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });

  try {
    const file = req.file;
    const caption = req.body.caption || '';
    const platform = req.body.platform || 'tiktok';

    if (!file && !caption) {
      return res.status(400).json({ error: 'Please provide a file or caption to analyze.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Demo mode
      return res.json(generateDemoResult(caption, platform));
    }

    const gemini = new GeminiService(apiKey);
    const fileType = file ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'text';
    const result = await gemini.analyzeContent(file?.path, fileType, caption, platform);

    // Cleanup uploaded file
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    // Cleanup on error
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
});

function generateDemoResult(caption, platform) {
  const baseScore = 55 + Math.floor(Math.random() * 35);
  const v = (b) => Math.max(15, Math.min(98, b + Math.floor(Math.random() * 20 - 10)));
  const tips = {
    tiktok: { h: ['#fyp','#foryou','#viral','#trending','#tiktok','#foryoupage','#xyzbca'], a: ['Trending Sound','Aesthetic Vibes','Lo-fi Beats'], t: 'Tue & Thu, 7-9 PM EST' },
    instagram: { h: ['#reels','#explore','#instagood','#trending','#viral','#instagram'], a: ['Reel Audio','Chill Beats','Pop Remix'], t: 'Wed & Fri, 11 AM-1 PM EST' },
    youtube: { h: ['#shorts','#ytshorts','#viral','#trending','#youtube'], a: ['NCS Release','Epidemic Sound'], t: 'Sat & Sun, 2-4 PM EST' },
    twitter: { h: ['#viral','#trending','#explore','#X'], a: [], t: 'Mon & Wed, 8-10 AM EST' }
  };
  const t = tips[platform] || tips.tiktok;
  const c = caption || 'Amazing content! 🔥';

  return {
    viralityScore: baseScore,
    summary: `Your content shows ${baseScore >= 70 ? 'strong' : 'moderate'} viral potential for ${platform}. Review the breakdown for optimization suggestions.`,
    breakdown: {
      hookStrength: { score: v(baseScore + 5), feedback: 'Opening captures attention. Add text hook overlay in first frame for more scroll-stopping power.' },
      pacing: { score: v(baseScore), feedback: 'Good pacing with scene changes. Try faster cuts in first 5 seconds.' },
      visualQuality: { score: v(baseScore + 3), feedback: 'Good lighting and contrast. Consider more close-up shots for emotional connection.' },
      audioImpact: { score: v(baseScore - 5), feedback: 'Audio is clear. Trending sounds increase discoverability by 30%.' },
      captionEffectiveness: { score: v(baseScore + 2), feedback: 'Needs stronger power words and clear CTA. Start with a question.' },
      trendAlignment: { score: v(baseScore - 2), feedback: `Moderate trend alignment. Incorporate trending ${platform} formats to boost reach.` }
    },
    hookAnalysis: { firstFrameImpact: baseScore >= 70 ? 'High' : 'Medium', openingText: 'Consider adding bold text hook', visualMovement: baseScore >= 60 ? 'Dynamic' : 'Static - add motion', suggestions: ['Add bold text in first frame','Start with movement','Use curiosity gap','Make first frame visually distinct','Add pattern interrupt within 1.5s'] },
    captionOptimization: { original: c, optimized: `🚨 You WON'T believe this... ${c}\n\n👇 Save this!\n💬 Drop "🔥" if you agree\n\n${t.h.slice(0,5).join(' ')}`, changes: ['Added emoji opener','Included curiosity hook','Added CTA','Optimized hashtags'] },
    competitorComparison: { similarContent: ['Top creators average 85+ scores','Viral posts use 3-5 transitions','78% use text overlays'], whatTheyDoBetter: ['Pattern interrupts every 2-3s','Face close-ups boost engagement 38%','Leverage trending sounds within 48h'], yourAdvantage: ['Good visual quality','Optimal content length','Unique angle'] },
    trendingRecommendations: { hashtags: t.h, audioSuggestions: t.a, bestPostingTime: t.t, formatTips: ['Use 9:16 vertical','Keep 15-30 seconds','Add subtitles','Use hook → value → CTA structure'] }
  };
}

module.exports = router;
