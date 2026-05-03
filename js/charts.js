// Canvas-based animated gauge chart
class ScoreGauge {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.currentScore = 0;
    this.targetScore = 0;
    this.animating = false;
    this.setupHiDPI();
  }

  setupHiDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.w = rect.width;
    this.h = rect.height;
  }

  getColor(score) {
    if (score >= 75) return '#22C55E';
    if (score >= 50) return '#EAB308';
    if (score >= 25) return '#F97316';
    return '#EF4444';
  }

  getGradient(score) {
    const cx = this.w / 2, cy = this.h / 2, r = Math.min(cx, cy) - 15;
    const grad = this.ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    if (score >= 75) {
      grad.addColorStop(0, '#22C55E');
      grad.addColorStop(1, '#16A34A');
    } else if (score >= 50) {
      grad.addColorStop(0, '#F5A623');
      grad.addColorStop(1, '#EAB308');
    } else if (score >= 25) {
      grad.addColorStop(0, '#F97316');
      grad.addColorStop(1, '#FF6B35');
    } else {
      grad.addColorStop(0, '#EF4444');
      grad.addColorStop(1, '#DC2626');
    }
    return grad;
  }

  draw(score) {
    const ctx = this.ctx;
    const cx = this.w / 2, cy = this.h / 2;
    const r = Math.min(cx, cy) - 15;
    const lineWidth = 10;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalAngle = endAngle - startAngle;
    const scoreAngle = startAngle + (score / 100) * totalAngle;

    ctx.clearRect(0, 0, this.w, this.h);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#2A2A2E';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score arc
    if (score > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, scoreAngle);
      ctx.strokeStyle = this.getGradient(score);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow effect
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, scoreAngle);
      ctx.strokeStyle = this.getColor(score);
      ctx.lineWidth = lineWidth + 6;
      ctx.globalAlpha = 0.15;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * totalAngle;
      const inner = r - lineWidth / 2 - 8;
      const outer = r - lineWidth / 2 - 3;
      ctx.beginPath();
      ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
      ctx.lineTo(cx + outer * Math.cos(angle), cy + outer * Math.sin(angle));
      ctx.strokeStyle = i * 10 <= score ? this.getColor(score) : '#3A3A3E';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  animateTo(target) {
    this.targetScore = target;
    if (this.animating) return;
    this.animating = true;
    const start = this.currentScore;
    const duration = 2000;
    const startTime = performance.now();
    const scoreEl = document.getElementById('scoreValue');

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      this.currentScore = start + (this.targetScore - start) * eased;
      this.draw(this.currentScore);
      if (scoreEl) scoreEl.textContent = Math.round(this.currentScore);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.animating = false;
      }
    };
    requestAnimationFrame(step);
  }

  reset() {
    this.currentScore = 0;
    this.targetScore = 0;
    this.draw(0);
    const scoreEl = document.getElementById('scoreValue');
    if (scoreEl) scoreEl.textContent = '0';
  }
}

// Mini bar chart for breakdown
function animateBreakdownBars() {
  document.querySelectorAll('.breakdown-bar-fill').forEach(bar => {
    const target = bar.dataset.score;
    setTimeout(() => { bar.style.width = target + '%'; }, 200);
  });
}

window.ScoreGauge = ScoreGauge;
window.animateBreakdownBars = animateBreakdownBars;
