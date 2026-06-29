<template>
  <div class="modern-app-container">
    <navcomponent></navcomponent>

    <div class="login-wrapper">
      <div class="login-card">
        <!-- 左侧装饰区域 -->
        <div class="login-decoration">
          <div class="decoration-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
          <div class="decoration-content">
            <div class="decoration-icon">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="url(#gradient1)" stroke-width="2" fill="none"/>
                <path d="M30 50 L45 65 L70 35" stroke="url(#gradient1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 class="decoration-title">Welcome Back</h2>
            <p class="decoration-subtitle">Access your trading dashboard and manage your portfolio</p>
          </div>
        </div>

        <!-- 右侧登录表单 -->
        <div class="login-form-section">
          <div class="form-header">
            <h1 class="form-title">Sign In</h1>
            <p class="form-subtitle">Sign in with username/password or your Google account</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">
                <span class="label-icon">👤</span>
                Username
              </label>
              <input 
                type="text" 
                id="username" 
                v-model="loginUsername" 
                class="form-input"
                placeholder="Enter your username"
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
                v-model="loginPassword" 
                class="form-input"
                placeholder="Enter your password"
                :class="{ 'error': passwordError }"
              >
              <div v-if="passwordError" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ passwordError }}
              </div>
            </div>
            
            <button type="submit" class="submit-btn" :disabled="isLoggingIn">
              <span v-if="isLoggingIn" class="btn-loader"></span>
              <span v-else class="btn-icon">→</span>
              <span>{{ isLoggingIn ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>
          
          <div class="form-footer">
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">or</span>
              <span class="divider-line"></span>
            </div>

            <div class="google-login-wrap">
              <button
                type="button"
                class="google-signin-btn"
                :disabled="isLoggingIn"
                @click="handleGoogleSignInClick"
              >
                <span class="google-signin-icon" aria-hidden="true">G</span>
                <span>Sign in with Google</span>
              </button>
              <div ref="googleButtonRef" class="google-login-btn"></div>
              <p v-if="googleLoginError" class="google-login-error">{{ googleLoginError }}</p>
            </div>
            
            <div class="signup-prompt">
              <span class="prompt-text">Don't have an account?</span>
              <a href="/register" class="signup-link">Create Account</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue'
import { login, googleLogin } from '../../api/module/web/login'
import { useUserStore } from '../../store/user'
import { getGoogleClientId, renderGoogleSignInButton, openGoogleSignIn } from '../../utils/googleAuth'

const router = useRouter();
const userStore = useUserStore()

const loginUsername = ref('');
const loginPassword = ref('');
const usernameError = ref('');
const passwordError = ref('');
const isLoggingIn = ref(false);
const googleButtonRef = ref<HTMLElement | null>(null);
const googleLoginError = ref('');

const completeLogin = async (response: any) => {
  if (response.success) {
    userStore.token = response.session_token;
    userStore.userInfo = response.data;
    try {
      await userStore.initUserInfo();
    } catch (userInfoError) {
      console.error('Failed to initialize user info:', userInfoError);
    }
    router.push('/vip');
    return true;
  }

  alert(response.message || 'Login failed. Please try again.');
  return false;
};

onMounted(async () => {
  await nextTick();

  if (!googleButtonRef.value || !getGoogleClientId()) {
    return;
  }

  try {
    await renderGoogleSignInButton(googleButtonRef.value, handleGoogleCredential);
  } catch (error) {
    console.error('Google login init failed:', error);
  }
});

const handleGoogleSignInClick = async () => {
  try {
    googleLoginError.value = '';
    const started = await openGoogleSignIn(handleGoogleCredential);
    if (!started) {
      googleLoginError.value = 'Google sign-in is temporarily unavailable.';
    }
  } catch (error) {
    console.error('Google login click failed:', error);
    googleLoginError.value = 'Google sign-in is temporarily unavailable.';
  }
};

const handleGoogleCredential = async (credential: string) => {
  try {
    isLoggingIn.value = true;
    googleLoginError.value = '';
    const response = await googleLogin({ credential });
    await completeLogin(response);
  } catch (error) {
    console.error('Google login error:', error);
    alert('Google sign-in failed. Please try again later.');
  } finally {
    isLoggingIn.value = false;
  }
};

const handleLogin = async () => {
  usernameError.value = '';
  passwordError.value = '';
  
  if (!loginUsername.value.trim()) {
    usernameError.value = 'Username is required';
    return;
  }
  
  if (!loginPassword.value.trim()) {
    passwordError.value = 'Password is required';
    return;
  }
  
  try {
    isLoggingIn.value = true;
    
    let logindata = {
      username: loginUsername.value,
      password_hash: loginPassword.value
    }
    
    const response = await login(logindata);
    const success = await completeLogin(response);
    if (!success) {
      isLoggingIn.value = false;
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again later.');
    isLoggingIn.value = false;
  } finally {
    isLoggingIn.value = false;
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

.login-wrapper {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
}

.login-card {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.6s ease;
}

/* 左侧装饰区域 */
.login-decoration {
  background: var(--primary-gradient);
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
}

/* 右侧表单区域 */
.login-form-section {
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
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.form-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 16px;
  background: var(--primary-gradient);
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-icon {
  font-size: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.signup-prompt {
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

.signup-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all var(--transition-base);
}

.signup-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.google-login-wrap {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.google-signin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: #fff;
  color: #1f1f1f;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.google-signin-btn:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: var(--shadow-sm);
}

.google-signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-signin-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.google-login-btn {
  display: none;
}

.google-login-error {
  color: var(--color-danger);
  font-size: 13px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  
  .login-decoration {
    display: none;
  }
  
  .login-form-section {
    padding: var(--spacing-xl);
  }
  
  .form-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: var(--spacing-md);
  }
  
  .login-form-section {
    padding: var(--spacing-lg);
  }
  
  .form-title {
    font-size: 22px;
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
