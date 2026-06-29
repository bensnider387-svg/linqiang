<template>
  <div class="video-page-container">
    <navcomponent />
    
    <!-- 全新的视频页面布局 -->
    <div class="video-page-wrapper">
      <!-- 顶部横幅区域 -->
      <div class="video-hero-banner">
        <div class="hero-content">
          <div class="hero-icon-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <h1 class="hero-title">Video Library</h1>
          <p class="hero-description">Learn from expert traders through comprehensive video tutorials</p>
          <div class="hero-stats">
            <div class="hero-stat-badge">
              <span class="stat-number">{{ Object.keys(vedioslist).length || 0 }}</span>
              <span class="stat-text">Total Videos</span>
            </div>
            <div class="hero-stat-badge vip">
              <span class="stat-number">{{ Object.values(vedioslist).filter(v => isVipContent(v)).length || 0 }}</span>
              <span class="stat-text">VIP Content</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="video-content-area">
        <!-- 侧边栏筛选 -->
        <aside class="video-sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">Filter</h3>
            <div class="filter-group">
              <button 
                class="filter-option" 
                :class="{ active: activeFilter === 'all' }"
                @click="setFilter('all')"
              >
                <span class="filter-icon">📺</span>
                <span>All Videos</span>
              </button>
              <button 
                class="filter-option" 
                :class="{ active: activeFilter === 'free' }"
                @click="setFilter('free')"
              >
                <span class="filter-icon">🔓</span>
                <span>Free Access</span>
              </button>
              <button 
                class="filter-option" 
                :class="{ active: activeFilter === 'vip' }"
                @click="setFilter('vip')"
              >
                <span class="filter-icon">⭐</span>
                <span>VIP Only</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- 主内容区域 -->
        <main class="video-main-area">
          <div class="video-list-container">
            <div class="video-item" v-for="value in filteredVideos" :key="value.id">
              <div class="video-preview-container" @click="playVideo($event, value)">
                <div class="video-preview-wrapper">
                  <video 
                    :src="canAccessContent(value, userStore) ? value.video_url : ''" 
                    :poster="value.thumbnail || ''"
                    preload="metadata"
                    class="video-preview"
                    :controls="false"
                    ref="videoPlayer"
                  ></video>
                  <div class="video-overlay" :class="{ 'playing': value.isPlaying }">
                    <div class="play-indicator">
                      <svg v-if="!value.isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    </div>
                  </div>
                  <div v-if="isVipContent(value)" class="video-vip-tag">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                    </svg>
                    VIP
                  </div>
                  <div class="video-duration-badge" v-if="value.duration">{{ value.duration }}</div>
                </div>
              </div>
              
              <div class="video-details">
                <div class="video-header-info">
                  <h3 class="video-name">{{ value.title }}</h3>
                  <p class="video-summary">{{ value.description }}</p>
                </div>
                
                <div class="video-footer-info">
                  <div class="video-meta-info">
                    <span class="meta-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {{ formatUSDate(value.last_update) }}
                    </span>
                    <span class="meta-tag" v-if="value.difficulty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                        <path d="M2 17L12 22L22 17"></path>
                        <path d="M2 12L12 17L22 12"></path>
                      </svg>
                      {{ value.difficulty }}
                    </span>
                  </div>
                  
                  <button class="video-action-button" @click.stop="watchVideo(value)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Watch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    
    <PartnerOrganizations />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue';
import PartnerOrganizations from '@/components/PartnerOrganizations.vue';
import { getvideos } from '../../api/module/web/index';
import { useUserStore } from '@/store';
import {
  canAccessContent,
  ensureContentAccess,
  isPublicContent,
  isVipContent,
} from '@/utils/contentAccess';
import { formatUSDate } from '@/utils/dateFormat';

const userStore = useUserStore();
const router = useRouter();
let vedioslist = ref({});
let filteredVideos = ref({});
let activeFilter = ref('all');

onMounted(() => {
  getVipDashboardData();
});

const getVipDashboardData = async () => {
  const res = await getvideos(null);
  if (res.success) {
    let videosData = res.data;
    if (Array.isArray(videosData)) {
      videosData = videosData.reduce((acc, video, index) => {
        acc[index] = video;
        return acc;
      }, {} as any);
    }
    const videosWithState = Object.keys(videosData).reduce((acc, key) => {
      acc[key] = {
        ...videosData[key],
        isPlaying: false
      };
      return acc;
    }, {} as any);
    vedioslist.value = videosWithState;
    filteredVideos.value = videosWithState;
  }
};

const setFilter = (filter: string) => {
  activeFilter.value = filter;
  
  if (filter === 'all') {
    filteredVideos.value = vedioslist.value;
  } else if (filter === 'free') {
    filteredVideos.value = Object.keys(vedioslist.value).reduce((acc, key) => {
      if (isPublicContent(vedioslist.value[key])) {
        acc[key] = vedioslist.value[key];
      }
      return acc;
    }, {} as any);
  } else if (filter === 'vip') {
    filteredVideos.value = Object.keys(vedioslist.value).reduce((acc, key) => {
      if (isVipContent(vedioslist.value[key])) {
        acc[key] = vedioslist.value[key];
      }
      return acc;
    }, {} as any);
  }
};

const playVideo = (event: Event, videoData: any) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!ensureContentAccess(videoData, userStore, router, 'video')) {
    return;
  }
  
  const thumbnail = event.currentTarget as HTMLElement;
  const video = thumbnail.querySelector('video') as HTMLVideoElement;
  
  if (!video || !video.src) {
    console.error('视频元素不存在或没有视频源');
    return;
  }

  const allVideos = document.querySelectorAll('video');
  allVideos.forEach((v, index) => {
    if (v !== video && !v.paused) {
      v.pause();
      const otherVideoData = Object.values(vedioslist.value)[index];
      if (otherVideoData) {
        otherVideoData.isPlaying = false;
      }
    }
  });

  try {
    if (video.paused) {
      video.controls = true;
      video.play().then(() => {
        videoData.isPlaying = true;
        console.log('视频开始播放');
      }).catch((error) => {
        console.error('播放失败:', error);
        videoData.isPlaying = false;
        video.controls = false;
      });
    } else {
      video.pause();
      videoData.isPlaying = false;
      video.controls = false;
    }
  } catch (error) {
    console.error('视频操作失败:', error);
  }

  video.addEventListener('pause', () => {
    videoData.isPlaying = false;
  });
  
  video.addEventListener('ended', () => {
    videoData.isPlaying = false;
    video.controls = false;
  });
};

const watchVideo = (videoData: any) => {
  console.log('观看视频:', videoData);
  
  if (!ensureContentAccess(videoData, userStore, router, 'video')) {
    return;
  }
  
  if (videoData.video_url) {
    const videoWindow = window.open('', '_blank', 'width=800,height=600');
    if (videoWindow) {
      videoWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${videoData.title}</title>
          <style>
            body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
            video { max-width: 100%; max-height: 100%; }
          </style>
        </head>
        <body>
          <video controls autoplay style="width: 100%; height: auto;">
            <source src="${videoData.video_url}" type="video/mp4">
            Your browser does not support video playback.
          </video>
        </body>
        </html>
      `);
      videoWindow.document.close();
    }
  }
};
</script>

<style scoped>
.video-page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  width: 100%;
}

/* 全新的视频页面布局 */
.video-page-wrapper {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* 顶部横幅区域 */
.video-hero-banner {
  position: relative;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
}

.video-hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.hero-icon-large {
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.hero-icon-large svg {
  width: 50px;
  height: 50px;
}

.hero-title {
  font-size: 56px;
  font-weight: 900;
  color: white;
  margin: 0 0 20px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
}

.hero-description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.hero-stat-badge {
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 150px;
}

.hero-stat-badge.vip {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: white;
}

.stat-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 内容区域 */
.video-content-area {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* 侧边栏 */
.video-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-md);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
}

.filter-option:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  color: var(--text-primary);
  transform: translateX(4px);
}

.filter-option.active {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
  box-shadow: var(--shadow-md);
}

.filter-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

/* 主内容区域 */
.video-main-area {
  min-width: 0;
}

.video-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-item {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  display: flex;
  gap: 24px;
  padding: 24px;
}

.video-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
}

.video-preview-container {
  flex-shrink: 0;
  width: 320px;
  cursor: pointer;
}

.video-preview-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.video-preview-wrapper:hover .video-overlay {
  opacity: 1;
}

.video-overlay.playing {
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
}

.play-indicator {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transform: scale(0.9);
  transition: transform var(--transition-base);
}

.video-preview-wrapper:hover .play-indicator {
  transform: scale(1);
}

.play-indicator svg {
  width: 28px;
  height: 28px;
}

.video-vip-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.video-vip-tag svg {
  width: 14px;
  height: 14px;
}

.video-duration-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.video-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.video-header-info {
  flex: 1;
}

.video-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.video-summary {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.video-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.video-meta-info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-tag svg {
  width: 14px;
  height: 14px;
}

.video-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--border-radius);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.video-action-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.video-action-button svg {
  width: 18px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .video-content-area {
    grid-template-columns: 240px 1fr;
    gap: 30px;
    padding: 40px 30px;
  }
  
  .video-preview-container {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .video-hero-banner {
    padding: 48px 20px 36px;
  }
  
  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2.25rem);
  }
  
  .hero-description {
    font-size: 15px;
  }
  
  .hero-stats {
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero-stat-badge {
    padding: 14px 18px;
    min-width: 0;
    flex: 1 1 calc(50% - 12px);
    max-width: calc(50% - 6px);
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .video-content-area {
    grid-template-columns: 1fr;
    padding: 24px 16px 48px;
    gap: 24px;
  }
  
  .video-sidebar {
    position: static;
  }
  
  .filter-group {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .filter-option {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
  
  .video-item {
    flex-direction: column;
    padding: 20px;
  }
  
  .video-preview-container {
    width: 100%;
  }
  
  .video-footer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .video-action-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .video-hero-banner {
    padding: 40px 16px 28px;
  }

  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 14px;
  }
  
  .hero-stat-badge {
    flex: 1 1 100%;
    max-width: 100%;
    padding: 12px 16px;
  }
  
  .stat-number {
    font-size: 22px;
  }
  
  .video-content-area {
    padding: 20px 12px 40px;
  }
  
  .video-item {
    padding: 14px;
  }
  
  .video-name {
    font-size: 17px;
  }
  
  .video-summary {
    font-size: 13px;
  }

  .filter-option {
    min-width: 0;
    flex: 1 1 calc(50% - 8px);
    font-size: 13px;
    padding: 10px 8px;
  }
}
</style>
