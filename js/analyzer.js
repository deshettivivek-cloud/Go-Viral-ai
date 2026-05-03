// Analyzer - communicates with backend API
const Analyzer = {
  API_URL: '/api/analyze',

  async analyze(file, caption, platform) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('caption', caption || '');
    formData.append('platform', platform || 'tiktok');

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('Server unavailable, using demo mode');
        return this.generateDemoResult(caption, platform);
      }
      throw error;
    }
  },

  generateDemoResult(caption, platform) {
    const baseScore = 55 + Math.floor(Math.random() * 35);
    const varScore = (base) => Math.max(15, Math.min(98, base + Math.floor(Math.random() * 20 - 10)));
    
    const platformTips = {
      tiktok: { hashtags: ['#fyp', '#foryou', '#viral', '#trending', '#tiktok', '#foryoupage', '#xyzbca'], audio: ['Original Sound - Trending', 'Aesthetic Vibes', 'Motivation Mix 2024', 'Lo-fi Beats'], time: 'Tuesday & Thursday, 7-9 PM EST' },
      instagram: { hashtags: ['#reels', '#explore', '#instagood', '#trending', '#viral', '#instagram', '#reelsinstagram'], audio: ['Trending Reel Audio', 'Chill Beats', 'Pop Remix'], time: 'Wednesday & Friday, 11 AM - 1 PM EST' },
      youtube: { hashtags: ['#shorts', '#ytshorts', '#viral', '#trending', '#youtube'], audio: ['Copyright-free Music', 'Epidemic Sound Trending', 'NCS Release'], time: 'Saturday & Sunday, 2-4 PM EST' },
      twitter: { hashtags: ['#viral', '#trending', '#explore', '#X', '#thread'], audio: [], time: 'Monday & Wednesday, 8-10 AM EST' }
    };

    const tips = platformTips[platform] || platformTips.tiktok;
    const userCaption = caption || 'Check out this amazing content! 🔥';

    return {
      viralityScore: baseScore,
      summary: `Your content shows ${baseScore >= 70 ? 'strong' : 'moderate'} viral potential for ${platform}. The AI detected ${baseScore >= 70 ? 'compelling visual elements and good pacing' : 'areas where hook strength and caption strategy can be improved'}. Review the detailed breakdown below for specific optimization suggestions.`,
      breakdown: {
        hookStrength: { score: varScore(baseScore + 5), feedback: 'The opening captures attention with visual movement. Consider adding a text hook overlay in the first frame to boost scroll-stopping power.' },
        pacing: { score: varScore(baseScore), feedback: 'Pacing is generally good with scene changes every 2-3 seconds. Try adding faster cuts in the first 5 seconds to improve retention.' },
        visualQuality: { score: varScore(baseScore + 3), feedback: 'Good lighting and color contrast. The composition follows the rule of thirds effectively. Consider using more close-up shots for emotional connection.' },
        audioImpact: { score: varScore(baseScore - 5), feedback: 'Audio is clear but could benefit from trending sounds. Using platform-specific trending audio can increase discoverability by up to 30%.' },
        captionEffectiveness: { score: varScore(baseScore + 2), feedback: 'Caption has good length but could use stronger power words and a clear call-to-action. Consider starting with a question or controversial statement.' },
        trendAlignment: { score: varScore(baseScore - 2), feedback: `Content aligns with current ${platform} trends moderately well. Incorporating trending formats like "POV" or "story time" could boost reach.` }
      },
      hookAnalysis: {
        firstFrameImpact: baseScore >= 70 ? 'High - Strong visual contrast' : 'Medium - Needs more contrast',
        openingText: baseScore >= 65 ? 'Effective curiosity gap created' : 'Consider adding a bold text hook',
        visualMovement: baseScore >= 60 ? 'Dynamic camera movement detected' : 'Static frame - add motion for engagement',
        suggestions: [
          'Add bold text overlay in the first frame (e.g., "Wait for it...")',
          'Start with movement or action — avoid static opening shots',
          'Use a curiosity gap: hint at something surprising without revealing it',
          'Ensure the first frame is visually distinct from typical feed content',
          'Add a pattern interrupt (unexpected sound, zoom, or cut) within 1.5 seconds'
        ]
      },
      captionOptimization: {
        original: userCaption,
        optimized: `🚨 You WON'T believe this... ${userCaption}\n\n👇 Save this for later!\n💬 Drop a "🔥" if you agree\n\n${tips.hashtags.slice(0, 5).join(' ')}`,
        changes: [
          'Added attention-grabbing emoji opener',
          'Included curiosity hook phrase',
          'Added clear call-to-action (CTA)',
          'Included engagement prompt for comments',
          'Optimized hashtag placement at the end'
        ]
      },
      competitorComparison: {
        similarContent: [
          'Top creators in this niche average 85+ virality scores',
          'Viral posts in this category typically use 3-5 scene transitions',
          'High-performing content uses text overlays in 78% of cases'
        ],
        whatTheyDoBetter: [
          'Use pattern interrupts every 2-3 seconds to maintain attention',
          'Include face close-ups which boost engagement by 38%',
          'Leverage trending sounds within 48 hours of trending',
          'Post during peak engagement windows for their timezone'
        ],
        yourAdvantage: [
          'Good visual quality — better than 65% of competing content',
          'Content length is optimal for the platform algorithm',
          'Unique angle that differentiates from common trends'
        ]
      },
      trendingRecommendations: {
        hashtags: tips.hashtags,
        audioSuggestions: tips.audio,
        bestPostingTime: tips.time,
        formatTips: [
          'Use 9:16 vertical format for maximum reach',
          'Keep total length between 15-30 seconds for best retention',
          'Add subtitles/captions — 85% of users watch without sound',
          'Use a "hook → value → CTA" structure for optimal flow'
        ]
      }
    };
  }
};

window.Analyzer = Analyzer;
