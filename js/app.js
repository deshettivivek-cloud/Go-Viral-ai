// Main application controller
(function() {
  let scoreGauge;

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    scoreGauge = new ScoreGauge('scoreGauge');
    window.scoreGauge = scoreGauge;
    // Don't draw yet - canvas is hidden (display:none), will init on first animateTo()

    // Analyze button handler
    document.getElementById('analyzeBtn').addEventListener('click', startAnalysis);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (window.scrollY > 50) nav.style.borderBottomColor = 'rgba(245,166,35,0.1)';
      else nav.style.borderBottomColor = 'var(--border)';
    });
  });

  async function startAnalysis() {
    const file = window.getSelectedFile();
    const caption = window.getCaptionText();
    const platform = window.getSelectedPlatform();

    if (!file && !caption) {
      alert('Please upload a file or enter a caption to analyze.');
      return;
    }

    // Show loading
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');
    animateLoadingSteps();

    try {
      const result = await Analyzer.analyze(file, caption, platform);
      overlay.classList.remove('active');
      
      // Hide upload, show results
      document.querySelector('.hero').style.display = 'none';
      document.querySelector('.features').style.display = 'none';
      document.querySelector('.upload-section').style.display = 'none';
      
      // Small delay to let DOM update visibility before rendering canvas
      await new Promise(resolve => setTimeout(resolve, 100));
      Dashboard.render(result);
    } catch (error) {
      overlay.classList.remove('active');
      alert('Analysis failed: ' + error.message);
      console.error(error);
    }
  }

  function animateLoadingSteps() {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    const delays = [0, 1500, 3000, 4500, 6000];
    
    steps.forEach((id, i) => {
      const el = document.getElementById(id);
      el.className = 'loading-step';
      el.querySelector('.step-icon').textContent = '○';
    });

    steps.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        el.className = 'loading-step active';
        el.querySelector('.step-icon').textContent = '◉';
        
        if (i > 0) {
          const prev = document.getElementById(steps[i - 1]);
          prev.className = 'loading-step done';
          prev.querySelector('.step-icon').textContent = '✓';
        }
      }, delays[i]);
    });
  }

  // Global functions
  window.scrollToUpload = function() {
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
  };

  window.resetAnalysis = function() {
    document.querySelector('.hero').style.display = '';
    document.querySelector('.features').style.display = '';
    document.querySelector('.upload-section').style.display = '';
    document.getElementById('resultsSection').classList.remove('active');
    
    window.removeSelectedFile();
    document.getElementById('captionInput').value = '';
    document.getElementById('analyzeBtn').disabled = true;
    
    if (scoreGauge) scoreGauge.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
})();
