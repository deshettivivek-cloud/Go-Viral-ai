const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeContent(filePath, fileType, caption, platform) {
    const prompt = this.buildPrompt(caption, platform, fileType);
    let parts = [{ text: prompt }];

    if (filePath && fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      const base64 = fileData.toString('base64');
      const mimeType = this.getMimeType(filePath);
      parts.push({ inlineData: { mimeType, data: base64 } });
    }

    const result = await this.model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse AI response');

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm' };
    return types[ext] || 'application/octet-stream';
  }

  buildPrompt(caption, platform, fileType) {
    return `You are an expert social media content analyst specializing in viral content on ${platform}. 
Analyze the provided ${fileType || 'content'} and caption, then return a detailed virality analysis.

${caption ? `Caption/Post text: "${caption}"` : 'No caption provided.'}
Platform: ${platform}

Return ONLY valid JSON in this exact structure (no markdown, no explanation):
\`\`\`json
{
  "viralityScore": <number 0-100>,
  "summary": "<2-3 sentence summary of overall viral potential>",
  "breakdown": {
    "hookStrength": { "score": <0-100>, "feedback": "<specific feedback about the hook/opening>" },
    "pacing": { "score": <0-100>, "feedback": "<feedback about pacing and rhythm>" },
    "visualQuality": { "score": <0-100>, "feedback": "<feedback about visual elements>" },
    "audioImpact": { "score": <0-100>, "feedback": "<feedback about audio/sound strategy>" },
    "captionEffectiveness": { "score": <0-100>, "feedback": "<feedback about caption quality>" },
    "trendAlignment": { "score": <0-100>, "feedback": "<how well it aligns with current ${platform} trends>" }
  },
  "hookAnalysis": {
    "firstFrameImpact": "<High/Medium/Low with brief explanation>",
    "openingText": "<analysis of opening text/hook>",
    "visualMovement": "<analysis of visual dynamics>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"]
  },
  "captionOptimization": {
    "original": "${caption || 'No caption provided'}",
    "optimized": "<fully rewritten optimized caption with emojis, hooks, CTA, and hashtags>",
    "changes": ["<change 1>", "<change 2>", "<change 3>", "<change 4>"]
  },
  "competitorComparison": {
    "similarContent": ["<viral content comparison 1>", "<comparison 2>", "<comparison 3>"],
    "whatTheyDoBetter": ["<insight 1>", "<insight 2>", "<insight 3>"],
    "yourAdvantage": ["<strength 1>", "<strength 2>", "<strength 3>"]
  },
  "trendingRecommendations": {
    "hashtags": ["<hashtag1>", "<hashtag2>", "<hashtag3>", "<hashtag4>", "<hashtag5>", "<hashtag6>", "<hashtag7>"],
    "audioSuggestions": ["<trending audio 1>", "<trending audio 2>", "<trending audio 3>"],
    "bestPostingTime": "<optimal posting day and time>",
    "formatTips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"]
  }
}
\`\`\`

Be specific, actionable, and data-driven in all feedback. Reference real ${platform} trends and best practices.`;
  }
}

module.exports = GeminiService;
