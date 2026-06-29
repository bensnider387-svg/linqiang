<template>
  <div class="document-page-container">
    <navcomponent />

    <div class="document-page-wrapper">
      <div class="document-hero-banner">
        <div class="hero-content">
          <div class="hero-icon-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1 class="hero-title">Document Library</h1>
          <p class="hero-description">
            Access trading guides, reports, and educational documents in one place
          </p>
          <div class="hero-stats">
            <div class="hero-stat-badge">
              <span class="stat-number">{{ Object.keys(documentslist).length || 0 }}</span>
              <span class="stat-text">Total Documents</span>
            </div>
            <div class="hero-stat-badge vip">
              <span class="stat-number">{{ Object.values(documentslist).filter((d) => isVipContent(d)).length || 0 }}</span>
              <span class="stat-text">VIP Content</span>
            </div>
          </div>
        </div>
      </div>

      <div class="document-content-area">
        <aside class="document-sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">Filter</h3>
            <div class="filter-group">
              <button
                class="filter-option"
                :class="{ active: activeFilter === 'all' }"
                @click="setFilter('all')"
              >
                <span class="filter-icon">📄</span>
                <span>All Documents</span>
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

        <main class="document-main-area">
          <div class="document-list-container">
            <div class="document-item" v-for="value in filteredDocuments" :key="value.id">
              <div class="document-preview-container" @click="previewDocument(value)">
                <div class="document-preview-wrapper">
                  <div class="document-preview-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div class="document-overlay">
                    <div class="open-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </div>
                  <div v-if="isVipContent(value)" class="document-vip-tag">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      />
                    </svg>
                    VIP
                  </div>
                  <div class="document-type-badge">{{ getFileType(value.file_url) }}</div>
                </div>
              </div>

              <div class="document-details">
                <div class="document-header-info">
                  <h3 class="document-name">{{ value.title }}</h3>
                  <p class="document-summary">{{ value.description }}</p>
                </div>

                <div class="document-footer-info">
                  <div class="document-meta-info">
                    <span class="meta-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {{ formatUSDate(value.last_update) }}
                    </span>
                    <span class="meta-tag" v-if="value.pages">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      {{ value.pages }} pages
                    </span>
                    <span class="meta-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {{ getFileSize(value.file_size) }}
                    </span>
                  </div>

                  <div class="document-actions-row">
                    <button class="document-action-button" @click.stop="previewDocument(value)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Preview
                    </button>
                    <button class="document-secondary-button" @click.stop="downloadDocument(value)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>

                <div class="document-progress" v-if="value.progress">
                  <div class="progress-info">
                    <span>Reading Progress</span>
                    <span>{{ value.progress }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: value.progress + '%' }"></div>
                  </div>
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
import { getdocuments } from '../../api/module/web/index';
import { useUserStore } from '@/store';
import {
  ensureContentAccess,
  isPublicContent,
  isVipContent,
} from '@/utils/contentAccess';
import { formatUSDate } from '@/utils/dateFormat';

const userStore = useUserStore();
const router = useRouter();
const documentslist = ref<Record<string, any>>({});
const filteredDocuments = ref<Record<string, any>>({});
const activeFilter = ref('all');

onMounted(() => {
  getVipDashboardData();
});

const getVipDashboardData = async () => {
  const res = await getdocuments(null);
  if (res.success) {
    let docsData = res.data;
    if (Array.isArray(docsData)) {
      docsData = docsData.reduce((acc: Record<string, any>, doc: any, index: number) => {
        acc[index] = doc;
        return acc;
      }, {});
    }
    documentslist.value = docsData;
    filteredDocuments.value = docsData;
  }
};

const setFilter = (filter: string) => {
  activeFilter.value = filter;

  if (filter === 'all') {
    filteredDocuments.value = documentslist.value;
  } else if (filter === 'free') {
    filteredDocuments.value = Object.keys(documentslist.value).reduce((acc, key) => {
      if (isPublicContent(documentslist.value[key])) {
        acc[key] = documentslist.value[key];
      }
      return acc;
    }, {} as Record<string, any>);
  } else if (filter === 'vip') {
    filteredDocuments.value = Object.keys(documentslist.value).reduce((acc, key) => {
      if (isVipContent(documentslist.value[key])) {
        acc[key] = documentslist.value[key];
      }
      return acc;
    }, {} as Record<string, any>);
  }
};

const getFileType = (url: string) => {
  if (!url) return 'FILE';
  const extension = url.split('.').pop()?.toUpperCase();
  return extension || 'FILE';
};

const getFileSize = (size: number) => {
  if (!size) return '< 1 MB';
  if (size < 1024) return size + ' KB';
  if (size < 1024 * 1024) return Math.round(size / 1024) + ' KB';
  return Math.round(size / (1024 * 1024)) + ' MB';
};

const previewDocument = (doc: any) => {
  if (!ensureContentAccess(doc, userStore, router, 'document')) {
    return;
  }

  if (!doc.file_url) {
    console.error('No file URL available');
    return;
  }

  const fileType = getFileType(doc.file_url).toLowerCase();

  const previewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');

  if (previewWindow) {
    let previewContent = '';

    if (fileType === 'pdf') {
      previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${doc.title}</title>
          <style>
            body { margin: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .header { background: #1a1a2e; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 1.2rem; font-weight: 600; }
            .download-btn { background: #FFD700; color: #181F2A; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .preview-container { width: 100%; height: calc(100vh - 70px); border: none; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${doc.title}</div>
            <a href="${doc.file_url}" download class="download-btn">Download</a>
          </div>
          <iframe src="${doc.file_url}" class="preview-container"></iframe>
        </body>
        </html>
      `;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
      previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${doc.title}</title>
          <style>
            body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            img { max-width: 90%; max-height: 90%; object-fit: contain; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
            .header { position: fixed; top: 0; left: 0; right: 0; background: rgba(26, 26, 46, 0.9); color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(10px); z-index: 100; }
            .download-btn { background: #FFD700; color: #181F2A; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>${doc.title}</div>
            <a href="${doc.file_url}" download class="download-btn">Download</a>
          </div>
          <img src="${doc.file_url}" alt="${doc.title}">
        </body>
        </html>
      `;
    } else {
      previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${doc.title}</title>
          <style>
            body { margin: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .header { background: #1a1a2e; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 1.2rem; font-weight: 600; }
            .download-btn { background: #FFD700; color: #181F2A; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .preview-container { width: 100%; height: calc(100vh - 70px); border: none; }
            .fallback { padding: 40px; text-align: center; color: #666; }
            .fallback a { color: #FFD700; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${doc.title}</div>
            <a href="${doc.file_url}" download class="download-btn">Download</a>
          </div>
          <iframe src="${doc.file_url}" class="preview-container"></iframe>
          <div class="fallback" style="display:none;">
            <h3>Preview not available</h3>
            <p>This file type cannot be previewed in the browser.</p>
            <a href="${doc.file_url}" download>Click here to download the file</a>
          </div>
        </body>
        </html>
      `;
    }

    previewWindow.document.write(previewContent);
    previewWindow.document.close();
  }
};

const downloadDocument = (doc: any) => {
  if (!ensureContentAccess(doc, userStore, router, 'document')) {
    return;
  }

  if (!doc.file_url) {
    console.error('No file URL available');
    return;
  }

  const link = window.document.createElement('a');
  link.href = doc.file_url;
  link.download = doc.title || 'document';
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
};
</script>

<style scoped>
.document-page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  width: 100%;
}

.document-page-wrapper {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.document-hero-banner {
  position: relative;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
}

.document-hero-banner::before {
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

.document-content-area {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

.document-sidebar {
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

.document-main-area {
  min-width: 0;
}

.document-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.document-item {
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

.document-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
}

.document-preview-container {
  flex-shrink: 0;
  width: 320px;
  cursor: pointer;
}

.document-preview-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
}

.document-preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  background: linear-gradient(145deg, rgba(102, 126, 234, 0.35) 0%, rgba(118, 75, 162, 0.45) 100%);
}

.document-preview-placeholder svg {
  width: 72px;
  height: 72px;
  opacity: 0.95;
}

.document-overlay {
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

.document-preview-wrapper:hover .document-overlay {
  opacity: 1;
}

.open-indicator {
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

.document-preview-wrapper:hover .open-indicator {
  transform: scale(1);
}

.open-indicator svg {
  width: 28px;
  height: 28px;
}

.document-vip-tag {
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

.document-vip-tag svg {
  width: 14px;
  height: 14px;
}

.document-type-badge {
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

.document-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.document-header-info {
  flex: 1;
}

.document-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.document-summary {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.document-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  gap: 16px;
  flex-wrap: wrap;
}

.document-meta-info {
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

.document-actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.document-action-button {
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

.document-action-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.document-action-button svg {
  width: 18px;
  height: 18px;
}

.document-secondary-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.document-secondary-button:hover {
  border-color: rgba(102, 126, 234, 0.35);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.document-secondary-button svg {
  width: 18px;
  height: 18px;
}

.document-progress {
  margin-top: 4px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (max-width: 1024px) {
  .document-content-area {
    grid-template-columns: 240px 1fr;
    gap: 30px;
    padding: 40px 30px;
  }

  .document-preview-container {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .document-hero-banner {
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

  .document-content-area {
    grid-template-columns: 1fr;
    padding: 24px 16px 48px;
    gap: 24px;
  }

  .document-sidebar {
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

  .document-item {
    flex-direction: column;
    padding: 20px;
  }

  .document-preview-container {
    width: 100%;
  }

  .document-footer-info {
    flex-direction: column;
    align-items: stretch;
  }

  .document-actions-row {
    width: 100%;
    flex-direction: column;
  }

  .document-action-button,
  .document-secondary-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .document-hero-banner {
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

  .document-content-area {
    padding: 20px 12px 40px;
  }

  .document-item {
    padding: 14px;
  }

  .document-name {
    font-size: 17px;
  }

  .filter-option {
    min-width: 0;
    flex: 1 1 calc(50% - 8px);
    font-size: 13px;
    padding: 10px 8px;
  }

  .document-summary {
    font-size: 13px;
  }
}
</style>
