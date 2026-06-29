<template>
  <div class="robot-teacher" :class="[`mood-${mood}`, { speaking: isSpeaking }]">
    <div class="speech-bubble" v-if="message">
      <div class="bubble-tail"></div>
      <p class="bubble-text">{{ message }}</p>
    </div>

    <div class="robot-body">
      <div class="robot-antenna">
        <span class="antenna-ball"></span>
      </div>

      <div class="robot-head">
        <div class="robot-screen">
          <div class="robot-eyes">
            <span class="eye left" :class="eyeClass"></span>
            <span class="eye right" :class="eyeClass"></span>
          </div>
          <div class="robot-mouth" :class="mouthClass"></div>
        </div>
        <div class="robot-glasses"></div>
      </div>

      <div class="robot-torso">
        <div class="robot-badge">AI</div>
        <div class="robot-tie"></div>
      </div>

      <div class="robot-arms">
        <span class="arm left"></span>
        <span class="arm right" :class="{ wave: mood === 'celebrate' || mood === 'happy' }"></span>
      </div>

      <div class="robot-book">
        <span>📖</span>
      </div>
    </div>

    <div class="teacher-name">
      <span class="name">Professor Byte</span>
      <span class="role">Trading Mentor</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  message?: string;
  mood?: 'idle' | 'happy' | 'sad' | 'thinking' | 'celebrate';
  isSpeaking?: boolean;
}>(), {
  message: '',
  mood: 'idle',
  isSpeaking: false,
});

const eyeClass = computed(() => {
  if (props.mood === 'happy' || props.mood === 'celebrate') return 'happy';
  if (props.mood === 'sad') return 'sad';
  if (props.mood === 'thinking') return 'blink';
  return 'normal';
});

const mouthClass = computed(() => {
  if (props.mood === 'happy' || props.mood === 'celebrate') return 'smile';
  if (props.mood === 'sad') return 'frown';
  if (props.mood === 'thinking') return 'flat';
  return 'talk';
});
</script>

<style scoped>
.robot-teacher {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: robotFloat 3s ease-in-out infinite;
}

@keyframes robotFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.speech-bubble {
  position: relative;
  max-width: 220px;
  margin-bottom: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(102, 126, 234, 0.35);
  border-radius: 16px 16px 16px 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.robot-teacher.speaking .speech-bubble {
  animation: bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), bubblePulse 2s ease-in-out infinite;
}

@keyframes bubblePop {
  from { opacity: 0; transform: scale(0.85) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes bubblePulse {
  0%, 100% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }
  50% { box-shadow: 0 8px 28px rgba(102, 126, 234, 0.35); }
}

.bubble-tail {
  position: absolute;
  bottom: -10px;
  left: 28px;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-right: 2px solid rgba(102, 126, 234, 0.35);
  border-bottom: 2px solid rgba(102, 126, 234, 0.35);
  transform: rotate(45deg);
}

.bubble-text {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a1f3a;
  line-height: 1.45;
}

.robot-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.robot-antenna {
  width: 3px;
  height: 14px;
  background: #94a3b8;
  position: relative;
  margin-bottom: -2px;
}

.antenna-ball {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.8);
  animation: antennaBlink 1.5s ease-in-out infinite;
}

@keyframes antennaBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.robot-head {
  position: relative;
  width: 88px;
  height: 72px;
  background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
  border-radius: 20px 20px 16px 16px;
  border: 3px solid #94a3b8;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 0, 0, 0.25);
}

.robot-glasses {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 62px;
  height: 22px;
  border: 3px solid #475569;
  border-radius: 8px;
  pointer-events: none;
}

.robot-glasses::before,
.robot-glasses::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 8px;
  height: 3px;
  background: #475569;
}

.robot-glasses::before { left: -10px; transform: translateY(-50%); }
.robot-glasses::after { right: -10px; transform: translateY(-50%); }

.robot-screen {
  position: absolute;
  inset: 10px 12px 14px;
  background: linear-gradient(180deg, #1e293b, #0f172a);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.robot-eyes {
  display: flex;
  gap: 14px;
}

.eye {
  width: 12px;
  height: 12px;
  background: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.8);
  transition: all 0.3s ease;
}

.eye.happy {
  height: 6px;
  border-radius: 50% 50% 0 0;
  margin-top: 4px;
}

.eye.sad {
  height: 6px;
  border-radius: 0 0 50% 50%;
  margin-bottom: 4px;
}

.eye.blink {
  animation: eyeBlink 2s ease-in-out infinite;
}

@keyframes eyeBlink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

.robot-mouth {
  width: 20px;
  height: 4px;
  background: #38bdf8;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.robot-mouth.smile {
  width: 22px;
  height: 10px;
  border-radius: 0 0 12px 12px;
  background: transparent;
  border-bottom: 3px solid #38bdf8;
}

.robot-mouth.frown {
  width: 22px;
  height: 10px;
  border-radius: 12px 12px 0 0;
  background: transparent;
  border-top: 3px solid #38bdf8;
  border-bottom: none;
}

.robot-mouth.talk {
  animation: mouthTalk 0.5s ease-in-out infinite;
}

@keyframes mouthTalk {
  0%, 100% { height: 4px; }
  50% { height: 8px; border-radius: 50%; }
}

.robot-torso {
  position: relative;
  width: 64px;
  height: 48px;
  margin-top: -4px;
  background: linear-gradient(145deg, #667eea, #764ba2);
  border-radius: 12px;
  border: 3px solid #5b6fd4;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.robot-badge {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.robot-tie {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 18px solid #f59e0b;
}

.robot-arms {
  position: absolute;
  top: 88px;
  width: 110px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.arm {
  width: 28px;
  height: 8px;
  background: #94a3b8;
  border-radius: 4px;
}

.arm.left {
  transform: rotate(25deg);
  transform-origin: right center;
}

.arm.right {
  transform: rotate(-25deg);
  transform-origin: left center;
}

.arm.right.wave {
  animation: armWave 0.8s ease-in-out infinite;
}

@keyframes armWave {
  0%, 100% { transform: rotate(-25deg); }
  50% { transform: rotate(-55deg); }
}

.robot-book {
  position: absolute;
  bottom: -8px;
  right: -20px;
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: bookBob 2s ease-in-out infinite;
}

@keyframes bookBob {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.teacher-name {
  margin-top: 16px;
  text-align: center;
}

.teacher-name .name {
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.teacher-name .role {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 2px;
  letter-spacing: 0.5px;
}

.mood-celebrate .robot-head {
  animation: headNod 0.6s ease-in-out infinite;
}

@keyframes headNod {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-4deg); }
  75% { transform: rotate(4deg); }
}
</style>
