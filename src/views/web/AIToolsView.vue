<template>
  <div class="quiz-page-container">
    <navcomponent />

    <div class="quiz-page-wrapper">
      <div class="adventure-hero">
        <div class="hero-particles">
          <span v-for="n in 12" :key="n" class="particle" :style="particleStyle(n)"></span>
        </div>
        <div class="hero-inner">
          <div class="hero-badge">🎮 Level Up Your Trading Skills</div>
          <h1 class="hero-title">Trading Adventure</h1>
          <p class="hero-description">
            Clear levels, earn XP, and learn from Professor Byte — your AI trading mentor
          </p>
          <div class="hero-features">
            <span>🗺️ Challenge Map</span>
            <span>⭐ XP & Combos</span>
            <span>🤖 AI Mentor</span>
          </div>
        </div>
      </div>

      <TradingQuizPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import navcomponent from '../component/nav/nav.vue';
import TradingQuizPanel from './components/TradingQuizPanel.vue';

const particleStyle = (n: number) => ({
  left: `${(n * 13 + 7) % 90}%`,
  top: `${(n * 19 + 5) % 70}%`,
  animationDelay: `${n * 0.4}s`,
  fontSize: `${0.8 + (n % 3) * 0.3}rem`,
});
</script>

<style scoped>
.quiz-page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
}

.quiz-page-wrapper {
  padding-bottom: 40px;
}

.adventure-hero {
  position: relative;
  padding: 56px 40px 40px;
  margin-bottom: 32px;
  overflow: hidden;
}

.adventure-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 0%, rgba(102, 126, 234, 0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 100%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, rgba(102, 126, 234, 0.12) 0%, transparent 100%);
}

.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  opacity: 0.4;
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-12px) rotate(10deg); opacity: 0.6; }
}

.hero-inner {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 8px 18px;
  margin-bottom: 16px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: 0.3px;
}

.hero-title {
  margin: 0 0 12px;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #f0abfc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.15;
}

.hero-description {
  margin: 0 0 24px;
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-features span {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .adventure-hero {
    padding: 40px 20px 28px;
    margin-bottom: 20px;
  }

  .hero-title {
    font-size: 1.85rem;
  }

  .hero-features {
    gap: 8px;
  }

  .hero-features span {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
}
</style>
