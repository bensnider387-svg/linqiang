<template>
  <div class="app-container">
    <!-- 烟花效果容器 -->
    <div id="firework-container" class="firework-container"></div>
    <navcomponent></navcomponent>
    <!-- Top Navigation -->
    <!-- <nav class="top-nav">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="btn btn-back">
              <i class="bi bi-arrow-left me-1"></i>Back to Home
            </a>
        </div>
        <div class="nav-center d-none d-md-flex">
          <i class="bi bi-graph-up header-icon"></i>
          <h1 class="header-title">{{ homeTopTitle }}</h1>
        </div>
        <div class="nav-right">
          <button class="btn btn-login" :class="{ 'logged-in': isLoggedIn }" @click="handleLoginButtonClick">
            <i :class="isLoggedIn ? 'bi bi-person-check-fill' : 'bi bi-person-fill'" class="me-1"></i>
            {{ isLoggedIn ? username : 'Login' }}
          </button>
        </div>
      </div>
    </nav> -->

    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">User Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="loginUsername" placeholder="Enter your username">
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="loginPassword" placeholder="Enter your password">
              </div>
              <button type="submit" class="btn btn-submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP Header Section -->
    <div class="vip-header text-center">
      <div class="container">
        <div :class="['vip-title', membershipLevel.toLowerCase().replace(/\s+/g, '-')]">
          <h1>Welcome to the Member Center</h1>
        </div>
        <h2 class="display-5 mb-5 user-progress">{{ isLoggedIn ? username + ': Your Trading Progress' : 'Your Trading Progress' }}</h2>
      </div>
    </div>

    <div class="container" style="max-width: 1000px;">
      <!-- Progress Section -->
      <div class="progress-section">
        <a href="/vipdashboard" style="text-decoration:none;color:inherit;" @click.prevent="handleProgressCardClick">
          <div class="progress-card" :class="{ 'clickable': isLoggedIn, 'unclickable': !isLoggedIn }" :style="{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }">
            <div class="row align-items-center g-2">
              <div class="col-md-3">
                <div class="current-level">
                  <i class="bi bi-star-fill"></i>
                  <h4 class="text-white mb-0" style="font-size: 1rem;">Current Level</h4>
                  <p class="text-gold mb-0">{{ nowLevelInfo.currlevelname }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="progress-bar-wrapper">
                  <div class="progress">
                    <div class="progress-bar" role="progressbar" 
                      :style="{ width: progress + '%' }"
                      :aria-valuenow="dynamicTotalAsset"
                      aria-valuemin="0"
                      :aria-valuemax="currentTarget">
                      <span class="progress-percent">{{ progress }}%</span>
                    </div>
                  </div>
                  <div class="progress-labels d-flex justify-content-between">
                    <span style="font-size: 14px;">{{ formatMoneyRight(dynamicTotalAsset) }} / {{ formatMoneyRight(nowLevelInfo.nextmoney) }}</span>
                    <span class="text-gold">Next Level: {{ nowLevelInfo.nextname }}</span>
                    
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="next-milestone">
                  <i class="bi bi-crown-fill"></i>
                  <h4 class="text-white mb-0" style="font-size: 1rem;">Next Level</h4>
                  <p class="text-gold mb-0">{{ nowLevelInfo.nextname }}</p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Membership Cards Section -->
      <div class="membership-cards-container">
        <!-- Membership Cards -->
        <div v-for="(level, index) in vipList" :key="index" class="membership-card-wrapper">
          <div :class="['membership-card', getCardClass(level.name), 'text-center']">
            <span v-if="nowLevelInfo.currlevelname === level.name" class="vip-badge">Current Selection</span>
            <i class="bi bi-star-fill card-icon"></i>
            <h3 class="h3Height">{{ level.name }}</h3>
            <div class="card-requirement">>= {{ formatMoneyRight(level.min_trading_volume) }}</div>
            <ul class="feature-list">
              <li v-for="(benefit, i) in level.benefits" :key="i">
                <i class="bi bi-check-circle-fill"></i> {{ benefit }}
              </li>
            </ul>
            <div class="upgrade-info"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 答题卡区域 -->
    <div class="container quiz-container" style="max-width: 1000px; margin-bottom: 3rem;">
      <div v-if="!quizCompleted" class="quiz-section" style="position: relative;">
        <!-- 题目导航指示器 -->
        <div class="quiz-navigation">
          <div 
            v-for="(question, index) in quizQuestions" 
            :key="index"
            class="quiz-nav-indicator"
            :class="{
              'active': index === currentQuestionIndex,
              'completed': index < currentQuestionIndex
            }"
          ></div>
        </div>

        <!-- Current Question -->
        <div class="quiz-content">
          <div class="quiz-header">
            <h2 style="text-align: center; margin-bottom: 2rem; color: #ffd700;">Financial Knowledge Quiz</h2>
            <h3 class="quiz-question" style="font-size: 1.5rem; margin-bottom: 2rem; text-align: center;">
              {{ currentQuestion.question }}
            </h3>
          </div>

          <!-- 选项列表 -->
          <div class="quiz-options">
            <button 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="quiz-option"
              :class="{
                'correct': selectedAnswer === index && isAnswerCorrect,
                'incorrect': selectedAnswer === index && !isAnswerCorrect,
                'selected': selectedAnswer === index
              }"
              :disabled="selectedAnswer !== null"
              @click="handleSelectAnswer(index)"
              style="
                display: block;
                width: 100%;
                padding: 1.25rem;
                margin-bottom: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 12px;
                color: #ffffff;
                text-align: left;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
              "
            >
              {{ String.fromCharCode(65 + index) }}. {{ option }}
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" style="text-align: center; margin-top: 2rem;">
            <div class="loading-spinner"></div>
            <p>Loading next question...</p>
          </div>

          <!-- Quiz Result Popup -->
          <div v-if="showResult" class="quiz-result-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div class="quiz-result">
              <h3>{{ isAnswerCorrect ? 'Correct Answer!' : 'Wrong Answer' }}</h3>
              <p v-if="isAnswerCorrect">
                Great job! You answered this question correctly.
              </p>
              <p v-else>
                Unfortunately, the correct answer is: 
                <strong style="color: #ffd700;">
                  {{ String.fromCharCode(65 + currentQuestion.correctAnswer) }}. {{ currentQuestion.options[currentQuestion.correctAnswer] }}
                </strong>
              </p>
              <button @click="goToNextQuestion">OK</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Completed Page -->
      <div v-else class="quiz-completed">
        <h2>Congratulations! You've completed all questions!</h2>
        <p>Your score:</p>
        <div class="score">
          {{ score }}/{{ quizQuestions.length }}
        </div>
        <div v-if="score === quizQuestions.length" style="margin-bottom: 2rem;">
          <p style="color: #ffd700; font-size: 1.5rem;">💯 Perfect! You're a financial knowledge expert!</p>
        </div>
        <div v-else-if="score > quizQuestions.length / 2" style="margin-bottom: 2rem;">
          <p style="color: #2ecc71;">👍 Great job! Keep learning and you'll be even better!</p>
        </div>
        <div v-else style="margin-bottom: 2rem;">
          <p style="color: #f39c12;">💪 Keep practicing and learn more about finance!</p>
        </div>
        <button @click="restartQuiz">Restart</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue'
import{ get_userinfo,get_membership_levels,updateUserLevel } from '../../api/module/web/vip'
import { useUserStore } from '@/store';
import { formatMoneyRight } from '@/utils/formatNumber';
const userStore = useUserStore()
const router = useRouter();
const userinfo=ref({})
const membership_levels=ref([])
// Page data
const homeTopTitle = ref('RenderZaice Trading Platform');
const membershipLevel = ref('Regular Member');
const isLoggedIn = ref(false);
const username = ref('');
const loginUsername = ref('');
const loginPassword = ref('');
const current_level=ref(0)
// 模拟数据
const nowLevelInfo = ref({
  current_level:-1,
  currlevelname: 'Regular Member',
  next_level: -1,
  nextmoney: 50000,
  nextname: 'Gold Member'
});

const dynamicTotalAsset = ref(0);
const currentTarget = ref(1000000);
const progress = ref(Math.round((dynamicTotalAsset.value / nowLevelInfo.value.nextmoney) * 100 * 10) / 10);

const vipList = ref([]);



// 根据会员等级获取标题
const getTitleByLevel = (level: string) => {
  const titleMap: Record<string, string> = {
    'Regular Member': 'Esteemed VIP Member',
    'Gold Member': 'Honorable Gold Member',
    'Diamond Member': 'Distinguished Diamond Member',
    'Supreme Black Card': 'Supreme Black Card Member'
  };
  return titleMap[level] || 'VIP Membership Area';
};

// 获取卡片样式类
const getCardClass = (level: string) => {
  const classMap: Record<string, string> = {
    '黄金会员': 'premium',
    '钻石会员': 'diamond',
    '至尊黑卡': 'supreme'
  };
  return classMap[level] || '';
};

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
};

// 处理登录按钮点击
const handleLoginButtonClick = () => {
  if (isLoggedIn.value) {
    handleLogout();
  } else {
     router.push('/userlogin');
    // 显示登录模态框
    const loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
  }
};

// 处理登录表单提交
const handleLogin = async () => {
  if (!loginUsername.value.trim() || !loginPassword.value.trim()) {
    alert('Please enter username and password');
    return;
  }
  
  try {
    // 模拟登录验证
    if (loginUsername.value === 'admin' && loginPassword.value === 'password') {
      isLoggedIn.value = true;
      username.value = loginUsername.value;
      
      // 关闭登录模态框
      const loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.hide();
      
      // 模拟更新用户信息
      updateUserProgress();
    } else {
      alert('Invalid username or password');
    }
  } catch (error) {
    alert('Login failed. Please try again.');
  }
};

// 处理登出
const handleLogout = () => {
  isLoggedIn.value = false;
  username.value = '';
  loginUsername.value = '';
  loginPassword.value = '';
  dynamicTotalAsset.value = 0;
  progress.value = 0;
};

// 处理进度卡片点击
const handleProgressCardClick = () => {
  if (isLoggedIn.value) {
    router.push('/vipdashboard');
  } else {
    alert('Please login to access the VIP dashboard');
  }
};
// 初始化
onMounted(async () => {
  // 模拟获取用户信息
  setTimeout(() => {
    // 这里可以添加实际的API调用
    // 暂时使用模拟数据
    updateUserProgress();
  }, 500);
  
  // 模拟获取会员等级
  try {
    vipList.value = [
      {
        name: 'Regular Member',
        min_trading_volume: 0,
        benefits: [
          'Basic trading features',
          'Access to standard market data',
          'Email support'
        ]
      },
      {
        name: '黄金会员',
        min_trading_volume: 50000,
        benefits: [
          'All regular member benefits',
          'Advanced charting tools',
          'Priority customer support',
          'Exclusive market insights'
        ]
      },
      {
        name: '钻石会员',
        min_trading_volume: 200000,
        benefits: [
          'All gold member benefits',
          'Personal trading advisor',
          'Lower transaction fees',
          'VIP event invitations'
        ]
      },
      {
        name: '至尊黑卡',
        min_trading_volume: 1000000,
        benefits: [
          'All diamond member benefits',
          'Zero transaction fees',
          'Customized investment strategies',
          '24/7 premium support',
          'Luxury lifestyle perks'
        ]
      }
    ];
  } catch (error) {
    console.error('Failed to load membership levels:', error);
  }
});

// 更新用户进度数据
const updateUserProgress = () => {
  // 模拟用户资产数据
  dynamicTotalAsset.value = 35000;
  progress.value = Math.round((dynamicTotalAsset.value / nowLevelInfo.value.nextmoney) * 100 * 10) / 10;
};

// 烟花效果函数
const createFirework = () => {
  // 获取烟花容器
  let fireworkContainer = document.getElementById('firework-container');
  if (!fireworkContainer) {
    fireworkContainer = document.createElement('div');
    fireworkContainer.id = 'firework-container';
    fireworkContainer.className = 'firework-container';
    document.body.appendChild(fireworkContainer);
  }
  
  // 创建烟花粒子
  const particleCount = 180; // 增加粒子数量，提高粒度
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // 随机颜色
    const colors = ['#ffd700', '#ffb300', '#ffe066', '#ffcc00', '#ffed4e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 设置粒子样式
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`; // 增加粒子大小
    particle.style.height = `${Math.random() * 4 + 2}px`; // 增加粒子大小
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.opacity = '1';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}40`; // 增加发光效果
    
    // 随机速度和角度
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 5; // 增加速度范围，使烟花更分散
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    
    fireworkContainer.appendChild(particle);
    
    // 动画粒子
    let x = 0;
    let y = 0;
    let alpha = 1;
    const friction = 0.97;
    const gravity = 0.05;
    
    const animateParticle = () => {
      x += vx;
      y += vy;
      vy += gravity;
      vx *= friction;
      vy *= friction;
      alpha -= 0.02;
      
      particle.style.transform = `translate(${x}px, ${y}px)`;
      particle.style.opacity = alpha.toString();
      
      if (alpha > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        if (particle.parentNode === fireworkContainer) {
          fireworkContainer.removeChild(particle);
        }
      }
    };
    
    animateParticle();
  }
  
  // 当烟花效果不活跃时才清理容器
  setTimeout(() => {
    if (!isFireworkActive.value && fireworkContainer && document.body.contains(fireworkContainer)) {
      // 移除所有子元素
      while (fireworkContainer.firstChild) {
        fireworkContainer.removeChild(fireworkContainer.firstChild);
      }
    }
  }, 5000);
};


// Quiz Functionality
// Question data
const quizQuestions = [
  {
    question: 'Which investment tool is generally considered the safest?',
    options: ['Stocks', 'Bonds', 'Cryptocurrencies', 'Futures'],
    correctAnswer: 1
  },
  {
    question: 'What does the Price-to-Earnings (P/E) ratio measure?',
    options: ['Corporate debt level', 'Stock valuation', 'Market volatility', 'Dividend yield'],
    correctAnswer: 1
  },
  {
    question: 'Which index represents the U.S. technology stock market?',
    options: ['Dow Jones Industrial Average', 'S&P 500 Index', 'NASDAQ Composite Index', 'Russell 2000 Index'],
    correctAnswer: 2
  },
  {
    question: 'When the market is generally pessimistic, investors usually turn to which asset for safety?',
    options: ['Gold', 'Crude Oil', 'Real Estate', 'Small-cap Stocks'],
    correctAnswer: 0
  },
  {
    question: 'Which investment strategy involves buying and holding various assets to diversify risk?',
    options: ['Value Investing', 'Growth Investing', 'Index Investing', 'Asset Allocation'],
    correctAnswer: 3
  }
];

// 响应式变量
const currentQuestionIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const showResult = ref(false);
const isAnswerCorrect = ref(false);
const quizCompleted = ref(false);
const score = ref(0);
const isLoading = ref(false);
const isFireworkActive = ref(false);
let fireworkInterval: number | null = null;

// 获取当前题目
const currentQuestion = computed(() => {
  return quizQuestions[currentQuestionIndex.value];
});

// 处理选择答案
const handleSelectAnswer = (index: number) => {
  if (selectedAnswer.value !== null || showResult.value) return;
  
  selectedAnswer.value = index;
  isAnswerCorrect.value = index === currentQuestion.value.correctAnswer;
  
  // 如果回答正确，增加分数
  if (isAnswerCorrect.value) {
    score.value++;
  }
  
  // 显示结果
  setTimeout(() => {
    showResult.value = true;
    
    // 答案正确时，开始持续播放烟花效果
    if (isAnswerCorrect.value) {
      isFireworkActive.value = true;
      // 立即播放一次烟花
      createFirework();
      // 设置间隔，持续播放烟花
      fireworkInterval = window.setInterval(() => {
        if (isFireworkActive.value) {
          createFirework();
        }
      }, 1000); // 每秒播放一次
    }
  }, 500);
};

// 进入下一题
const goToNextQuestion = () => {
  // 停止烟花效果
  isFireworkActive.value = false;
  if (fireworkInterval) {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
  }
  
  // 清除烟花容器中的所有粒子
  const fireworkContainer = document.getElementById('firework-container');
  if (fireworkContainer) {
    while (fireworkContainer.firstChild) {
      fireworkContainer.removeChild(fireworkContainer.firstChild);
    }
  }
  
  showResult.value = false;
  selectedAnswer.value = null;
  currentQuestionIndex.value++;
  
  // 检查是否完成所有题目
  if (currentQuestionIndex.value >= quizQuestions.length) {
    quizCompleted.value = true;
  }
};

// 重新开始答题
const restartQuiz = () => {
  // 停止烟花效果
  isFireworkActive.value = false;
  if (fireworkInterval) {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
  }
  
  // 清除烟花容器中的所有粒子
  const fireworkContainer = document.getElementById('firework-container');
  if (fireworkContainer) {
    while (fireworkContainer.firstChild) {
      fireworkContainer.removeChild(fireworkContainer.firstChild);
    }
  }
  
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showResult.value = false;
  isAnswerCorrect.value = false;
  quizCompleted.value = false;
  score.value = 0;
};

</script>

<style scoped>
/* 自定义样式 */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@400;600&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #181c2b;
  --secondary-color: #23243a;
  --accent-color: #4361ee;
  --success-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f1c40f;
  --text-color: #ffffff;
  --border-color: #2a2a3a;
  --gold-color: #ffd700;
}

.app-container {
  background: linear-gradient(120deg, #181c2b 0%, #23243a 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  margin: 0;
  padding: 0;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: 100vh;
}

/* 添加光纤划过效果 */
.app-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 30%,
    rgba(255, 255, 255, 0.05) 40%,
    transparent 100%
  );
  animation: lightBeam 8s infinite linear;
  pointer-events: none;
}

@keyframes lightBeam {
  0% {
    transform: rotate(0deg) translate(-50%, -50%);
  }
  100% {
    transform: rotate(360deg) translate(-50%, -50%);
  }
}

.top-nav {
  background: rgba(26, 28, 46, 0.95);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-left {
  flex: 0 0 auto;
}

.nav-center {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.nav-right {
  flex: 0 0 auto;
}

.header-icon {
  color: #ffd700;
  font-size: 1.5rem;
}

.header-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.btn-login {
  background: #ffd700;
  color: #000;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background: #b8860b;
  color: #000;
}

.btn-login.logged-in {
  background: #28a745;
  color: white;
}

.btn-login.logged-in:hover {
  background: #218838;
  color: white;
}

.btn-back {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
}

.modal-content {
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  color: #ffffff;
}

.modal-header {
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  padding: 1.5rem;
}

.modal-header .btn-close {
  color: #ffffff;
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-body {
  padding: 2rem;
}

.form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.1);
  color: #ffffff;
  border-radius: 10px;
  padding: 0.75rem 1rem;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #ffd700;
  color: #ffffff;
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.1);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-submit {
  background: linear-gradient(90deg, #ffd700 0%, #b8860b 100%);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.vip-header {
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
}

.vip-title {
  text-align: center;
  padding: 2rem 0;
  margin: 2rem 0;
}

.vip-title h1 {
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;
}

/* VIP Member Area 标题样式 */
.vip-title.regular h1 {
  font-family: 'Cinzel', serif;
  font-size: 4.5rem;
  background: linear-gradient(120deg, #4a90e2 0%, #87ceeb 25%, #4a90e2 50%, #87ceeb 75%, #4a90e2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 
    0 0 20px rgba(74, 144, 226, 0.4),
    0 0 40px rgba(74, 144, 226, 0.2);
  animation: titleGlow 3s ease-in-out infinite alternate;
  letter-spacing: 3px;
  position: relative;
  z-index: 1;
}

.vip-title.regular h1::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle at center, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
  z-index: -1;
  animation: pulseBackground 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0% {
    text-shadow: 
      0 0 20px rgba(74, 144, 226, 0.4),
      0 0 40px rgba(74, 144, 226, 0.2);
    transform: scale(1);
  }
  100% {
    text-shadow: 
      0 0 30px rgba(74, 144, 226, 0.6),
      0 0 60px rgba(74, 144, 226, 0.3);
    transform: scale(1.02);
  }
}

@keyframes pulseBackground {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

/* 黄金会员样式 */
.vip-title.gold h1 {
  font-family: 'Cinzel', serif;
  color: #ffd700;
  background: linear-gradient(120deg, #ffd700, #ffa500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  font-weight: 700;
  letter-spacing: 2px;
}

/* 钻石会员样式 */
.vip-title.diamond h1 {
  font-family: 'Cinzel', serif;
  color: #b9f2ff;
  background: linear-gradient(120deg, #b9f2ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(185, 242, 255, 0.6);
  font-weight: 700;
  letter-spacing: 3px;
}

/* 至尊黑卡会员样式 */
.vip-title.supreme h1 {
  font-family: 'Cinzel', serif;
  color: #fff;
  background: linear-gradient(120deg, #ffd700, #fff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3.5rem;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  font-weight: 700;
  letter-spacing: 4px;
  position: relative;
  z-index: 1;
  animation: supremeGlow 3s ease-in-out infinite alternate;
}

.vip-title.supreme h1::before {
  content: '';
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  background: linear-gradient(120deg, #000, #1a1a1a, #000);
  z-index: -1;
  filter: blur(25px);
  opacity: 0.7;
  border-radius: 50%;
}

.vip-title.supreme h1::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%);
  z-index: -1;
  animation: supremeShine 3s linear infinite;
}

@keyframes supremeGlow {
  0% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 50px rgba(255, 215, 0, 1);
    transform: scale(1.02);
  }
  100% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    transform: scale(1);
  }
}

@keyframes supremeShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.user-progress {
  font-family: 'Montserrat', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  margin-top: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.membership-cards-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 0;
  margin: 0 auto;
  max-width: 1400px;
}

.membership-card-wrapper {
  flex: 1;
  min-width: 280px;
  max-width: 320px;
}

.membership-card {
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.membership-card.premium {
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.1);
}

.membership-card.diamond {
  box-shadow: 0 10px 30px rgba(185, 242, 255, 0.1);
}

.membership-card.supreme {
  background: linear-gradient(145deg, #000000 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  display: block;
}

.membership-card h3 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-weight: 600;
}

.card-requirement {
  color: #ffd700;
  font-size: 1.4rem;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.feature-list li {
  margin-bottom: 1rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  line-height: 1.4;
}

.feature-list li i {
  color: #ffd700;
  margin-right: 0.75rem;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.upgrade-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.upgrade-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin: 0;
}

.vip-badge {
  background: linear-gradient(90deg, #ffd700 0%, #b8860b 100%);
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-card {
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.current-level, .next-milestone {
  padding: 0.5rem;
  text-align: center;
}

.current-level i, .next-milestone i {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
  color: #ffd700;
}

.progress {
  height: 15px !important;
  background: rgba(255, 215, 0, 0.1);
  margin: 0.5rem 0;
}

.progress-bar {
  background: linear-gradient(90deg, #ffd700, #b8860b);
}

.progress-labels {
  font-size: 1.1rem;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.current-level h4, .next-milestone h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.current-level p, .next-milestone p {
  font-size: 1.3rem;
  margin-bottom: 0;
}

/* 动态进度卡片样式 - 优化可读性 */
.progress-card.clickable {
  background: linear-gradient(90deg, #ffe066 0%, #ffd700 60%, #ffb300 100%) !important;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2), 0 2px 16px rgba(255, 215, 0, 0.14);
  color: #23243a !important;
  transition: transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s, background 0.22s;
  cursor: pointer;
  position: relative;
}

.progress-card.clickable * {
  color: #23243a !important;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5), 0 0 2px rgba(255, 215, 0, 0.2);
}

.progress-card.clickable .text-gold {
  color: #b8860b !important;
}

.progress-card.clickable:hover {
  transform: scale(1.035);
  box-shadow: 0 16px 48px rgba(255, 215, 0, 0.35), 0 4px 24px rgba(255, 215, 0, 0.2);
  background: linear-gradient(90deg, #ffd700 0%, #ffe066 100%) !important;
}

.progress-card.unclickable {
  background: rgba(255,255,255,0.04) !important;
  color: #aaa !important;
  filter: grayscale(0.3) brightness(0.85);
  cursor: not-allowed;
  transition: none;
}

.progress-card.unclickable * {
  color: #aaa !important;
  text-shadow: none;
}

.progress-card.unclickable:hover {
  transform: none;
  box-shadow: none;
}

/* 进度条优化 */
.progress-bar-wrapper .progress {
  background: rgba(0,0,0,0.13) !important;
  border-radius: 16px !important;
  height: 24px !important;
  box-shadow: 0 2px 12px rgba(184, 134, 11, 0.2), 0 1px 8px rgba(255, 255, 255, 0.25);
  position: relative;
}

.progress-bar-wrapper .progress-bar {
  background: linear-gradient(90deg, #fffbe6 0%, #ffe066 30%, #ffd700 70%, #ffb300 100%) !important;
  box-shadow: 0 2px 16px rgba(255, 215, 0, 0.55), 0 0 8px rgba(255, 255, 255, 0.5);
  border-radius: 16px !important;
  height: 24px !important;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.1rem;
  color: #23243a !important;
  text-shadow: 0 1px 4px rgba(255, 255, 255, 0.7), 0 0 2px rgba(255, 215, 0, 0.6);
  overflow: visible;
}

.progress-bar-wrapper .progress-bar .progress-percent {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.h3Height {
  height: 80px;
}

.text-gold {
  color: #ffd700 !important;
}


/* 答题结果显示样式 */
.quiz-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  width: 80%;
  max-width: 500px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.quiz-result h3 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.quiz-result p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.quiz-result button {
  background: linear-gradient(90deg, #ffd700 0%, #b8860b 100%);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quiz-result button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* 烟花效果容器 */
.firework-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .quiz-container {
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  .quiz-question {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
  
  .quiz-option {
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  .quiz-result {
    width: 90%;
    padding: 1.5rem;
  }
  
  .quiz-result h3 {
    font-size: 1.5rem;
  }
  
  .quiz-result p {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .quiz-container {
    padding: 1rem;
    margin-top: 1.5rem;
  }
  
  .quiz-question {
    font-size: 1.2rem;
  }
  
  .quiz-option {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.quiz-container {
  animation: fadeIn 0.5s ease-out;
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.15), 0 0 50px rgba(255, 215, 0, 0.05) inset;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.quiz-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 50%, transparent 100%);
  animation: borderShine 4s infinite linear;
}

@keyframes borderShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.quiz-option {
  transition: all 0.3s ease;
  transform-origin: left center;
}

.quiz-option:hover:not(:disabled) {
  transform: translateX(5px);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

.quiz-option:active:not(:disabled) {
  transform: translateX(3px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

/* 正确答案动画 */
@keyframes correctAnswer {
  0%, 100% {
    background-color: rgba(255, 215, 0, 0.1);
  }
  50% {
    background-color: rgba(255, 215, 0, 0.3);
  }
}

.quiz-option.correct {
  animation: correctAnswer 1s ease-in-out;
}

/* 加载更多效果 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  border-top-color: #ffd700;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 答题完成页面样式 */
.quiz-completed {
  text-align: center;
  padding: 3rem;
}

.quiz-completed h2 {
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.quiz-completed p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.quiz-completed .score {
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
  margin: 2rem 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.quiz-completed button {
  background: linear-gradient(90deg, #ffd700 0%, #b8860b 100%);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.quiz-completed button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

/* 重置按钮样式 */
.reset-quiz-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 215, 0, 0.3) !important;
}

.reset-quiz-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: #ffd700 !important;
}

/* 禁用状态样式 */
.quiz-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.quiz-option:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 答题导航指示器 */
.quiz-navigation {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
}

.quiz-nav-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.quiz-nav-indicator.active {
  background: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
}

.quiz-nav-indicator.completed {
  background: rgba(255, 215, 0, 0.5);
}
</style>