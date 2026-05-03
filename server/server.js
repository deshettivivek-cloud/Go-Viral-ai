require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/analyze', analyzeRoutes);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 GoViral AI Server running at http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('⚠️  No Gemini API key set — running in DEMO mode');
    console.log('   Set GEMINI_API_KEY in server/.env for real AI analysis\n');
  } else {
    console.log('✅ Gemini API key configured — AI analysis active\n');
  }
});
