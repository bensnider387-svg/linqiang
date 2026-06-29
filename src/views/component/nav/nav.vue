<template>
  <nav class="modern-nav" :class="{ 'nav-menu-open': mobileMenuOpen }">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-logo">
        <a :href="trader_profiles.home_top_title_link || '/'" class="logo-link">
          <div class="logo-icon">
            <img src="/logo.png" alt="Logo" class="logo-img" />
          </div>
          <span class="logo-text">{{ trader_profiles.home_top_title || 'Trading Platform' }}</span>
        </a>
      </div>

      <!-- 桌面端导航菜单 -->
      <div class="nav-menu desktop-menu">
        <a href="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">Home</span>
        </a>
        <a href="/videos" class="nav-item">
          <span class="nav-icon">🎬</span>
          <span class="nav-label">Videos</span>
        </a>
        <a href="/documents" class="nav-item">
          <span class="nav-icon">📄</span>
          <span class="nav-label">Docs</span>
        </a>
        <a href="/AITools" class="nav-item">
          <span class="nav-icon">📝</span>
          <span class="nav-label">Quiz</span>
        </a>
        <a href="/vip" class="nav-item nav-item-vip">
          <span class="nav-icon">💎</span>
          <span class="nav-label">VIP</span>
        </a>
      </div>

      <!-- 右侧操作区 -->
      <div class="nav-actions">
        <button v-if="userrole=='admin' || userrole=='superadmin'" @click="toadmin" class="btn-admin">
          <span>⚙️</span>
          <span>Admin</span>
        </button>
        <button @click="loginto" class="btn-login">
          <span>{{ logintext }}</span>
        </button>
        
        <!-- 移动端菜单按钮 -->
        <button type="button" class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu" :aria-expanded="mobileMenuOpen">
          <span class="menu-icon" :class="{ active: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单挂载到 body，避免被导航栏 backdrop-filter 限制 -->
    <Teleport to="body">
      <div
        v-if="mobileMenuOpen"
        class="mobile-menu active"
        @click.self="closeMobileMenu"
      >
        <div class="mobile-menu-content" @click.stop>
          <div class="mobile-menu-header">
            <div class="mobile-menu-title">Menu</div>
            <button type="button" class="mobile-menu-close" @click="closeMobileMenu" aria-label="Close menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="mobile-menu-body">
            <a href="/" class="mobile-nav-item" @click="closeMobileMenu">
              <span class="nav-icon">🏠</span>
              <span>Home</span>
            </a>
            <a href="/videos" class="mobile-nav-item" @click="closeMobileMenu">
              <span class="nav-icon">🎬</span>
              <span>Videos</span>
            </a>
            <a href="/documents" class="mobile-nav-item" @click="closeMobileMenu">
              <span class="nav-icon">📄</span>
              <span>Documents</span>
            </a>
            <a href="/AITools" class="mobile-nav-item" @click="closeMobileMenu">
              <span class="nav-icon">📝</span>
              <span>Trading Quiz</span>
            </a>
            <a href="/vip" class="mobile-nav-item mobile-nav-item-vip" @click="closeMobileMenu">
              <span class="nav-icon">💎</span>
              <span>VIP Center</span>
            </a>
            <button
              v-if="userrole=='admin' || userrole=='superadmin'"
              type="button"
              @click="toadmin"
              class="mobile-nav-item mobile-btn-admin"
            >
              <span class="nav-icon">⚙️</span>
              <span>Admin Panel</span>
            </button>
            <button type="button" @click="loginto" class="mobile-nav-item mobile-btn-login">
              <span>{{ logintext }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { gettrader_profiles } from '../../../api/module/web/index'
import { useUserStore } from '@/store';

const trader_profiles = ref({});
const userStore = useUserStore()
const islogin = ref(false);
const logintext = ref('Login');
const router = useRouter();
const userrole = ref('');
const mobileMenuOpen = ref(false);

onMounted(() => {
  if(userStore.token){
    islogin.value = true;
    logintext.value = 'Logout'
    userrole.value = userStore.userInfo.role
  }
  
  try {
    let indexdata;
    if (typeof userStore.indexData === 'string') {
      indexdata = JSON.parse(userStore.indexData || '{}');
    } else {
      indexdata = userStore.indexData || {};
    }
    if(indexdata){
      trader_profiles.value = indexdata.trader_profiles;
      document.title = indexdata.trader_profiles?.website_title || document.title;
    }
  } catch(error) {
    console.log(error)
  }

  getindexdata()
});

const toadmin = () => {
  router.push('/system/userStatistics')
  closeMobileMenu();
}

const getindexdata = async() => {
  const res = await gettrader_profiles();
  if(res.success && res.data?.trader_profiles){
    trader_profiles.value = res.data.trader_profiles;
    document.title = res.data.trader_profiles.website_title || document.title;
  }
};

const loginto = () => {
  if(islogin.value){
    userStore.token = null;
    userStore.userInfo = null;
    islogin.value = false;
    router.push('/userlogin');
  } else {
    router.push('/userlogin');
  }
  closeMobileMenu();
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
}

watch(mobileMenuOpen, (open) => {
  document.body.classList.toggle('mobile-nav-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.classList.remove('mobile-nav-open');
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modern-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 14, 39, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  padding-top: env(safe-area-inset-top, 0px);
}

.modern-nav.nav-menu-open {
  z-index: 2100;
}

.modern-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: -1;
  pointer-events: none;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* Logo区域 */
.nav-logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  transform: scale(1.12);
  filter: drop-shadow(0 0 6px rgba(33, 96, 230, 0.35));
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* 桌面端导航菜单 */
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: -1;
}

.nav-item:hover {
  color: var(--text-primary);
  transform: translateY(-2px);
}

.nav-item:hover::before {
  opacity: 0.15;
}

.nav-item-vip {
  background: var(--secondary-gradient);
  color: white;
  font-weight: 600;
}

.nav-item-vip::before {
  display: none;
}

.nav-item-vip:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(250, 112, 154, 0.3);
}

.nav-icon {
  font-size: 18px;
  line-height: 1;
}

.nav-label {
  white-space: nowrap;
}

/* 右侧操作区 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn-admin {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-admin:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.btn-login {
  padding: 10px 24px;
  background: var(--primary-gradient);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-btn:hover {
  background: var(--bg-glass-hover);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.mobile-menu-btn:active {
  transform: scale(0.95);
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 20px;
  height: 16px;
  position: relative;
}

.menu-icon span {
  width: 100%;
  height: 2.5px;
  background: var(--text-primary);
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.menu-icon.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background: var(--color-primary);
}

.menu-icon.active span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.menu-icon.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background: var(--color-primary);
}

/* 移动端侧栏菜单（Teleport 到 body） */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.mobile-menu::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.mobile-menu-content {
  position: relative;
  width: min(320px, 85vw);
  height: 100%;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  animation: mobileMenuSlideIn 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes mobileMenuSlideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-menu-header {
  padding: calc(16px + env(safe-area-inset-top, 0px)) 16px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-glass);
  flex-shrink: 0;
}

.mobile-menu-title {
  font-size: 18px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-menu-close {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 8px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-close:hover {
  background: var(--bg-glass-hover);
  transform: rotate(90deg);
}

.mobile-menu-close svg {
  width: 20px;
  height: 20px;
}

.mobile-menu-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  min-height: 48px;
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  transition: background var(--transition-base), border-color var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.mobile-nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-gradient);
  transform: scaleY(0);
  transition: transform var(--transition-base);
}

.mobile-nav-item:hover,
.mobile-nav-item:active {
  background: var(--bg-glass-hover);
  border-color: rgba(102, 126, 234, 0.3);
}

.mobile-nav-item:hover::before,
.mobile-nav-item:active::before {
  transform: scaleY(1);
}

.mobile-nav-item .nav-icon {
  font-size: 22px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.mobile-nav-item-vip {
  background: var(--secondary-gradient);
  border: none;
  color: white;
  font-weight: 600;
}

.mobile-nav-item-vip::before {
  display: none;
}

.mobile-nav-item-vip .nav-icon {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-btn-admin {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.mobile-btn-admin .nav-icon {
  background: rgba(102, 126, 234, 0.2);
}

.mobile-btn-login {
  background: var(--primary-gradient);
  border: none;
  color: white;
  font-weight: 600;
  justify-content: center;
  margin-top: auto;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.mobile-btn-login::before {
  display: none;
}

.mobile-btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 响应式 */
@media (max-width: 1024px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .logo-text {
    max-width: 150px;
  }
  
  .nav-actions {
    gap: 8px;
  }
  
  .btn-admin span:last-child {
    display: none;
  }
  
  .btn-admin {
    padding: 10px 12px;
    min-width: 44px;
    min-height: 44px;
  }
  
  .btn-login {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 12px 16px;
    gap: 12px;
    min-height: 52px;
  }
  
  .logo-icon {
    width: 44px;
    height: 44px;
  }
  
  .logo-text {
    font-size: 16px;
    max-width: 140px;
  }

  .btn-login,
  .btn-admin {
    display: none;
  }
  
  .mobile-menu-content {
    width: min(300px, 80vw);
  }
  
  .mobile-menu-header {
    padding: calc(14px + env(safe-area-inset-top, 0px)) 14px 14px;
  }
  
  .mobile-menu-title {
    font-size: 16px;
  }
  
  .mobile-menu-body {
    padding: 12px;
    gap: 6px;
  }
  
  .mobile-nav-item {
    padding: 14px;
    font-size: 15px;
    min-height: 48px;
  }
  
  .mobile-nav-item .nav-icon {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 10px 12px;
  }
  
  .logo-text {
    font-size: 14px;
    max-width: 100px;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .mobile-menu-btn {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
  }
  
  .menu-icon {
    width: 18px;
    height: 14px;
    gap: 4px;
  }
  
  .mobile-menu-content {
    width: min(300px, 88vw);
  }
  
  .mobile-nav-item {
    padding: 12px;
    font-size: 14px;
  }
}

</style>
