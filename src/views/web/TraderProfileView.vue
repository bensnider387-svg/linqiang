<template>
  <div class="app-container">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark mb-3">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-graph-up me-2"></i>
          Expert Trader Profile
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="/AITools" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-patch-question me-1"></i>
            Trading Quiz
          </a>
          <a class="nav-link" href="/vip" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-crown me-1"></i>
            VIP Membership
          </a>
          <a class="nav-link" href="/login" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Login
          </a>
          <a class="nav-link" href="/register" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-person-plus me-1"></i>
            Register
          </a>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Profile Section -->
      <div class="profile-section mb-5">
        <div class="profile-header">
          <div class="profile-main">
            <div class="profile-avatar" @click="openAvatarPreview">
              <img src="https://via.placeholder.com/150" alt="Avatar" class="avatar-img">
              <div class="online-status"></div>
              <button class="avatar-upload" @click.stop="triggerAvatarUpload">
                <i class="bi bi-camera-fill"></i>
              </button>
              <input type="file" ref="avatarUpload" class="avatar-upload-input" accept="image/*" @change="handleAvatarUpload">
            </div>
            <div class="profile-details">
              <h1 class="profile-name">John Trader</h1>
              <div class="profile-title">Professional Stock & Crypto Trader</div>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">5</span>
                  <span class="stat-label">Years of Experience</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">500+</span>
                  <span class="stat-label">Total Trades</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">75%</span>
                  <span class="stat-label">Win Rate</span>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-performance">
            <div class="performance-card">
              <div class="performance-header">
                <i class="bi bi-briefcase"></i>
                <span>Active Positions</span>
              </div>
              <div class="performance-value">
                5
              </div>
            </div>
            <div class="performance-card">
              <div class="performance-header">
                <i class="bi bi-calendar-check"></i>
                <span>Monthly P&L</span>
              </div>
              <div class="performance-value">
                +$12,500.00
              </div>
            </div>
            <div class="performance-card">
              <div class="performance-header">
                <i class="bi bi-graph-up"></i>
                <span>Total P&L</span>
              </div>
              <div class="performance-value">
                +$89,320.50
              </div>
            </div>
          </div>
        </div>

        <!-- Strategy Update Section -->
        <div class="strategy-update">
          <div class="strategy-header">
            <h3><i class="bi bi-lightbulb glow-bulb"></i> Today's Trading Strategy</h3>
            <span class="update-time">Updated at: {{ formatUSTime(new Date().toISOString()) }}</span>
          </div>
          <div class="strategy-content">
            <div class="market-analysis">
              <h4>Market Analysis</h4>
              <p>The market shows signs of bullish momentum after yesterday's consolidation. Key indices are approaching all-time highs, supported by strong earnings reports from tech giants. However, volatility is expected to increase ahead of the Fed's interest rate decision.</p>
            </div>
            <div class="trading-focus">
              <h4>Focus Areas</h4>
              <ul>
                <li>Tech sector momentum plays</li>
                <li>Energy stocks with strong fundamentals</li>
                <li>Crypto assets showing accumulation</li>
                <li>Defensive stocks as hedge positions</li>
              </ul>
            </div>
            <div class="risk-warning">
              <h4>Risk Warning</h4>
              <p>Trading involves significant risk of loss. Past performance is not indicative of future results. Always use proper risk management and never invest more than you can afford to lose.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trading Record Divider -->
      <div class="trade-separator">
        <h3><i class="bi bi-clipboard-data"></i> Trading Records (Last 3 Months)</h3>
        <div class="divider-line"></div>
      </div>

      <!-- Stock Trading Cards - Active Trades -->
     
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="stock-info">
              <span class="badge bg-success">NASDAQ</span>
              <div>
                <div class="stock-symbol">AAPL</div>
                <div class="stock-name">Apple Inc.</div>
              </div>
              <span class="badge bg-success status-badge">Active</span>
            </div>

            <img src="https://via.placeholder.com/600x300?text=AAPL+Chart" alt="AAPL" class="trade-screenshot" @click="openImageModal('AAPL', 'Apple Inc.')">
            
            <div class="secondary-info">
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Date</span>
                <span class="secondary-info-value">2023-11-10</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Price</span>
                <span class="secondary-info-value">$187.50</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Current Price</span>
                <span class="secondary-info-value">$192.75</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Quantity</span>
                <span class="secondary-info-value">100</span>
              </div>
            </div>

            <div class="main-stats">
              <div class="main-stat-item">
                <div class="main-stat-label">Entry Amount</div>
                <div class="main-stat-value">$18,750.00</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">Market Value</div>
                <div class="main-stat-value">$19,275.00</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Ratio</div>
                <div class="main-stat-value ">2.79%</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Amount</div>
                <div class="main-stat-value ">+$525.00</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="stock-info">
              <span class="badge bg-success">NASDAQ</span>
              <div>
                <div class="stock-symbol">MSFT</div>
                <div class="stock-name">Microsoft Corp.</div>
              </div>
              <span class="badge bg-success status-badge">Active</span>
            </div>

            <img src="https://via.placeholder.com/600x300?text=MSFT+Chart" alt="MSFT" class="trade-screenshot" @click="openImageModal('MSFT', 'Microsoft Corp.')">
            
            <div class="secondary-info">
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Date</span>
                <span class="secondary-info-value">2023-11-05</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Price</span>
                <span class="secondary-info-value">$374.20</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Current Price</span>
                <span class="secondary-info-value">$382.45</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Quantity</span>
                <span class="secondary-info-value">50</span>
              </div>
            </div>

            <div class="main-stats">
              <div class="main-stat-item">
                <div class="main-stat-label">Entry Amount</div>
                <div class="main-stat-value">$18,710.00</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">Market Value</div>
                <div class="main-stat-value">$19,122.50</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Ratio</div>
                <div class="main-stat-value ">2.20%</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Amount</div>
                <div class="main-stat-value ">+$412.50</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Trading Cards - Closed Trades -->
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="stock-info">
              <span class="badge bg-success">NASDAQ</span>
              <div>
                <div class="stock-symbol">TSLA</div>
                <div class="stock-name">Tesla Inc.</div>
              </div>
              <span class="badge bg-info status-badge">Take Profit</span>
            </div>

            <img src="https://via.placeholder.com/600x300?text=TSLA+Chart" alt="TSLA" class="trade-screenshot" @click="openImageModal('TSLA', 'Tesla Inc.')">
            
            <div class="secondary-info">
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Date</span>
                <span class="secondary-info-value">2023-10-20</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Entry Price</span>
                <span class="secondary-info-value">$210.30</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Exit Price</span>
                <span class="secondary-info-value">$234.75</span>
              </div>
              <div class="secondary-info-item">
                <span class="secondary-info-label">Exit Date</span>
                <span class="secondary-info-value">2023-11-14</span>
              </div>
            </div>

            <div class="main-stats">
              <div class="main-stat-item">
                <div class="main-stat-label">Entry Amount</div>
                <div class="main-stat-value">$21,030.00</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">Market Value</div>
                <div class="main-stat-value">$23,475.00</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Ratio</div>
                <div class="main-stat-value">11.63%</div>
              </div>
              <div class="main-stat-item">
                <div class="main-stat-label">P&L Amount</div>
                <div class="main-stat-value">+$2,445.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Contact Button -->
    <div class="contact-btn" @click="toggleContactPopup">
      <i class="bi bi-chat-dots"></i>
      Contact Me
    </div>

    <!-- Contact Popup -->
    <div class="contact-popup" v-show="showContactPopup">
      <h4><i class="bi bi-envelope"></i> Contact Information</h4>
      <div class="contact-item">
        <i class="bi bi-telegram"></i>
        <span>@traderjohn</span>
      </div>
      <div class="contact-item">
        <i class="bi bi-envelope"></i>
        <span>contact@traderjohn.com</span>
      </div>
      <div class="contact-item">
        <i class="bi bi-discord"></i>
        <span>TraderJohn#1234</span>
      </div>
    </div>

    <!-- Image Modal -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedTradeSymbol }} - {{ selectedTradeName }}</h5>
            <button type="button" class="btn-close" @click="closeImageModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img :src="selectedImageUrl" alt="Trade Chart" class="modal-image">
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Preview Modal -->
    <div class="modal fade avatar-preview-modal" id="avatarPreviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Profile Picture</h5>
            <button type="button" class="btn-close" @click="closeAvatarPreview" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="https://via.placeholder.com/300" alt="Avatar Preview" class="avatar-preview-img">
          </div>
        </div>
      </div>
    </div>
     <!-- Avatar Preview Modal -->
    <div class="profile-badges-floating">
        <a href="/vip" style="text-decoration: none; color: inherit;">
            <div class="badge-item" style="cursor:pointer;">
                <div class="badge-row">
                    <image src="/src/static/badges/vip.png" alt="VIP" class="badge-icon" />
                    <span class="badge-label">VIP</span>
                </div>
                <span class="badge-value-vip" id="vip-count">Loading...</span>
            </div>
        </a>
        <div class="badge-item" id="like-badge" style="cursor:pointer;">
            <div class="badge-row">
                <span class="badge-icon-svg" id="like-icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <defs>
                            <linearGradient id="likeGold" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFD700"/>
                                <stop offset="1" stop-color="#FFB300"/>
                            </linearGradient>
                        </defs>
                        <path d="M6 10V18C6 18.55 6.45 19 7 19H13C13.55 19 14 18.55 14 18V10" stroke="url(#likeGold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 19V7.5C10 6.12 11.12 5 12.5 5C13.88 5 15 6.12 15 7.5V10" stroke="url(#likeGold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span class="badge-label">Likes</span>
            </div>
            <span class="badge-value-alt" id="likes-count">Loading...</span>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { formatUSTime } from '@/utils/dateFormat';

// State for contact popup
const showContactPopup = ref(false);

// State for image modal
const selectedTradeSymbol = ref('');
const selectedTradeName = ref('');
const selectedImageUrl = ref('');
let imageModalInstance: Modal | null = null;
let avatarPreviewModalInstance: Modal | null = null;

// Refs
const avatarUpload = ref<HTMLInputElement>();

// Toggle contact popup
const toggleContactPopup = () => {
  showContactPopup.value = !showContactPopup.value;
};

// Open image modal
const openImageModal = (symbol: string, name: string) => {
  selectedTradeSymbol.value = symbol;
  selectedTradeName.value = name;
  selectedImageUrl.value = `https://via.placeholder.com/800x600?text=${symbol}+Detailed+Chart`;
  
  if (!imageModalInstance) {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      imageModalInstance = new Modal(modalElement);
    }
  }
  
  imageModalInstance?.show();
};

// Close image modal
const closeImageModal = () => {
  imageModalInstance?.hide();
};

// Open avatar preview
const openAvatarPreview = () => {
  if (!avatarPreviewModalInstance) {
    const modalElement = document.getElementById('avatarPreviewModal');
    if (modalElement) {
      avatarPreviewModalInstance = new Modal(modalElement);
    }
  }
  
  avatarPreviewModalInstance?.show();
};

// Close avatar preview
const closeAvatarPreview = () => {
  avatarPreviewModalInstance?.hide();
};

// Trigger avatar upload
const triggerAvatarUpload = () => {
  avatarUpload.value?.click();
};

// Handle avatar upload
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Check file type and size
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB');
    return;
  }
  
  // In a real application, you would upload the file here
  alert('Avatar upload functionality would be implemented here');
};

// Set up event listeners when component mounts
onMounted(() => {
  // Close contact popup when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.contact-btn') && !target.closest('.contact-popup') && showContactPopup.value) {
      showContactPopup.value = false;
    }
  });
});
</script>

<style scoped>
:root {
  --primary-color: #1a1a2e;
  --secondary-color: #16213e;
  --accent-color: #4361ee;
  --success-color: #020202;
  --danger-color: #e74c3c;
  --warning-color: #f1c40f;
  --text-color: #ffffff;
  --border-color: #2a2a3a;
  --gold-color: #ffd700;
}

.app-container {
  background-color: #1a1a2e;
  min-height: 100vh;
  width: 100%;
}

body {
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.navbar {
  background-color: #16213e;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding: 0.5rem 0;
  border-bottom: 1px solid #ffd700;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1rem;
  color: #ffd700;
}

.card {
  background-color: #16213e;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  margin-bottom: 15px;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  border-color: #ffd700;
}

.trade-screenshot {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #2a2a3a;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.trade-screenshot:hover {
  opacity: 0.9;
}

.stock-info {
  padding: 0.75rem 1rem;
  background: #1a1a2e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-symbol {
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.stock-name {
  font-size: 0.85rem;
  color: #a0a0a0;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid;
}

.secondary-info {
  padding: 1rem;
  background: linear-gradient(90deg, #16213e 0%, #1a1a2e 100%);
  border-bottom: 1px solid #2a2a3a;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.secondary-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.secondary-info-label {
  font-size: 0.75rem;
  color: #a0a0a0;
}

.secondary-info-value {
  font-size: 0.9rem;
  color: #ffd700;
}

.main-stats {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: #1a1a2e;
}

.main-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255,215,0,0.03);
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.main-stat-item:hover {
  border-color: #ffd700;
  background: rgba(255,215,0,0.05);
}

.main-stat-label {
  font-size: 0.8rem;
  color: #a0a0a0;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.main-stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffd700;
  line-height: 1.2;
}

.profit-positive {
  color: #020202;
  position: relative;
}

.profit-negative {
  color: #e74c3c;
  position: relative;
}

.profit-positive::before,
.profit-negative::before {
  content: '';
  position: absolute;
  left: -1.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.profit-positive::before {
  background-color: #020202;
}

.profit-negative::before {
  background-color: #e74c3c;
}

.bg-success {
  background: rgba(46, 204, 113, 0.1) !important;
  border-color: #020202 !important;
  color: #d0cece !important;
}

.bg-danger {
  background: rgba(231, 76, 60, 0.1) !important;
  border-color: #e74c3c !important;
  color: #e74c3c !important;
}

.bg-info {
  background: rgba(67, 97, 238, 0.1) !important;
  border-color: #4361ee !important;
  color: #4361ee !important;
}

.modal-content {
  background-color: #1a1a2e;
  border: 1px solid #2a2a3a;
}

/* Add Image Modal z-index settings */
.modal {
  z-index: 9999 !important;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-header {
  border-bottom: 1px solid #2a2a3a;
  padding: 1rem;
}

.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: 1px solid #2a2a3a;
}

.modal-title {
  color: #ffd700;
}

.btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

/* Profile Area Styles */
.profile-section {
  margin-top: 2rem;
}

.profile-header {
  background: #16213e;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%);
  z-index: 0;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: relative;
  z-index: 1;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffd700;
  position: relative;
  box-shadow: 0 0 20px rgba(255,215,0,0.2);
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: #020202;
  border: 3px solid #16213e;
  border-radius: 50%;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255,215,0,0.2);
}

.profile-title {
  font-size: 1.1rem;
  color: #a0a0a0;
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.profile-stats .stat-item {
  flex: 1 1 0;
  min-width: 120px;
  max-width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,215,0,0.05);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #2a2a3a;
}

.profile-stats .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
}

.profile-stats .stat-label {
  font-size: 0.9rem;
  color: #a0a0a0;
}

.profile-performance {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.performance-card {
  flex: 1;
  background: rgba(255,215,0,0.03);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.performance-card:hover {
  transform: translateY(-3px);
  border-color: #ffd700;
  background: rgba(255,215,0,0.05);
}

.performance-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  margin-bottom: 0.75rem;
}

.performance-header i {
  font-size: 1.25rem;
  color: #ffd700;
}

.performance-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffd700;
}

.performance-value.positive {
  color: #020202;
}

/* Trading Strategy Update Area Styles */
.strategy-update {
  background: #16213e;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  padding: 2rem;
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a2a3a;
}

.strategy-header h3 {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strategy-header h3 i {
  color: #ffd700;
}

.update-time {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.strategy-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.strategy-content h4 {
  color: #ffd700;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.strategy-content p {
  color: #a0a0a0;
  line-height: 1.6;
  margin: 0;
}

.trading-focus ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trading-focus li {
  color: #a0a0a0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a2a3a;
}

.trading-focus li:last-child {
  border-bottom: none;
}

.risk-warning {
  background: rgba(231, 76, 60, 0.05);
  border: 1px solid #e74c3c;
  border-radius: 12px;
  padding: 1.25rem;
}

.risk-warning h4 {
  color: #e74c3c;
}

/* Trade Record Separator Styles */
.trade-separator {
  margin: 2rem 0;
}

.trade-separator h3 {
  font-size: 1.2rem;
  color: #ffd700;
  margin: 0 0 0.8rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trade-separator h3 i {
  color: #ffd700;
  font-size: 1.1rem;
}

.trade-separator .divider-line {
  width: 100%;
  height: 2px;
  background: #2a2a3a;
}

/* Contact Button Styles */
.contact-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #ffd700;
  color: #1a1a2e;
  padding: 15px 25px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.contact-btn i {
  font-size: 1.2rem;
}

.contact-popup {
  position: fixed;
  right: 30px;
  bottom: 90px;
  background: #16213e;
  border: 1px solid #ffd700;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}
.profile-badges-floating {
            position: fixed;
            top: 100px;
            right: 30px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            z-index: 1100;
            transition: opacity 0.3s ease;
        }
        .badge-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(34,34,34,0.92);
            border-radius: 18px;
            box-shadow: 0 4px 18px rgba(0,0,0,0.18);
            padding: 0.7rem 1.1rem 0.4rem 1.1rem;
            min-width: 80px;
            transition: box-shadow 0.2s, transform 0.2s;
        }
        .badge-item:hover {
            box-shadow: 0 8px 28px rgba(0,0,0,0.22);
            transform: translateY(-2px) scale(1.04);
        }
        .badge-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.3em;
            margin-bottom: 0.2em;
        }
        .badge-icon {
            width: 22px;
            height: 22px;
            object-fit: contain;
            border-radius: 5px;
            box-shadow: 0 1px 4px #ffd70033;
            background: #111;
        }
        .badge-label {
            color: #FFD700;
            font-weight: 600;
            font-size: 1.05rem;
            letter-spacing: 1px;
        }
        .badge-value {
            color: #FFD700;
            font-weight: 700;
            font-size: 1.08rem;
            letter-spacing: 1px;
            text-shadow: 0 1px 2px #fff5;
            margin-top: 0.2rem;
        }
        .badge-value-alt {
            color: #fff;
            font-weight: 700;
            font-size: 1.08rem;
            letter-spacing: 1px;
            text-shadow: 0 1px 2px #FFD70055;
            margin-top: 0.2rem;
        }
        .badge-value-vip {
            color: #B0C4DE;
            font-weight: 700;
            font-size: 1.08rem;
            letter-spacing: 1px;
            text-shadow: 0 1px 2px #FFD70055;
            margin-top: 0.2rem;
        }
        .badge-art-text {
            background: linear-gradient(90deg, #222 60%, #444 100%);
            box-shadow: 0 4px 18px rgba(0,0,0,0.18);
            border-radius: 18px;
            padding: 0.7rem 1.1rem 0.4rem 1.1rem;
            min-width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .art-text {
            font-family: 'STXingkai', 'FZShuTi', 'Arial Black', cursive, sans-serif;
            font-size: 1.18rem;
            font-weight: bold;
            background: linear-gradient(90deg, #FFD700 60%, #fffbe6 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 8px #ffd70055, 0 1px 2px #fff5;
            letter-spacing: 2px;
            padding: 0.1em 0.2em;
        }
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-popup h4 {
  color: #ffd700;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #2a2a3a;
  color: #ffffff;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item i {
  color: #ffd700;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* Avatar Upload and Preview Styles */
.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #ffd700;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.1);
}

.avatar-upload-input {
  display: none;
}

/* Avatar Preview Modal Styles */
.avatar-preview-modal .modal-content {
  background: #1a1a2e;
  border: 1px solid #ffd700;
}

.avatar-preview-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Add glow animation at the end of style area */
.glow-bulb {
  color: #ffd700;
  filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #fff200);
  animation: bulb-glow 1.2s infinite alternate;
  transition: color 0.3s;
}

@keyframes bulb-glow {
  0% {
    filter: drop-shadow(0 0 4px #ffd700) drop-shadow(0 0 8px #fff200);
    color: #ffd700;
  }
  50% {
    filter: drop-shadow(0 0 16px #fff200) drop-shadow(0 0 32px #fffbe0);
    color: #fffbe0;
  }
  100% {
    filter: drop-shadow(0 0 4px #ffd700) drop-shadow(0 0 8px #fff200);
    color: #ffd700;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .profile-main {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .profile-stats {
    justify-content: center;
  }

  .profile-performance {
    flex-direction: column;
  }

  .strategy-content {
    grid-template-columns: 1fr;
  }

  .strategy-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .strategy-header h3 {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
  }

  .update-time {
    margin-left: 2rem;
    font-size: 0.85rem;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }

  .profile-name {
    font-size: 2rem;
  }

  .contact-popup {
    width: calc(100% - 60px);
    right: 15px;
    bottom: 90px;
  }

  /* 手机端弹窗优化 */
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }

  .modal-content {
    border-radius: 12px;
    margin: 0;
  }

  .modal-header {
    padding: 0.875rem;
    border-radius: 12px 12px 0 0;
  }

  .modal-header .modal-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .modal-body {
    padding: 0.875rem;
  }

  .modal-image {
    max-height: 70vh;
  }

  .btn-close {
    padding: 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem auto;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .modal-dialog {
    margin: 0.25rem;
    max-width: calc(100% - 0.5rem);
  }

  .modal-header {
    padding: 0.75rem;
  }

  .modal-body {
    padding: 0.75rem;
  }

  .modal-header .modal-title {
    font-size: 1rem;
  }
}
</style>