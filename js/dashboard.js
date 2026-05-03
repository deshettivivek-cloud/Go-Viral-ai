// Dashboard rendering for analysis results
const Dashboard = {
  render(data) {
    this.renderScoreHero(data);
    this.renderBreakdown(data.breakdown);
    this.renderHookAnalysis(data.hookAnalysis);
    this.renderCaptionOptimizer(data.captionOptimization);
    this.renderCompetitor(data.competitorComparison);
    this.renderTrending(data.trendingRecommendations);
    
    document.getElementById('resultsSection').classList.add('active');
    setTimeout(() => {
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
      animateBreakdownBars();
    }, 300);
  },

  renderScoreHero(data) {
    const score = data.viralityScore;
    let verdictText, verdictClass;
    if (score >= 75) { verdictText = '🔥 High Viral Potential'; verdictClass = 'verdict-high'; }
    else if (score >= 50) { verdictText = '⚡ Moderate Potential'; verdictClass = 'verdict-medium'; }
    else { verdictText = '📈 Room for Improvement'; verdictClass = 'verdict-low'; }
    
    document.getElementById('scoreVerdict').textContent = verdictText;
    document.getElementById('scoreVerdict').className = 'verdict ' + verdictClass;
    document.getElementById('scoreSummary').textContent = data.summary || 'Your content has been analyzed across 6 key categories. Review the breakdown below for specific insights and actionable recommendations.';
    
    if (window.scoreGauge) window.scoreGauge.animateTo(score);
  },

  renderBreakdown(breakdown) {
    const grid = document.getElementById('breakdownGrid');
    const icons = { hookStrength: '🎣', pacing: '⏱️', visualQuality: '🎨', audioImpact: '🔊', captionEffectiveness: '✍️', trendAlignment: '📈' };
    const labels = { hookStrength: 'Hook Strength', pacing: 'Pacing', visualQuality: 'Visual Quality', audioImpact: 'Audio Impact', captionEffectiveness: 'Caption', trendAlignment: 'Trend Alignment' };
    
    grid.innerHTML = Object.entries(breakdown).map(([key, val]) => {
      const color = val.score >= 75 ? '#22C55E' : val.score >= 50 ? '#EAB308' : val.score >= 25 ? '#F97316' : '#EF4444';
      return `<div class="breakdown-card">
        <div class="breakdown-header">
          <h4>${icons[key] || '📊'} ${labels[key] || key}</h4>
          <span class="breakdown-score" style="color:${color}">${val.score}</span>
        </div>
        <div class="breakdown-bar"><div class="breakdown-bar-fill" data-score="${val.score}" style="background:${color}"></div></div>
        <div class="breakdown-feedback">${val.feedback}</div>
      </div>`;
    }).join('');
  },

  renderHookAnalysis(hook) {
    const panel = document.getElementById('hookPanel');
    if (!hook) { panel.innerHTML = '<p style="color:var(--text-dim)">No hook analysis available for this content type.</p>'; return; }
    
    panel.innerHTML = `
      <div class="hook-metrics">
        <div class="hook-metric"><span class="metric-label">First Frame Impact</span><span class="metric-value">${hook.firstFrameImpact || 'N/A'}</span></div>
        <div class="hook-metric"><span class="metric-label">Opening Text/Audio</span><span class="metric-value">${hook.openingText || 'N/A'}</span></div>
        <div class="hook-metric"><span class="metric-label">Visual Movement</span><span class="metric-value">${hook.visualMovement || 'N/A'}</span></div>
      </div>
      ${hook.suggestions && hook.suggestions.length ? `
        <div class="hook-suggestions">
          <h4>💡 Suggestions</h4>
          ${hook.suggestions.map(s => `<div class="suggestion-item"><span class="check">✓</span>${s}</div>`).join('')}
        </div>` : ''}`;
  },

  renderCaptionOptimizer(caption) {
    const panel = document.getElementById('captionPanel');
    if (!caption) { panel.innerHTML = '<p style="color:var(--text-dim)">Add a caption to get optimization suggestions.</p>'; return; }

    panel.innerHTML = `
      <div class="caption-compare">
        <div class="caption-box"><div class="caption-box-label">Original</div><div class="caption-text">${caption.original || 'No caption provided'}</div></div>
        <div class="caption-box optimized">
          <div class="caption-box-label">✨ Optimized</div>
          <div class="caption-text" id="optimizedCaption">${caption.optimized || ''}</div>
          <button class="copy-caption-btn" onclick="copyCaption()">📋 Copy Optimized Caption</button>
        </div>
        ${caption.changes && caption.changes.length ? `
          <div class="caption-changes">
            ${caption.changes.map(c => `<div class="caption-change">✓ ${c}</div>`).join('')}
          </div>` : ''}
      </div>`;
  },

  renderCompetitor(comp) {
    const panel = document.getElementById('competitorPanel');
    if (!comp) { panel.innerHTML = '<p style="color:var(--text-dim)">No competitor data available.</p>'; return; }

    panel.innerHTML = `
      <div class="competitor-list">
        ${comp.whatTheyDoBetter && comp.whatTheyDoBetter.length ? `
          <div class="competitor-section"><h4>📌 What Top Creators Do Better</h4>
            ${comp.whatTheyDoBetter.map(i => `<div class="competitor-item">→ ${i}</div>`).join('')}
          </div>` : ''}
        ${comp.yourAdvantage && comp.yourAdvantage.length ? `
          <div class="competitor-section"><h4>💪 Your Strengths</h4>
            ${comp.yourAdvantage.map(i => `<div class="competitor-item">✦ ${i}</div>`).join('')}
          </div>` : ''}
        ${comp.similarContent && comp.similarContent.length ? `
          <div class="competitor-section"><h4>🔍 Similar Viral Content</h4>
            ${comp.similarContent.map(i => `<div class="competitor-item">• ${i}</div>`).join('')}
          </div>` : ''}
      </div>`;
  },

  renderTrending(trending) {
    const panel = document.getElementById('trendingPanel');
    if (!trending) { panel.innerHTML = '<p style="color:var(--text-dim)">No trending data available.</p>'; return; }

    panel.innerHTML = `
      ${trending.hashtags && trending.hashtags.length ? `
        <div class="trending-section"><h4>#️⃣ Recommended Hashtags</h4>
          <div class="tag-cloud">${trending.hashtags.map(h => `<span class="tag">${h}</span>`).join('')}</div>
        </div>` : ''}
      ${trending.audioSuggestions && trending.audioSuggestions.length ? `
        <div class="trending-section"><h4>🎵 Trending Audio</h4>
          <div class="tag-cloud">${trending.audioSuggestions.map(a => `<span class="tag">♪ ${a}</span>`).join('')}</div>
        </div>` : ''}
      ${trending.bestPostingTime ? `
        <div class="trending-section"><h4>⏰ Best Posting Time</h4>
          <div class="trending-tip">📅 ${trending.bestPostingTime}</div>
        </div>` : ''}
      ${trending.formatTips && trending.formatTips.length ? `
        <div class="trending-section"><h4>💡 Format Tips</h4>
          ${trending.formatTips.map(t => `<div class="trending-tip">→ ${t}</div>`).join('')}
        </div>` : ''}`;
  }
};

window.Dashboard = Dashboard;
window.copyCaption = function() {
  const text = document.getElementById('optimizedCaption')?.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.copy-caption-btn');
      btn.textContent = '✅ Copied!';
      setTimeout(() => { btn.textContent = '📋 Copy Optimized Caption'; }, 2000);
    });
  }
};
