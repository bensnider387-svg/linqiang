<template>
  <div class="modern-app-container">
    <navcomponent></navcomponent>

    <div class="register-wrapper">
      <div class="register-card">
        <!-- 左侧表单区域 -->
        <div class="register-form-section">
          <div class="form-header">
            <h1 class="form-title">Create Account</h1>
            <p class="form-subtitle">Join our trading community today</p>
          </div>

          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-row">
              <div class="form-group">
                <label for="username" class="form-label">
                  <span class="label-icon">👤</span>
                  Username
                </label>
                <input 
                  type="text" 
                  id="username" 
                  v-model="username" 
                  class="form-input"
                  placeholder="Choose a username"
                  :class="{ 'error': usernameError }"
                >
                <div v-if="usernameError" class="error-message">
                  <span class="error-icon">⚠️</span>
                  {{ usernameError }}
                </div>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  <span class="label-icon">🔒</span>
                  Password
                </label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="password" 
                  class="form-input"
                  placeholder="Create a password"
                  :class="{ 'error': passwordError }"
                >
                <div v-if="passwordError" class="error-message">
                  <span class="error-icon">⚠️</span>
                  {{ passwordError }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="realname" class="form-label">
                <span class="label-icon">📝</span>
                Real Name
              </label>
              <input 
                type="text" 
                id="realname" 
                v-model="realname" 
                class="form-input"
                placeholder="Enter your full name"
                :class="{ 'error': realnameError }"
              >
              <div v-if="realnameError" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ realnameError }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email" class="form-label">
                  <span class="label-icon">📧</span>
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  class="form-input"
                  placeholder="your@email.com"
                  :class="{ 'error': emailError }"
                >
                <div v-if="emailError" class="error-message">
                  <span class="error-icon">⚠️</span>
                  {{ emailError }}
                </div>
              </div>

              <div class="form-group">
                <label for="phonenumber" class="form-label">
                  <span class="label-icon">📱</span>
                  Phone
                </label>
                <input 
                  type="tel" 
                  id="phonenumber" 
                  v-model="phonenumber" 
                  class="form-input"
                  placeholder="+1 234 567 8900"
                  :class="{ 'error': phonenumberError }"
                >
                <div v-if="phonenumberError" class="error-message">
                  <span class="error-icon">⚠️</span>
                  {{ phonenumberError }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="invitationcode" class="form-label">
                <span class="label-icon">🎫</span>
                Invitation Code <span class="optional-tag">(Optional)</span>
              </label>
              <input 
                type="text" 
                id="invitationcode" 
                v-model="invitationcode" 
                class="form-input"
                placeholder="Enter invitation code (optional)"
                :class="{ 'error': invitationcodeError }"
              >
              <div v-if="invitationcodeError" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ invitationcodeError }}
              </div>
              <div class="invitation-hint" @click="toggleContactPopup">
                <span class="hint-icon">💬</span>
                <span>Need an invitation code? <span class="hint-link">Contact support</span></span>
              </div>
            </div>
            
            <button type="submit" class="submit-btn">
              <span class="btn-icon">✨</span>
              <span>Create Account</span>
            </button>
          </form>
          
          <div class="form-footer">
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">or</span>
              <span class="divider-line"></span>
            </div>
            
            <div class="login-prompt">
              <span class="prompt-text">Already have an account?</span>
              <a href="/userlogin" class="login-link">Sign In</a>
            </div>
          </div>
        </div>

        <!-- 右侧装饰区域 -->
        <div class="register-decoration">
          <div class="decoration-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
          <div class="decoration-content">
            <div class="decoration-icon">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="url(#gradient2)" stroke-width="2" fill="none"/>
                <path d="M35 50 L45 60 L65 40" stroke="url(#gradient2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="50" cy="30" r="8" fill="url(#gradient2)"/>
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 class="decoration-title">Start Your Journey</h2>
            <p class="decoration-subtitle">Join thousands of traders and unlock exclusive features</p>
            <div class="decoration-features">
              <div class="feature-item">
                <span class="feature-icon">🚀</span>
                <span>Real-time Trading Signals</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Advanced Analytics</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">💎</span>
                <span>VIP Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Redirect Message -->
    <div class="redirect-message" v-show="showContactPopup">
      <span class="text">Redirecting to WhatsApp Community</span>
      <span class="dots"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue'
import { register } from '@/api/module/web/login';
import { get_whatsapp_link } from '../../api/module/web/index'

const router = useRouter();

const username = ref('');
const password = ref('');
const realname = ref('');
const email = ref('');
const phonenumber = ref('');
const invitationcode = ref('');

const usernameError = ref('');
const passwordError = ref('');
const realnameError = ref('');
const emailError = ref('');
const phonenumberError = ref('');
const invitationcodeError = ref('');
const showContactPopup = ref(false);

const toggleContactPopup = async () => {
  showContactPopup.value = !showContactPopup.value;
  const response = await get_whatsapp_link();
  if(response.success) {
    window.location.href = response.data;
    setTimeout(() => {
      showContactPopup.value = !showContactPopup.value;
    }, 3000);
  } else {
    showContactPopup.value = !showContactPopup.value;
  }
};

const validateForm = (): boolean => {
  usernameError.value = '';
  passwordError.value = '';
  realnameError.value = '';
  emailError.value = '';
  phonenumberError.value = '';
  invitationcodeError.value = '';
  
  let isValid = true;
  
  if (!username.value.trim()) {
    usernameError.value = 'Username is required';
    isValid = false;
  } else if (username.value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters';
    isValid = false;
  }
  
  if (!password.value.trim()) {
    passwordError.value = 'Password is required';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  if (!realname.value.trim()) {
    realnameError.value = 'Real name is required';
    isValid = false;
  }
  
  if (!email.value.trim()) {
    emailError.value = 'Email is required';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.value = 'Please enter a valid email address';
      isValid = false;
    }
  }
  
  if (!phonenumber.value.trim()) {
    phonenumberError.value = 'Phone number is required';
    isValid = false;
  }
  
  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    const payload: Record<string, string> = {
      username: username.value,
      password: password.value,
      realname: realname.value,
      email: email.value,
      phonenumber: phonenumber.value,
    };
    const code = invitationcode.value.trim();
    if (code) {
      payload.invitationcode = code;
    }
    const response = await register(payload);
    
    if(response.success){
      alert('Registration successful! Please log in.');
      router.push('/userlogin');
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again later.');
  }
};
</script>

<style scoped>
.modern-app-container {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.register-wrapper {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
}

.register-card {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.6s ease;
}

/* 左侧表单区域 */
.register-form-section {
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: var(--spacing-xl);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  background: var(--secondary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.form-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
}

.label-icon {
  font-size: 18px;
}

.optional-tag {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 12px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--bg-glass-hover);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: var(--color-danger);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-danger);
  font-size: 13px;
  margin-top: 4px;
}

.error-icon {
  font-size: 14px;
}

.invitation-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 4px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.invitation-hint:hover {
  color: var(--text-primary);
}

.hint-icon {
  font-size: 16px;
}

.hint-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 16px;
  background: var(--secondary-gradient);
  border: none;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 20px;
}

.form-footer {
  margin-top: var(--spacing-xl);
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  color: var(--text-muted);
  font-size: 13px;
}

.login-prompt {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.prompt-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all var(--transition-base);
}

.login-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* 右侧装饰区域 */
.register-decoration {
  background: var(--secondary-gradient);
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.decoration-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: -30px;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

.decoration-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.decoration-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  animation: pulse 2s ease-in-out infinite;
}

.decoration-icon svg {
  width: 100%;
  height: 100%;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.decoration-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.decoration-subtitle {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.decoration-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 15px;
  font-weight: 500;
}

.feature-icon {
  font-size: 20px;
}

.redirect-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  padding: 15px 30px;
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.redirect-message .text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.redirect-message .dots {
  display: inline-block;
  width: 24px;
}

.redirect-message .dots::after {
  content: '...';
  animation: dots 1s infinite;
}

@keyframes dots {
  0%, 33% { content: '.'; }
  34%, 66% { content: '..'; }
  67%, 100% { content: '...'; }
}

/* 响应式设计 */
@media (max-width: 968px) {
  .register-card {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
  
  .register-decoration {
    display: none;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
    padding: var(--spacing-md);
  }
  
  .register-form-section {
    padding: var(--spacing-lg);
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-input {
    padding: 14px 16px;
    font-size: 16px;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 15px;
  }
}
</style>
