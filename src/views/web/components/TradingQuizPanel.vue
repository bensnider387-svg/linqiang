<template>
  <div class="adventure-arena">
    <div class="arena-bg">
      <span v-for="n in 20" :key="n" class="star" :style="starStyle(n)"></span>
    </div>

    <div v-if="isLoading" class="state-card loading-card">
      <QuizRobotTeacher message="Loading your challenge map..." mood="thinking" :is-speaking="true" />
      <div class="loading-bar"><div class="loading-bar-fill"></div></div>
      <p>Preparing levels...</p>
    </div>

    <div v-else-if="quizQuestions.length === 0" class="state-card empty-card">
      <QuizRobotTeacher message="No levels available yet. Ask your admin to add questions!" mood="sad" />
      <button class="adventure-btn" @click="fetchQuizQuestions">Try Again</button>
    </div>

    <div v-else-if="!gameStarted && !quizCompleted" class="state-card start-card">
      <QuizRobotTeacher :message="robotMessage" :mood="robotMood" :is-speaking="true" />
      <div class="start-preview">
        <h2>Trading Adventure</h2>
        <p>{{ quizQuestions.length }} levels · Earn XP · Clear them all!</p>
        <div class="start-stats">
          <div class="start-stat"><span>🗺️</span><strong>{{ quizQuestions.length }}</strong><small>Levels</small></div>
          <div class="start-stat"><span>⭐</span><strong>60%</strong><small>Pass Rate</small></div>
          <div class="start-stat"><span>🏆</span><strong>XP</strong><small>Rewards</small></div>
        </div>
      </div>
      <button class="adventure-btn pulse" @click="startAdventure">
        Start Challenge
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </button>
    </div>

    <div v-else class="adventure-layout">
      <aside class="teacher-sidebar">
        <QuizRobotTeacher :message="robotMessage" :mood="robotMood" :is-speaking="robotSpeaking" />
        <div class="player-panel">
          <div class="panel-title">Your Progress</div>
          <div class="xp-row">
            <span class="xp-label">XP</span>
            <span class="xp-value">{{ totalXp }}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: xpPercent + '%' }"></div>
          </div>
          <div class="combo-row" v-if="streak > 1">
            <span class="combo-badge">🔥 {{ streak }} Combo!</span>
          </div>
          <div class="score-row">
            <div><strong>{{ score }}</strong><small>Correct</small></div>
            <div><strong>{{ accuracyPercent }}%</strong><small>Accuracy</small></div>
          </div>
        </div>
      </aside>

      <main class="challenge-main">
        <div v-if="quizCompleted" class="victory-gate">
          <div class="victory-rays"></div>
          <QuizRobotTeacher :message="robotMessage" mood="celebrate" :is-speaking="true" />
          <div class="victory-banner">
            <span class="victory-tag">ALL LEVELS CLEARED</span>
            <h2>Challenge Complete!</h2>
            <p class="victory-rank">{{ getPerformanceRating() }} Trader</p>
          </div>
          <div class="victory-stats">
            <div class="v-stat">
              <span class="v-num">{{ score }}/{{ quizQuestions.length }}</span>
              <span class="v-lbl">Levels Passed</span>
            </div>
            <div class="v-stat">
              <span class="v-num">{{ Math.round((score / quizQuestions.length) * 100) }}%</span>
              <span class="v-lbl">Accuracy</span>
            </div>
            <div class="v-stat">
              <span class="v-num">{{ totalXp }}</span>
              <span class="v-lbl">Total XP</span>
            </div>
          </div>
          <div class="victory-stars">
            <span v-for="n in 3" :key="n" class="star-icon" :class="{ earned: n <= earnedStars }">★</span>
          </div>
          <button class="adventure-btn" @click="restartQuiz">Play Again</button>
        </div>

        <template v-else>
          <div class="level-map">
            <div class="map-header">
              <span class="map-title">Challenge Map</span>
              <span class="map-progress">Level {{ currentQuestionIndex + 1 }} / {{ quizQuestions.length }}</span>
            </div>
            <div class="map-track">
              <div class="map-line">
                <div class="map-line-fill" :style="{ width: mapProgress + '%' }"></div>
              </div>
              <div
                v-for="(_, idx) in quizQuestions"
                :key="idx"
                class="map-node"
                :class="{
                  done: idx < currentQuestionIndex || (idx === currentQuestionIndex && showResult && isAnswerCorrect),
                  active: idx === currentQuestionIndex && !showResult,
                  current: idx === currentQuestionIndex,
                  failed: answersHistory[idx] === false
                }"
                :style="{ left: nodePosition(idx) + '%' }"
              >
                <span class="node-inner">{{ idx + 1 }}</span>
              </div>
            </div>
          </div>

          <div class="level-gate" :class="{ 'gate-clear': showResult && isAnswerCorrect, 'gate-fail': showResult && !isAnswerCorrect }">
            <div class="gate-header">
              <div class="level-badge">
                <span class="level-num">LV.{{ currentQuestionIndex + 1 }}</span>
                <span class="level-theme">{{ currentLevelTheme.name }}</span>
              </div>
              <div class="level-reward">+{{ levelXp }} XP</div>
            </div>

            <div class="question-scroll">
              <h3 class="question-text">{{ displayQuestion }}</h3>
            </div>

            <div class="portal-list">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="portal-option"
                :class="{
                  selected: selectedAnswer === index,
                  correct: showResult && index === currentQuestion.correctAnswer,
                  wrong: showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer,
                  locked: showResult
                }"
                :disabled="showResult"
                @click="handleSelectAnswer(index)"
              >
                <span class="portal-glow"></span>
                <span class="portal-letter">{{ String.fromCharCode(65 + index) }}</span>
                <span class="portal-text">{{ option }}</span>
                <span v-if="showResult && index === currentQuestion.correctAnswer" class="portal-icon">✓</span>
                <span v-else-if="showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer" class="portal-icon fail">✗</span>
              </button>
            </div>

            <div v-if="showResult" class="gate-action">
              <button class="adventure-btn" @click="goToNextQuestion">
                {{ currentQuestionIndex < quizQuestions.length - 1 ? 'Next Level →' : 'View Results 🏆' }}
              </button>
            </div>
          </div>
        </template>
      </main>
    </div>

    <Transition name="level-flash">
      <div v-if="levelTransition" class="level-transition-overlay">
        <div class="transition-content">
          <span class="transition-icon">⚡</span>
          <h3>Level {{ currentQuestionIndex }} Cleared!</h3>
          <p>+{{ levelXp }} XP earned</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { get_random_questions, startquestions } from '@/api/module/web/vip';
import QuizRobotTeacher from './QuizRobotTeacher.vue';

const LEVEL_THEMES = [
  { name: 'Market Basics', icon: '📈' },
  { name: 'Chart Reading', icon: '📊' },
  { name: 'Risk Control', icon: '🛡️' },
  { name: 'Fundamentals', icon: '📋' },
  { name: 'Strategy', icon: '🎯' },
  { name: 'Portfolio', icon: '💼' },
  { name: 'Technical', icon: '⚡' },
  { name: 'Macro View', icon: '🌍' },
  { name: 'Trading Psyche', icon: '🧠' },
  { name: 'Final Boss', icon: '👑' },
];

const quizQuestions = ref<any[]>([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const showResult = ref(false);
const isAnswerCorrect = ref(false);
const quizCompleted = ref(false);
const gameStarted = ref(false);
const score = ref(0);
const streak = ref(0);
const totalXp = ref(0);
const isLoading = ref(false);
const answersHistory = ref<(boolean | undefined)[]>([]);
const startQuestion = ref(false);
const robotMessage = ref('Welcome, trader! Ready to clear all levels?');
const robotMood = ref<'idle' | 'happy' | 'sad' | 'thinking' | 'celebrate'>('idle');
const robotSpeaking = ref(false);
const levelTransition = ref(false);

const currentQuestion = computed(() => quizQuestions.value[currentQuestionIndex.value]);

const stripQuestionNumber = (text: string) => {
  if (!text) return '';
  return text.replace(/^\d+[\.\、\)）:：]\s*/, '').trim();
};

const displayQuestion = computed(() =>
  stripQuestionNumber(currentQuestion.value?.question || '')
);

const currentLevelTheme = computed(() =>
  LEVEL_THEMES[currentQuestionIndex.value % LEVEL_THEMES.length]
);

const levelXp = computed(() => 10 + currentQuestionIndex.value * 2 + (streak.value > 1 ? streak.value * 2 : 0));

const mapProgress = computed(() => {
  if (!quizQuestions.value.length) return 0;
  return ((currentQuestionIndex.value + (showResult.value ? 1 : 0)) / quizQuestions.value.length) * 100;
});

const xpPercent = computed(() => {
  const maxXp = quizQuestions.value.length * 20;
  return maxXp ? Math.min(100, (totalXp.value / maxXp) * 100) : 0;
});

const accuracyPercent = computed(() => {
  const answered = currentQuestionIndex.value + (showResult.value ? 1 : 0);
  if (!answered) return 0;
  return Math.round((score.value / answered) * 100);
});

const earnedStars = computed(() => {
  const pct = score.value / quizQuestions.value.length;
  if (pct >= 1) return 3;
  if (pct >= 0.8) return 2;
  if (pct >= 0.6) return 1;
  return 0;
});

const nodePosition = (idx: number) => {
  const total = quizQuestions.value.length;
  if (total <= 1) return 50;
  return (idx / (total - 1)) * 100;
};

const starStyle = (n: number) => ({
  left: `${(n * 17 + 5) % 95}%`,
  top: `${(n * 23 + 10) % 80}%`,
  animationDelay: `${n * 0.3}s`,
  opacity: 0.3 + (n % 5) * 0.1,
});

const setRobot = (message: string, mood: typeof robotMood.value, speaking = true) => {
  robotMessage.value = message;
  robotMood.value = mood;
  robotSpeaking.value = speaking;
};

const fetchQuizQuestions = async () => {
  try {
    startQuestion.value = false;
    isLoading.value = true;
    setRobot('Loading your challenge map...', 'thinking');
    const response = await get_random_questions();
    if (response.success && response.data?.length > 0) {
      quizQuestions.value = response.data;
      setRobot(`I've prepared ${response.data.length} levels for you. Tap Start when ready!`, 'idle');
    } else {
      quizQuestions.value = [];
      setRobot('No levels available yet. Please try again later.', 'sad');
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    quizQuestions.value = [];
    setRobot('Something went wrong. Let me try again...', 'sad');
  } finally {
    isLoading.value = false;
  }
};

const startAdventure = () => {
  gameStarted.value = true;
  setRobot(`Level 1: ${LEVEL_THEMES[0].name}! Read carefully and pick the best answer.`, 'idle');
};

const handleSelectAnswer = (index: number) => {
  if (selectedAnswer.value !== null || showResult.value) return;

  selectedAnswer.value = index;
  isAnswerCorrect.value = index === currentQuestion.value.correctAnswer;
  answersHistory.value[currentQuestionIndex.value] = isAnswerCorrect.value;

  if (isAnswerCorrect.value) {
    score.value++;
    streak.value++;
    totalXp.value += levelXp.value;
    const msgs = [
      'Excellent! Level cleared! +XP',
      'Perfect answer! You\'re on fire!',
      'Well done! Keep this streak going!',
      'That\'s right! Moving up the ranks!',
    ];
    setRobot(msgs[Math.floor(Math.random() * msgs.length)], streak.value >= 3 ? 'celebrate' : 'happy');
  } else {
    streak.value = 0;
    const msgs = [
      'Not quite! Review the concept and keep going.',
      'Close one! Every mistake is a lesson.',
      'Don\'t worry — even pros miss sometimes.',
      'Study this topic, you\'ll nail it next time!',
    ];
    setRobot(msgs[Math.floor(Math.random() * msgs.length)], 'sad');
  }

  if (!startQuestion.value) {
    startquestions({ stype: 'start' }).then(() => {});
  }
  startQuestion.value = true;

  if (currentQuestionIndex.value === quizQuestions.value.length - 1) {
    if (score.value / quizQuestions.value.length >= 0.6) {
      startquestions({ stype: 'end' }).then(() => {});
    }
  }

  setTimeout(() => {
    showResult.value = true;
  }, 400);
};

const getPerformanceRating = () => {
  const percentage = (score.value / quizQuestions.value.length) * 100;
  if (percentage === 100) return 'Master';
  if (percentage >= 80) return 'Expert';
  if (percentage >= 60) return 'Advanced';
  if (percentage >= 40) return 'Intermediate';
  return 'Beginner';
};

const getVictoryMessage = () => {
  const pct = score.value / quizQuestions.value.length;
  if (pct === 1) return 'Flawless victory! You\'re a true market master!';
  if (pct >= 0.8) return 'Outstanding! You crushed this challenge!';
  if (pct >= 0.6) return 'Well done! You passed the adventure!';
  return 'Good effort! Practice more to level up faster!';
};

const goToNextQuestion = async () => {
  const wasCorrect = isAnswerCorrect.value;
  const isLast = currentQuestionIndex.value >= quizQuestions.value.length - 1;

  if (wasCorrect && !isLast) {
    levelTransition.value = true;
    await new Promise(r => setTimeout(r, 1200));
    levelTransition.value = false;
  }

  showResult.value = false;
  selectedAnswer.value = null;
  currentQuestionIndex.value++;

  if (currentQuestionIndex.value >= quizQuestions.value.length) {
    quizCompleted.value = true;
    setRobot(getVictoryMessage(), 'celebrate');
  } else {
    const theme = LEVEL_THEMES[currentQuestionIndex.value % LEVEL_THEMES.length];
    setRobot(`Level ${currentQuestionIndex.value + 1}: ${theme.name}! Let's go!`, 'idle');
  }
};

const restartQuiz = () => {
  startQuestion.value = false;
  gameStarted.value = false;
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showResult.value = false;
  isAnswerCorrect.value = false;
  quizCompleted.value = false;
  score.value = 0;
  streak.value = 0;
  totalXp.value = 0;
  answersHistory.value = [];
  levelTransition.value = false;
  fetchQuizQuestions();
};

onMounted(() => {
  fetchQuizQuestions();
});
</script>

<style scoped>
.adventure-arena {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 80px;
  min-height: 500px;
}

.arena-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.5); }
}

.state-card,
.adventure-layout {
  position: relative;
  z-index: 1;
}

.state-card {
  max-width: 480px;
  margin: 0 auto;
  padding: 40px 32px;
  text-align: center;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
}

.state-card p {
  color: var(--text-muted);
  margin: 16px 0 0;
}

.loading-bar {
  width: 200px;
  height: 6px;
  margin: 24px auto 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  width: 40%;
  background: var(--primary-gradient);
  border-radius: 3px;
  animation: loadSlide 1.2s ease-in-out infinite;
}

@keyframes loadSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.start-preview h2 {
  margin: 24px 0 8px;
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.start-preview p {
  margin: 0;
  color: var(--text-muted);
}

.start-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 28px 0;
}

.start-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  min-width: 80px;
}

.start-stat span { font-size: 1.4rem; }
.start-stat strong { font-size: 1.1rem; color: var(--text-primary); }
.start-stat small { font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; }

.adventure-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  border: none;
  border-radius: 14px;
  background: var(--primary-gradient);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.45);
}

.adventure-btn svg {
  width: 18px;
  height: 18px;
}

.adventure-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.55);
}

.adventure-btn.pulse {
  animation: btnPulse 2s ease-in-out infinite;
}

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.45); }
  50% { box-shadow: 0 4px 32px rgba(102, 126, 234, 0.7); }
}

.adventure-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
  align-items: start;
}

.teacher-sidebar {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.player-panel {
  padding: 18px;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.panel-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.xp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.xp-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f59e0b;
}

.xp-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #f59e0b;
}

.xp-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.combo-row {
  margin-bottom: 12px;
}

.combo-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #f87171;
  animation: comboPop 0.4s ease;
}

@keyframes comboPop {
  from { transform: scale(0.8); }
  to { transform: scale(1); }
}

.score-row {
  display: flex;
  gap: 12px;
}

.score-row > div {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

.score-row strong {
  display: block;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.score-row small {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.challenge-main {
  min-width: 0;
}

.level-map {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 18px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.map-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.map-progress {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
}

.map-track {
  position: relative;
  height: 48px;
}

.map-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  transform: translateY(-50%);
}

.map-line-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #10b981);
  border-radius: 2px;
  transition: width 0.6s ease;
}

.map-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.node-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.15);
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.map-node.done .node-inner {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #10b981;
}

.map-node.failed .node-inner {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #ef4444;
}

.map-node.active .node-inner,
.map-node.current .node-inner {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
  box-shadow: 0 0 16px rgba(102, 126, 234, 0.6);
  animation: nodePulse 1.5s ease-in-out infinite;
}

@keyframes nodePulse {
  0%, 100% { box-shadow: 0 0 16px rgba(102, 126, 234, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 24px rgba(102, 126, 234, 0.9); transform: scale(1.1); }
}

.level-gate {
  padding: 28px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.level-gate.gate-clear {
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
}

.level-gate.gate-fail {
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
}

.gate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-num {
  padding: 6px 12px;
  background: var(--primary-gradient);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  color: white;
}

.level-theme {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.level-reward {
  padding: 6px 14px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fbbf24;
}

.question-scroll {
  padding: 24px;
  margin-bottom: 24px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  border-left: 4px solid var(--color-primary);
}

.question-text {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.65;
}

.portal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.portal-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
  overflow: hidden;
}

.portal-option:not(.locked):hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(102, 126, 234, 0.08);
  transform: translateX(6px);
}

.portal-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at left, rgba(102, 126, 234, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.25s;
}

.portal-option:not(.locked):hover .portal-glow {
  opacity: 1;
}

.portal-letter {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: var(--color-primary);
  font-weight: 800;
  font-size: 1rem;
}

.portal-text {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.45;
}

.portal-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-weight: 800;
}

.portal-icon.fail {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.portal-option.selected {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.12);
}

.portal-option.selected .portal-letter {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.portal-option.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.portal-option.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.portal-option.locked {
  cursor: default;
}

.gate-action {
  margin-top: 28px;
  text-align: center;
}

.victory-gate {
  position: relative;
  padding: 40px 32px;
  text-align: center;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 24px;
  overflow: hidden;
}

.victory-rays {
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 0deg, transparent, rgba(245, 158, 11, 0.05), transparent, rgba(102, 126, 234, 0.05), transparent);
  animation: raysSpin 8s linear infinite;
}

@keyframes raysSpin {
  to { transform: rotate(360deg); }
}

.victory-banner {
  position: relative;
  margin: 24px 0;
}

.victory-tag {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.victory-banner h2 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.victory-rank {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.victory-stats {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 28px 0;
  flex-wrap: wrap;
}

.v-stat {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  min-width: 100px;
}

.v-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.v-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.victory-stars {
  position: relative;
  margin-bottom: 28px;
}

.star-icon {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
  transition: all 0.4s ease;
}

.star-icon.earned {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  animation: starEarn 0.5s ease backwards;
}

.star-icon.earned:nth-child(2) { animation-delay: 0.15s; }
.star-icon.earned:nth-child(3) { animation-delay: 0.3s; }

@keyframes starEarn {
  from { transform: scale(0) rotate(-180deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
}

.level-transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 39, 0.75);
  backdrop-filter: blur(6px);
}

.transition-content {
  text-align: center;
  animation: transitionPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.transition-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.transition-content h3 {
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
}

.transition-content p {
  margin: 0;
  color: #fbbf24;
  font-weight: 600;
}

@keyframes transitionPop {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}

.level-flash-enter-active,
.level-flash-leave-active {
  transition: opacity 0.3s ease;
}

.level-flash-enter-from,
.level-flash-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .adventure-layout {
    grid-template-columns: 1fr;
  }

  .teacher-sidebar {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
  }

  .player-panel {
    flex: 1;
    min-width: 200px;
    max-width: 280px;
  }
}

@media (max-width: 600px) {
  .adventure-arena {
    padding: 0 16px 60px;
  }

  .level-gate {
    padding: 20px 16px;
  }

  .question-text {
    font-size: 1rem;
  }

  .portal-option:not(.locked):hover {
    transform: none;
  }

  .map-node .node-inner {
    width: 26px;
    height: 26px;
    font-size: 0.65rem;
  }

  .start-stats {
    gap: 10px;
  }

  .start-stat {
    padding: 10px 12px;
    min-width: 70px;
  }
}
</style>
