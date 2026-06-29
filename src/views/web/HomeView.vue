<template>
  <div class="app-container">
    <navcomponent></navcomponent>
    <!-- Navigation Bar
    <nav class="navbar navbar-expand-lg navbar-dark mb-3">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-graph-up me-2"></i>
          Expert Trader Profile
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="#" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-robot me-1"></i>
            AI Tools
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
    </nav> -->

    <!-- 移动端抖音风格布局 -->
    <div class="mobile-profile-hero" v-if="isMobile">
      <div class="mobile-profile-header">
        <div class="mobile-profile-bg"></div>
        <div class="mobile-profile-content">
          <div class="mobile-profile-card">
            <div class="mobile-profile-row">
              <div class="mobile-avatar-wrapper" @click="openAvatarPreview">
                <img :src="trader_profiles.profile_image_url" alt="Avatar" class="mobile-avatar-img">
                <div class="avatar-badge">✓</div>
              </div>
              <div class="mobile-profile-basic">
                <h1 class="mobile-name-large">{{ trader_profiles.trader_name }}</h1>
                <div class="mobile-title-inline">{{ trader_profiles.professional_title }}</div>
              </div>
            </div>

            <div class="mobile-pnl-strip">
              <div class="mobile-pnl-item">
                <span class="mobile-pnl-label">Total P&L</span>
                <span class="mobile-pnl-value" :class="{ positive: Total >= 0, negative: Total < 0 }">
                  {{ formatMoneySigned(Total) }}
                </span>
              </div>
              <div class="mobile-pnl-divider" aria-hidden="true"></div>
              <div class="mobile-pnl-item">
                <span class="mobile-pnl-label">Monthly P&L</span>
                <span class="mobile-pnl-value" :class="{ positive: Monthly >= 0, negative: Monthly < 0 }">
                  {{ formatMoneySigned(Monthly) }}
                </span>
              </div>
            </div>

            <div class="mobile-stats-bar">
              <div class="mobile-stat-chip">
                <strong>{{ Activecount }}</strong>
                <span>Active</span>
              </div>
              <div class="mobile-stat-chip">
                <strong>{{ trader_profiles.win_rate ?? 0 }}%</strong>
                <span>Win Rate</span>
              </div>
              <div class="mobile-stat-chip">
                <strong>{{ trader_profiles.total_trades ?? 0 }}</strong>
                <span>Trades</span>
              </div>
              <div class="mobile-stat-chip">
                <strong>{{ trader_profiles.years_of_experience ?? 0 }}</strong>
                <span>Years</span>
              </div>
            </div>
          </div>

          <p class="mobile-bio-text" v-if="trader_profiles.bio">{{ trader_profiles.bio }}</p>
        </div>
      </div>
    </div>

    <!-- 全新的网格布局系统 -->
    <div class="modern-home-layout">
      <!-- 左侧边栏 - 交易员资料（桌面端） -->
      <aside class="trader-sidebar" :class="{ 'mobile-hidden': isMobile }">
        <div class="trader-card">
          <div class="trader-avatar-wrapper" @click="openAvatarPreview">
            <img :src="trader_profiles.profile_image_url" alt="Avatar" class="trader-avatar">
          </div>
          
          <div class="trader-info">
            <h2 class="trader-name">{{trader_profiles.trader_name}}</h2>
            <p class="trader-title">{{trader_profiles.professional_title}}</p>
            
            <div class="trader-metrics">
              <div class="metric-item">
                <div class="metric-icon" :style="{ background: Total >= 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div class="metric-content">
                  <div class="metric-value" :class="{ 'positive': Total >= 0, 'negative': Total < 0 }">
                 {{ formatMoneySigned(Total) }}
              </div>
                  <div class="metric-label">Total P&L</div>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-icon" :style="{ background: Monthly >= 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
            </div>
                <div class="metric-content">
                  <div class="metric-value" :class="{ 'positive': Monthly >= 0, 'negative': Monthly < 0 }">
                    {{ formatMoneySigned(Monthly) }}
          </div>
                  <div class="metric-label">Monthly P&L</div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速统计卡片 -->
          <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <path d="M20 8v6M23 11l-3 3-3-3"></path>
              </svg>
          </div>
            <div class="stat-info">
              <div class="stat-label">Active</div>
              <div class="stat-number">{{ Activecount }}</div>
            </div>
            </div>
          
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Years</div>
              <div class="stat-number">{{trader_profiles.years_of_experience}}</div>
          </div>
        </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
          </div>
            <div class="stat-info">
              <div class="stat-label">Trades</div>
              <div class="stat-number">{{trader_profiles.total_trades}}</div>
        </div>
      </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 6 16 14 8 14"></polygon>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Win Rate</div>
              <div class="stat-number">{{trader_profiles.win_rate}}%</div>
          </div>
        </div>
      </div>

        <!-- 全新的快速操作栏 -->
        <div class="quick-actions">
          <a href="/vip" class="action-button vip-btn">
            <div class="action-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
              </div>
            <div class="action-content">
              <div class="action-label">VIP Center</div>
              <div class="action-value" id="vip-count">{{trader_profiles.members_count || 0}} Members</div>
              </div>
          </a>

          <button class="action-button likes-btn" id="like-badge" @click="handleLikeClick">
            <div class="action-icon-wrapper" id="like-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              </div>
            <div class="action-content">
              <div class="action-label">Likes</div>
              <div class="action-value" id="likes-count">{{ formatLikesCount(likesCount || trader_profiles.likes_count) }}</div>
            </div>
          </button>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">

        <!-- 交易策略标签页 -->
        <section class="strategy-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="bi bi-lightbulb title-icon glow-bulb" aria-hidden="true"></i>
              <span class="section-title-text">Trading Strategy</span>
            </h2>
            <div class="update-badge">
              <span class="badge-dot"></span>
              Updated: {{ formatUSTime(strategy_info.updated_at) }}
            </div>
          </div>
          <div class="strategy-tabs">
            <button 
              v-for="(tab, index) in strategyTabs" 
              :key="index"
              class="tab-button"
              :class="{ active: activeTab === index }"
              @click="selectStrategyTab(index)"
            >
              {{ tab.label }}
            </button>
              </div>

          <div class="strategy-content-wrapper">
            <!-- 市场分析标签页 -->
            <div v-show="activeTab === 0" class="strategy-panel">
              <div class="panel-header">
                <h3>Market Analysis</h3>
              </div>
              <div class="panel-body">
                <div class="analysis-box">
                  <div class="analysis-icon-wrap" aria-hidden="true">
                    <span class="analysis-icon">📊</span>
                  </div>
                  <div class="analysis-label">Market View</div>
                  <div class="analysis-text">
                    <p
                      v-for="(paragraph, index) in splitStrategyParagraphs(strategy_info.market_analysis)"
                      :key="'analysis-' + index"
                      class="strategy-paragraph"
                    >{{ paragraph }}</p>
                  </div>
                </div>
                <div class="media-container" v-if="strategy_info.analysis_path">
                  <audio v-if="strategy_info.stype==1" :src="strategy_info.analysis_path" controls class="media-player"></audio>
                  <video v-if="strategy_info.stype==2" :src="strategy_info.analysis_path" controls class="media-player"></video>
              </div>
              </div>
              </div>
              
            <!-- 分享重点标签页 -->
            <div v-show="activeTab === 1" class="strategy-panel">
              <div class="panel-header">
                <h3>Shared Focus</h3>
              </div>
              <div class="panel-body">
                <div v-if="hasStructuredFocus" class="share-focus">
                  <div class="share-focus-disclaimer">
                    <span class="share-focus-disclaimer-dot"></span>
                    Suggested reference only — prices, timing and position sizes are shared ideas, not trade confirmations.
                  </div>

                  <div v-if="parsedTradingFocus.notices.length" class="focus-notice">
                    <div class="focus-notice-icon">📋</div>
                    <div class="focus-notice-body">
                      <div class="focus-notice-title">Notice</div>
                      <p v-for="(notice, index) in parsedTradingFocus.notices" :key="index">{{ notice }}</p>
                    </div>
                  </div>

                  <div
                    v-if="parsedTradingFocus.purchaseDate && !parsedTradingFocus.stocks.length"
                    class="focus-meta-row"
                  >
                    <span class="focus-date-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Suggested Time: {{ formatUSDate(parsedTradingFocus.purchaseDate) }}
                    </span>
                  </div>

                  <div v-if="parsedTradingFocus.stocks.length" class="share-focus-list">
                    <article
                      v-for="(stock, index) in parsedTradingFocus.stocks"
                      :key="`${stock.symbol}-${index}`"
                      class="share-focus-item"
                    >
                      <div class="share-focus-main">
                        <div class="share-focus-symbol-block">
                          <span class="share-focus-rank">{{ index + 1 }}</span>
                          <div>
                            <div class="share-focus-symbol">{{ stock.symbol }}</div>
                            <div class="share-focus-caption">Suggested Idea</div>
                          </div>
                        </div>
                        <div class="share-focus-stats">
                          <div class="share-focus-stat">
                            <span class="share-focus-stat-label">Suggested Price</span>
                            <span class="share-focus-stat-value">{{ formatPriceRight(stock.price) }}</span>
                          </div>
                          <div v-if="stock.buyTime" class="share-focus-stat">
                            <span class="share-focus-stat-label">Suggested Time</span>
                            <span class="share-focus-stat-value">{{ formatUSDate(stock.buyTime) }}</span>
                          </div>
                          <div v-if="stock.position" class="share-focus-stat">
                            <span class="share-focus-stat-label">Suggested Size</span>
                            <span class="share-focus-stat-value share-focus-stat-accent">
                              {{ formatPositionDisplay(stock.position) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>

                  <div v-if="parsedTradingFocus.others.length" class="focus-other-list">
                    <div v-for="(item, index) in parsedTradingFocus.others" :key="index" class="focus-other-item">
                      {{ item }}
                    </div>
                  </div>
                </div>

                <div v-else class="focus-grid">
                  <div v-for="(value, index) in normalizedTradingFocus" :key="index" class="focus-item">
                    <div class="focus-icon">{{ index + 1 }}</div>
                    <div class="focus-content">
                      <div class="focus-label">Suggested Idea</div>
                      <div class="focus-text">{{ value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 风险警告标签页 -->
            <div v-show="activeTab === 2" class="strategy-panel">
              <div class="panel-header">
                <h3>Risk Warning</h3>
            </div>
              <div class="panel-body">
                <div class="warning-box">
                  <div class="warning-icon-wrap" aria-hidden="true">
                    <span class="warning-icon">!</span>
                  </div>
                  <div class="warning-label">Important Notice</div>
                  <div class="warning-text">
                    <p
                      v-for="(paragraph, index) in splitStrategyParagraphs(strategy_info.risk_warning)"
                      :key="'warning-' + index"
                      class="strategy-paragraph"
                    >{{ paragraph }}</p>
                  </div>
                </div>
                <div class="media-container" v-if="strategy_info.warn_path">
                  <audio v-if="strategy_info.warntype==1" :src="strategy_info.warn_path" controls class="media-player"></audio>
                  <video v-if="strategy_info.warntype==2" :src="strategy_info.warn_path" controls class="media-player"></video>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 交易记录区域 - 全新的表格式布局 -->
        <section class="trades-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon title-icon-emoji">📈</span>
              <span class="section-title-text">Trading Records</span>
            </h2>
            <div class="view-toggle">
              <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button class="view-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              </div>
          </div>

          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="trades-grid">
            <div v-for="value in trades" :key="value.id || value.symbol" class="trade-card-modern">
              <div class="trade-card-header">
                <div class="trade-symbol-section">
                  <div class="symbol-badge">{{value.symbol || '-'}}</div>
                  <div class="market-tag" :class="getCountryClass(value.trade_market)">
                    {{(value.trade_market || '').toUpperCase()}}
              </div>
                </div>
                <div class="status-indicator" :class="getStatusClass(value.status, getTradeMetrics(value).ratio)">
                  <span class="status-dot"></span>
                  <span class="status-label">{{getStatusText(value.status, getTradeMetrics(value).ratio)}}</span>
                </div>
              </div>

              <div
                class="trade-image-wrapper"
                @click="value.image_url && openImageModal(value.symbol, value.image_url)"
              >
                <span v-if="value.image_url" class="trade-image-badge">Chart snapshot</span>
                <img
                  :src="value.image_url || '/trade-placeholder.svg'"
                  alt="Chart"
                  class="trade-image"
                  :class="{ 'trade-image-default': !value.image_url }"
                >
                <div class="image-overlay" v-if="value.image_url">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
              </div>
              </div>
               
              <div class="trade-card-body">
                <div class="trade-prices-row">
                  <div class="trade-price-block">
                    <span class="trade-block-label trade-block-label-entry">Entry</span>
                    <span class="trade-block-date">{{ formatUSDate(value.entry_date) }}</span>
                    <span class="trade-block-price">{{ formatPriceRight(value.entry_price, value.currency) }}</span>
                  </div>
                  <div class="trade-price-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </div>
                  <div class="trade-price-block" v-if="isActiveTrade(value)">
                    <span class="trade-block-label trade-block-label-current">Live Price</span>
                    <span class="trade-block-date">{{ formatUSDate(livePriceUpdatedAt) }}</span>
                    <span class="trade-block-price trade-block-price-live">{{ formatLivePriceRight(getTradeMetrics(value).price, value.currency) }}</span>
                  </div>
                  <div class="trade-price-block" v-else>
                    <span class="trade-block-label trade-block-label-exit">Exit</span>
                    <span class="trade-block-date">{{ formatUSDate(value.exit_date) }}</span>
                    <span class="trade-block-price">{{ formatPriceRight(value.exit_price, value.currency) }}</span>
                  </div>
                </div>

                <div class="trade-stats-list">
                  <div class="trade-stat-row">
                    <span class="trade-stat-label">Shares</span>
                    <span class="trade-stat-value">{{ formatQuantity(value.size) }}</span>
                  </div>
                  <div class="trade-stat-row">
                    <span class="trade-stat-label">Entry Amount</span>
                    <span class="trade-stat-value">{{ formatMoneyRight(getTradeMetrics(value).entryAmount, value.currency) }}</span>
                  </div>
                  <div class="trade-stat-row">
                    <span class="trade-stat-label">Market Value</span>
                    <span class="trade-stat-value">{{ formatMoneyRight(getTradeMetrics(value).marketValue, value.currency) }}</span>
                  </div>
                </div>

                <div
                  class="trade-pnl-footer"
                  :class="getPnlClass(getTradeMetrics(value).ratio)"
                >
                  <div class="trade-pnl-item">
                    <span class="trade-pnl-label">P&L Ratio</span>
                    <span class="trade-pnl-number">{{ formatRatio(getTradeMetrics(value).ratio) }}%</span>
                  </div>
                  <div class="trade-pnl-divider" aria-hidden="true"></div>
                  <div class="trade-pnl-item">
                    <span class="trade-pnl-label">P&L Amount</span>
                    <span class="trade-pnl-number">{{ formatMoneySigned(getTradeMetrics(value).amount, value.currency) }}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

          <!-- 移动端列表视图（表格模式） -->
          <div v-if="viewMode === 'table' && isMobile" class="trades-mobile-list">
            <div
              v-for="value in trades"
              :key="value.id || value.symbol"
              class="trades-mobile-row"
              @click="openImageModal(value.symbol, value.image_url || '/trade-placeholder.svg')"
            >
              <div class="trades-mobile-row-top">
                <span class="trades-mobile-symbol">{{ value.symbol || '-' }}</span>
                <span class="market-badge trades-mobile-market" :class="getCountryClass(value.trade_market)">
                  {{ (value.trade_market || '').toUpperCase() }}
                </span>
                <span
                  class="trades-mobile-status"
                  :class="getMobileStatusClass(value)"
                >
                  {{ getMobileStatusText(value) }}
                </span>
              </div>
              <div class="trades-mobile-row-bottom">
                <span class="trades-mobile-date">{{ formatUSDate(value.entry_date) }}</span>
                <span class="trades-mobile-price">
                  {{ formatPriceRight(value.entry_price, value.currency) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 表格视图（桌面端） -->
          <div v-if="viewMode === 'table' && !isMobile" class="trades-table-wrapper">
            <table class="trades-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Market</th>
                  <th>Status</th>
                  <th>Entry Date</th>
                  <th>Entry Price</th>
                  <th v-if="trades.some(t => isActiveTrade(t))">Current Price</th>
                  <th>Exit Date</th>
                  <th>Exit Price</th>
                  <th>P&L Ratio</th>
                  <th>P&L Amount</th>
                  <th>Chart</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in trades" :key="value.id || value.symbol" class="trade-row">
                  <td class="symbol-cell">
                    <strong>{{value.symbol || '-'}}</strong>
                  </td>
                  <td>
                    <span class="market-badge" :class="getCountryClass(value.trade_market)">
                      {{(value.trade_market || '').toUpperCase()}}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(value.status, getTradeMetrics(value).ratio)">
                      {{getStatusText(value.status, getTradeMetrics(value).ratio)}}
                    </span>
                  </td>
                  <td>{{formatUSDate(value.entry_date)}}</td>
                  <td>{{ formatPriceRight(value.entry_price, value.currency) }}</td>
                  <td v-if="trades.some(t => isActiveTrade(t))">
                    <span v-if="isActiveTrade(value)">{{ formatLivePriceRight(getTradeMetrics(value).price, value.currency) }}</span>
                    <span v-else>-</span>
                  </td>
                  <td>{{value.exit_date ? formatUSDate(value.exit_date) : '-'}}</td>
                  <td>
                    <span v-if="isActiveTrade(value)">-</span>
                    <span v-else>{{ formatPriceRight(value.exit_price, value.currency) }}</span>
                  </td>
                  <td>
                    <span class="pnl-ratio" :class="Number(getTradeMetrics(value).ratio) > 0 ? 'profit' : Number(getTradeMetrics(value).ratio) < 0 ? 'loss' : ''">
                      {{ formatRatio(getTradeMetrics(value).ratio) }}%
                    </span>
                  </td>
                  <td>
                    <span class="pnl-amount" :class="Number(getTradeMetrics(value).ratio) > 0 ? 'profit' : Number(getTradeMetrics(value).ratio) < 0 ? 'loss' : ''">
                      {{ formatMoneySigned(getTradeMetrics(value).amount, value.currency) }}
                    </span>
                  </td>
                  <td>
                    <button @click="openImageModal(value.symbol, value.image_url || '/trade-placeholder.svg')" class="chart-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
      </div>
        </section>
      </main>
    </div>

    <!-- Floating Contact Button (desktop only) -->
    <div class="contact-btn" v-if="!isMobile" @click="toggleContactPopup">
      <i class="bi bi-people-fill"></i>
      Platform Support
    </div>

     <!-- Redirect Message -->
    <div class="redirect-message" v-show="showContactPopup">
        <span class="text">Redirecting to Platform Support</span><span class="dots"></span>
    </div>
    
    <!-- 移动端底部快速操作栏 -->
    <div class="mobile-bottom-actions" v-if="isMobile">
      <a href="/vip" class="mobile-bottom-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
        </svg>
        <span class="mobile-btn-label">VIP</span>
      </a>
      
      <button class="mobile-bottom-btn mobile-like-btn" id="mobile-like-btn" @click="handleLikeClick">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'liked': isLiked }">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span class="mobile-btn-label">Like</span>
        <span class="mobile-like-count">{{ formatLikesCount(likesCount || trader_profiles.likes_count) }}</span>
      </button>
      
      <button class="mobile-bottom-btn" @click="toggleContactPopup">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span class="mobile-btn-label mobile-btn-label--platform">Platform Support</span>
      </button>
    </div>
    <!-- Contact Popup
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
    </div> -->

    <!-- Image Modal -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedTradeSymbol }}</h5>
            <button type="button" class="btn-close" @click="closeImageModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img :src="selectedTradeName" alt="Trade Chart" class="modal-image">
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
            <img :src="trader_profiles.profile_image_url" alt="Avatar Preview" class="avatar-preview-img">
          </div>
        </div>
      </div>
    </div>
     <!-- Avatar Preview Modal -->
    
    <!-- Welcome Popup Modal -->
    <div class="modal fade" id="welcomePopupModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered welcome-modal-dialog" :class="{ 'welcome-modal-dialog--mobile': isMobile }">
            <div class="modal-content welcome-popup-modal" :class="{ 'welcome-popup-modal--mobile': isMobile }">
                <div v-if="!isMobile" class="welcome-modal-glow welcome-modal-glow--primary"></div>
                <div v-if="!isMobile" class="welcome-modal-glow welcome-modal-glow--secondary"></div>

                <button
                    v-if="isMobile || (announcementData && announcementData.allow_close_dialog===1)"
                    type="button"
                    class="welcome-close-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="welcome-modal-body" :class="{ 'welcome-modal-body--mobile-simple': isMobile }">
                    <div v-if="!isMobile" class="welcome-profile-header welcome-desktop-only">
                        <div class="welcome-avatar-ring">
                            <img :src="trader_profiles.profile_image_url" alt="Trader" class="welcome-avatar">
                        </div>
                        <div class="welcome-profile-info">
                            <span class="welcome-badge">Welcome</span>
                            <h3 class="welcome-trader-name">{{ trader_profiles.trader_name }}</h3>
                            <p class="welcome-trader-title">{{ trader_profiles.professional_title }}</p>
                        </div>
                    </div>

                    <p v-if="!isMobile" class="welcome-tagline welcome-desktop-only">
                        Dedicated to providing professional trading strategy analysis and real-time market guidance for investors
                    </p>

                    <div v-if="!isMobile" class="welcome-stats-grid welcome-desktop-only">
                        <div class="welcome-stat-card">
                            <div class="welcome-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div class="welcome-stat-value" :class="{ positive: Total >= 0, negative: Total < 0 }">
                                {{ formatMoneySigned(Total) }}
                            </div>
                            <div class="welcome-stat-label">Total P&L</div>
                        </div>
                        <div class="welcome-stat-card">
                            <div class="welcome-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div class="welcome-stat-value" :class="{ positive: Monthly >= 0, negative: Monthly < 0 }">
                                {{ formatMoneySigned(Monthly) }}
                            </div>
                            <div class="welcome-stat-label">Monthly P&L</div>
                        </div>
                        <div class="welcome-stat-card">
                            <div class="welcome-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 3v18h18"></path>
                                    <path d="M18 17V9"></path>
                                    <path d="M13 17V5"></path>
                                    <path d="M8 17v-3"></path>
                                </svg>
                            </div>
                            <div class="welcome-stat-value">{{ Activecount }}</div>
                            <div class="welcome-stat-label">Active Trades</div>
                        </div>
                    </div>

                    <div
                        class="welcome-announcement"
                        :class="{ 'welcome-announcement--mobile': isMobile }"
                        v-if="announcementData?.title || announcementData?.content"
                    >
                        <div v-if="isMobile" class="welcome-mobile-topbar">
                            <div class="welcome-mobile-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 11l18-5v12L3 14v-3z"></path>
                                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                                </svg>
                                <span>Announcement</span>
                            </div>
                        </div>
                        <div v-if="!isMobile" class="welcome-announcement-header welcome-desktop-only">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 11l18-5v12L3 14v-3z"></path>
                                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                            </svg>
                            <span>Important Announcement</span>
                        </div>
                        <h4 v-if="announcementData?.title" class="welcome-announcement-title">{{ announcementData.title }}</h4>
                        <div v-if="announcementData?.content" class="welcome-announcement-scroll">
                            <p class="welcome-announcement-text">{{ announcementData.content }}</p>
                        </div>
                        <button
                            v-if="isMobile"
                            type="button"
                            class="welcome-mobile-dismiss"
                            data-bs-dismiss="modal"
                        >
                            Got it
                        </button>
                    </div>

                    <div v-if="!isMobile" class="welcome-benefits welcome-desktop-only">
                        <h4 class="welcome-benefits-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Join Exclusive Trading Community
                        </h4>
                        <div class="welcome-benefits-grid">
                            <div class="welcome-benefit-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Real-time Trading Signals</span>
                            </div>
                            <div class="welcome-benefit-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Professional Strategy Analysis</span>
                            </div>
                            <div class="welcome-benefit-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>One-on-One Trading Guidance</span>
                            </div>
                            <div class="welcome-benefit-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Exclusive Market Analysis Reports</span>
                            </div>
                        </div>
                    </div>

                    <button v-if="!isMobile" class="welcome-cta-btn welcome-desktop-only" @click="joinCommunity">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Join Exclusive Community Now
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- 合作单位 -->
    <PartnerOrganizations />
  </div>
</template>

<script lang="ts" setup>
import navcomponent from '../component/nav/nav.vue'
import PartnerOrganizations from '@/components/PartnerOrganizations.vue';
import moment from 'moment';
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap';
import{getIndexData,getStockPrices,get_whatsapp_link,getannouncement,likeTrader} from '../../api/module/web/index'
import { useUserStore } from '@/store';
import { layer } from '@layui/layui-vue';
import {
  normalizeTradingFocus,
  parseTradingFocus,
  formatPositionDisplay,
} from '@/utils/parseTradingFocus';
import { formatUSDate, formatUSTime } from '@/utils/dateFormat';
import { formatQuantity, formatStockPrice, formatMoneyAmount, formatMoneyRight, formatMoneySigned, formatPriceRight, formatLivePriceRight, parseShareSize } from '@/utils/formatNumber';
const trader_profiles=ref({});
const strategy_info=ref({
    "updated_at": "",
    "market_analysis": "",
    "trading_focus": [
    ],
    "risk_warning": "",
    "id": 0,
    "trader_uuid": "",
    "stype": 0,
    "analysis_path": "",
    "warntype": 0,
    "warn_path": ""
});
const trades=ref([]);
const Activecount=ref(0)
let tradeRefreshTimer: number | null = null;
let priceRefreshTimer: number | null = null;
let priceRefreshInFlight = false;
const TRADE_PRICE_REFRESH_MS = 30_000;
const TRADE_FULL_REFRESH_MS = 300_000;
const Monthly=ref(0)
const Total=ref(0)
const userStore = useUserStore()
// State for contact popup
const showContactPopup = ref(false);
// State for image modal
const selectedTradeSymbol = ref('');
const selectedTradeName = ref('');
const selectedImageUrl = ref('');
const announcementData=ref({});
let imageModalInstance: Modal | null = null;
let avatarPreviewModalInstance: Modal | null = null;
// 点赞状态
const likesCount = ref(0);
const isLiked = ref(false);
const likeIcon = ref<HTMLElement | null>(null);
// 新的响应式变量
const activeTab = ref(0);
const viewMode = ref('grid');
const isMobile = ref(false);
const strategyTabs = [
  { label: 'Market Analysis', icon: '📊' },
  { label: 'Shared Focus', icon: '🎯' },
  { label: 'Risk Warning', icon: '⚠️' }
];

const STRATEGY_TAB_ROTATE_MS = 60 * 1000;
const STRATEGY_TAB_PAUSE_MS = 10 * 60 * 1000;
let strategyTabRotateTimer: ReturnType<typeof setInterval> | null = null;
let strategyTabPauseTimer: ReturnType<typeof setTimeout> | null = null;

const clearStrategyTabRotateTimer = () => {
  if (strategyTabRotateTimer) {
    clearInterval(strategyTabRotateTimer);
    strategyTabRotateTimer = null;
  }
};

const clearStrategyTabPauseTimer = () => {
  if (strategyTabPauseTimer) {
    clearTimeout(strategyTabPauseTimer);
    strategyTabPauseTimer = null;
  }
};

const startStrategyTabRotation = () => {
  clearStrategyTabRotateTimer();
  strategyTabRotateTimer = setInterval(() => {
    activeTab.value = (activeTab.value + 1) % strategyTabs.length;
  }, STRATEGY_TAB_ROTATE_MS);
};

const pauseStrategyTabRotation = () => {
  clearStrategyTabRotateTimer();
  clearStrategyTabPauseTimer();
  strategyTabPauseTimer = setTimeout(() => {
    strategyTabPauseTimer = null;
    startStrategyTabRotation();
  }, STRATEGY_TAB_PAUSE_MS);
};

const selectStrategyTab = (index: number) => {
  activeTab.value = index;
  pauseStrategyTabRotation();
};

const onStrategyTabPageClick = () => {
  pauseStrategyTabRotation();
};

const stopStrategyTabRotation = () => {
  clearStrategyTabRotateTimer();
  clearStrategyTabPauseTimer();
};

const normalizedTradingFocus = computed(() =>
  normalizeTradingFocus(strategy_info.value.trading_focus)
);

const parsedTradingFocus = computed(() =>
  parseTradingFocus(normalizedTradingFocus.value)
);

const hasStructuredFocus = computed(() => {
  const parsed = parsedTradingFocus.value;
  return (
    parsed.stocks.length > 0 ||
    !!parsed.purchaseDate ||
    parsed.notices.length > 0
  );
});

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 968;
};

// 初始化加载数据
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  try{
  // 检查 indexData 是否已经是对象，如果是则直接使用，否则解析 JSON
  let indexdata;
  if (typeof userStore.indexData === 'string') {
    indexdata = JSON.parse(userStore.indexData || '{}');
  } else {
    indexdata = userStore.indexData || {};
  }
  trader_profiles.value=indexdata.trader_profiles;
    if(indexdata.strategy_info){
      strategy_info.value=indexdata.strategy_info;
    }
    
    // 对本地存储的数据也进行过滤和排序
    if(indexdata.trades && Array.isArray(indexdata.trades)) {
      // 调试：显示原始交易记录数量
      console.log(`📊 [本地存储] 原始交易记录数量: ${indexdata.trades.length}`);
      console.log(`📊 [本地存储] 交易记录详情:`, indexdata.trades.map((t: any) => ({
        symbol: t.symbol,
        status: t.status,
        entry_date: t.entry_date,
        exit_date: t.exit_date
      })));
      
      // 暂时移除时间限制，显示所有交易记录（仅过滤无效数据）
      const filteredTrades = indexdata.trades.filter((trade: any) => {
        // 只过滤掉没有entry_date的记录
        if (!trade.entry_date) {
          console.warn('⚠️ 发现无效交易记录（缺少entry_date）:', trade);
          return false;
        }
        return true;
      });
      
      // 调试：显示过滤后的交易记录数量
      console.log(`📊 [本地存储] 过滤后交易记录数量: ${filteredTrades.length} (过滤掉 ${indexdata.trades.length - filteredTrades.length} 条无效记录)`);
      
      const sortedTrades = filteredTrades.sort((a: any, b: any) => {
        // 首先按重点交易排序：重点交易在前
        // 处理 null/undefined 的情况
        const isImportantA = a.is_important === true || a.is_important === 1 || a.is_important === 'true' || a.is_featured === true || a.is_featured === 1;
        const isImportantB = b.is_important === true || b.is_important === 1 || b.is_important === 'true' || b.is_featured === true || b.is_featured === 1;
        
        if (isImportantA !== isImportantB) {
          return isImportantA ? -1 : 1; // 重点交易在前
        }
        
        // 然后按状态排序：Active在前，平仓在后
        const isActiveA = a.status === 'Active';
        const isActiveB = b.status === 'Active';
        
        if (isActiveA !== isActiveB) {
          return isActiveA ? -1 : 1; // Active在前
        }
        
        // 同状态内按时间排序
        if (isActiveA) {
          // 持仓的按买入时间排序（最新的在前）
          const dateA = new Date(a.entry_date);
          const dateB = new Date(b.entry_date);
          return dateB.getTime() - dateA.getTime();
        } else {
          // 平仓的按退出时间排序（最新的在前）
          const dateA = new Date(a.exit_date || a.entry_date);
          const dateB = new Date(b.exit_date || b.entry_date);
          return dateB.getTime() - dateA.getTime();
        }
      });
      
      // 调试信息：显示重点交易数量
      const importantTrades = sortedTrades.filter((t: any) => t.is_important === true || t.is_important === 1 || t.is_featured === true || t.is_featured === 1);
      if (importantTrades.length > 0) {
        console.log(`⭐ 重点交易记录数量: ${importantTrades.length}`, importantTrades.map((t: any) => ({ symbol: t.symbol, is_important: t.is_important })));
      }
      
      trades.value = sortedTrades;
      console.log(`✅ [本地存储] 最终trades.value数量: ${trades.value.length}`);
      console.log(`✅ [本地存储] 最终trades.value内容:`, trades.value.map((t: any) => t.symbol));
    } else {
      trades.value = indexdata.trades || [];
      console.log(`⚠️ [本地存储] 使用原始trades数据，数量: ${trades.value.length}`);
    }
   
    if(trades.value){
      Activecount.value=trades.value.filter((item:any)=>item.status=='Active').length
      console.log(`📈 Active交易数量: ${Activecount.value}`);
    } else {
      console.warn('⚠️ trades.value为空或undefined');
    }
    Monthly.value=indexdata.Monthly;
    Total.value=indexdata.Total;
  }
  catch(error)
  {
    console.log(error)
  }
  getannouncementdataData()

  
  // 初始化点赞数
  if (trader_profiles.value && trader_profiles.value.likes_count) {
    likesCount.value = trader_profiles.value.likes_count;
  }
  
  // 确保点赞数显示正确
  setTimeout(() => {
    updateLikeIcon();
  }, 100);

  startStrategyTabRotation();
  document.addEventListener('click', onStrategyTabPageClick);

  getindexdata().then(() => updateActiveTradePrices());
  priceRefreshTimer = window.setInterval(() => {
    updateActiveTradePrices();
  }, TRADE_PRICE_REFRESH_MS);

  tradeRefreshTimer = window.setInterval(() => {
    if (trades.value.some((item: any) => isActiveTrade(item))) {
      getindexdata().then(() => updateActiveTradePrices());
    }
  }, TRADE_FULL_REFRESH_MS);

  document.addEventListener('visibilitychange', onTradePriceVisibilityChange);
});

const onTradePriceVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    updateActiveTradePrices();
  }
};

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('visibilitychange', onTradePriceVisibilityChange);
  document.removeEventListener('click', onStrategyTabPageClick);
  stopStrategyTabRotation();
  if (priceRefreshTimer) {
    window.clearInterval(priceRefreshTimer);
    priceRefreshTimer = null;
  }
  if (tradeRefreshTimer) {
    window.clearInterval(tradeRefreshTimer);
    tradeRefreshTimer = null;
  }
});

// 处理点赞点击事件
const handleLikeClick = async () => {
  try {
    try{
        let histaryday = new Date();
        histaryday.setDate(histaryday.getDate() - 1);
        console.log(histaryday.toISOString().slice(0, 10))
        localStorage.removeItem(`traderlikes_${histaryday.toISOString().slice(0, 10)}`)
    }
    catch(error){
      
    }
     const today = new Date().toISOString().slice(0, 10);
 
    const likeKey = `traderlikes_${today}`;
    
      if (localStorage.getItem(likeKey)) {
         layer.msg("Today and past, please come back tomorrow. Thank you for your support!", { icon : 6, time: 2500})
       
        return;
      }
   
    if (!trader_profiles.value || !trader_profiles.value.id) {
      console.error('Trader ID not found');
      return;
    }
    
    const response = await likeTrader({
      id: trader_profiles.value.id
    });
    
    if (response.success) {
      localStorage.setItem(likeKey, '1');
      isLiked.value = response.isLiked;
       layer.msg("Liked successfully, thank you!", { icon : 6, time: 2500})
      // 更新点赞数
      if (isLiked.value) {
        likesCount.value++;
      } else {
        likesCount.value--;
      }
      
      // 更新显示的点赞数
      if (trader_profiles.value) {
        trader_profiles.value.likes_count = likesCount.value;
      }
      
      // 更新UI显示
      updateLikeIcon();
    } else {
      console.error('Like operation failed:', response.message);
    }
  } catch (error) {
    console.error('Error during like operation:', error);
  }
};

// 更新点赞图标样式
const updateLikeIcon = () => {
  const likeButton = document.getElementById('like-badge');
  if (likeButton) {
    if (isLiked.value) {
      likeButton.classList.add('active');
    } else {
      likeButton.classList.remove('active');
    }
  }
  
  // 更新点赞数显示 - 优先使用响应式变量
  const likesCountElement = document.getElementById('likes-count');
  if (likesCountElement) {
    // 使用响应式的 likesCount 作为主要数据源
    const count = likesCount.value || trader_profiles.value?.likes_count || 0;
    likesCountElement.textContent = formatLikesCount(count);
  }
};
// Refs

// Toggle contact popup
const toggleContactPopup = async () => {
  showContactPopup.value = !showContactPopup.value;

  const response=await get_whatsapp_link();
    if(response.success)
    {
      window.location.href = response.data;
      setTimeout(() => {
                        showContactPopup.value = !showContactPopup.value;
      }, 3000);
    }
    else
    {
      showContactPopup.value = !showContactPopup.value;
    }
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

const getindexdata= async()=>{
  try {
    const res=await getIndexData();
    console.log(`🔍 [API] 完整API响应:`, res);
    console.log(`🔍 [API] res.success:`, res.success);
    console.log(`🔍 [API] res.data:`, res.data);
    
    if(res.success && res.data){
      userStore.indexData=JSON.stringify(res.data);
      trader_profiles.value=res.data.trader_profiles;
       if(res.data.strategy_info){
      strategy_info.value=res.data.strategy_info;
       }
      
      // 调试：显示原始交易记录数量
      console.log(`📊 [API] 原始交易记录数量: ${res.data.trades?.length || 0}`);
      console.log(`📊 [API] res.data.trades 类型:`, Array.isArray(res.data.trades) ? 'Array' : typeof res.data.trades);
      console.log(`📊 [API] res.data 所有键:`, Object.keys(res.data));
      
      if (res.data.trades && Array.isArray(res.data.trades)) {
        console.log(`📊 [API] 交易记录详情（前10条）:`, res.data.trades.slice(0, 10).map((t: any) => ({
          symbol: t.symbol,
          status: t.status,
          entry_date: t.entry_date,
          exit_date: t.exit_date,
          id: t.id
        })));
      } else {
        console.warn(`⚠️ [API] res.data.trades 不是数组:`, res.data.trades);
      }
    
    // 暂时移除时间限制，显示所有交易记录（仅过滤无效数据）
    const filteredTrades = (res.data.trades || []).filter((trade: any) => {
      // 只过滤掉没有entry_date的记录
      if (!trade.entry_date) {
        console.warn('⚠️ 发现无效交易记录（缺少entry_date）:', trade);
        return false;
      }
      return true;
    });
    
    // 调试：显示过滤后的交易记录数量
    console.log(`📊 [API] 过滤后交易记录数量: ${filteredTrades.length} (过滤掉 ${(res.data.trades?.length || 0) - filteredTrades.length} 条无效记录)`);
    
    // 复杂排序：首先按重点交易，然后按状态，最后按时间
    const sortedTrades = filteredTrades.sort((a: any, b: any) => {
      // 首先按重点交易排序：重点交易在前
      // 处理 null/undefined 的情况
      const isImportantA = a.is_important === true || a.is_important === 1 || a.is_important === 'true' || a.is_featured === true || a.is_featured === 1;
      const isImportantB = b.is_important === true || b.is_important === 1 || b.is_important === 'true' || b.is_featured === true || b.is_featured === 1;
      
      if (isImportantA !== isImportantB) {
        return isImportantA ? -1 : 1; // 重点交易在前
      }
      
      // 然后按状态排序：Active在前，平仓在后
      const isActiveA = a.status === 'Active';
      const isActiveB = b.status === 'Active';
      
      if (isActiveA !== isActiveB) {
        return isActiveA ? -1 : 1; // Active在前
      }
      
      // 同状态内按时间排序
      if (isActiveA) {
        // 持仓的按买入时间排序（最新的在前）
        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        return dateB.getTime() - dateA.getTime();
      } else {
        // 平仓的按退出时间排序（最新的在前）
        const dateA = new Date(a.exit_date || a.entry_date);
        const dateB = new Date(b.exit_date || b.entry_date);
        return dateB.getTime() - dateA.getTime();
      }
    });
    
    // 调试信息：显示重点交易数量
    const importantTrades = sortedTrades.filter((t: any) => t.is_important === true || t.is_important === 1 || t.is_featured === true || t.is_featured === 1);
    if (importantTrades.length > 0) {
      console.log(`⭐ 重点交易记录数量: ${importantTrades.length}`, importantTrades.map((t: any) => ({ symbol: t.symbol, is_important: t.is_important })));
    }
    
    trades.value = sortedTrades;
    console.log(`✅ [API] 最终trades.value数量: ${trades.value.length}`);
    console.log(`✅ [API] 最终trades.value内容:`, trades.value.map((t: any) => t.symbol));
    
    Activecount.value=trades.value.filter((item:any)=>item.status=='Active').length
    console.log(`📈 Active交易数量: ${Activecount.value}`);
    
    Monthly.value=res.data.Monthly;
    Total.value=res.data.Total;
    
    // 更新点赞数
    if (res.data.trader_profiles && res.data.trader_profiles.likes_count !== undefined) {
      likesCount.value = res.data.trader_profiles.likes_count;
      if (trader_profiles.value) {
        trader_profiles.value.likes_count = res.data.trader_profiles.likes_count;
      }
      // 延迟更新UI，确保DOM已渲染
      setTimeout(() => {
        updateLikeIcon();
      }, 100);
    }
   
    } else {
      console.warn(`⚠️ [API] API返回失败或数据为空:`, {
        success: res.success,
        hasData: !!res.data,
        dataKeys: res.data ? Object.keys(res.data) : []
      });
    }
  } catch (error) {
    console.error(`❌ [API] 获取数据异常:`, error);
  }
};
const getannouncementdataData= async()=>{
  try {
    const res=await getannouncement();
    if(res.success && res.announcement){
      announcementData.value=res.announcement;
      // Show welcome modal when component mounts
      const delaySeconds = announcementData.value?.delay_seconds || 0;
      setTimeout(() => {
        openWelcomeModal();
      }, delaySeconds * 1000);
    }
  } catch (error) {
    console.error('获取公告数据失败:', error);
    // 设置默认值避免后续错误
    announcementData.value = announcementData.value || {};
  }
}
// // Set up event listeners when component mounts
// onMounted(() => {
//   getindexdata()
//   // // Close contact popup when clicking outside
//   // document.addEventListener('click', (e) => {
//   //   const target = e.target as HTMLElement;
//   //   if (!target.closest('.contact-btn') && !target.closest('.contact-popup') && showContactPopup.value) {
//   //     showContactPopup.value = false;
//   //   }
//   // });
// });

// Welcome Modal functionality
let welcomeModalInstance: Modal | null = null;

// Function to open welcome modal
const openWelcomeModal = () => {
  if (!welcomeModalInstance) {
    const modalElement = document.getElementById('welcomePopupModal');
    if (modalElement) {
      welcomeModalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }
  
  welcomeModalInstance?.show();
};

// Function to close welcome modal
const closeWelcomeModal = () => {
  welcomeModalInstance?.hide();
};

// Function to handle joining community
const joinCommunity = () => {
  // Close welcome popup
  closeWelcomeModal();
  
  // Trigger contact button click event after a delay
  setTimeout(() => {
    toggleContactPopup();
  }, 300);
};

// 获取国家标识的样式类
const getCountryClass = (market: string) => {
  if (!market) return 'country-default';
  const marketUpper = market.toUpperCase();
  switch(marketUpper) {
    case 'USA':
    case 'NASDAQ':
    case 'NYSE':
      return 'country-usa';
    case 'UK':
    case 'LSE':
      return 'country-uk';
    case 'CN':
    case 'SSE':
    case 'SZSE':
      return 'country-cn';
    default:
      return 'country-default';
  }
};

// 获取国家旗帜emoji（简化版，返回空字符串）
const getCountryFlag = (market: string) => {
  return ''; // 不显示旗帜图标
};

// 获取状态样式类
const getStatusClass = (status: string, ratio: number | string) => {
  if (!status) return 'status-default';
  const r = Number(ratio) || 0;
  if (status.toLowerCase() === 'active') {
    return 'status-active';
  } else {
    if (r > 0) {
      return 'status-take-profit';
    } else {
      return 'status-stop-loss';
    }
  }
};

// 获取状态图标（简化版，返回空字符串）
const getStatusIcon = (status: string) => {
  return ''; // 不显示状态图标
};

// 获取状态文本（根据盈亏情况显示止盈/止损）
const getStatusText = (status: string, ratio: number) => {
  if (!status) return 'Unknown';
  if (status.toLowerCase() === 'active') {
    return 'Active';
  } else {
    // 对于所有非Active状态，根据盈亏情况判断是止盈还是止损
    if (ratio > 0) {
      return 'Take Profit';
    } else {
      return 'Stop Loss';
    }
  }
};

const getMobileStatusClass = (trade: any) => {
  if (isActiveTrade(trade)) return 'trades-mobile-status--active';
  const ratio = Number(getTradeMetrics(trade).ratio) || 0;
  return ratio > 0 ? 'trades-mobile-status--profit' : 'trades-mobile-status--loss';
};

const getMobileStatusText = (trade: any) => {
  if (isActiveTrade(trade)) return 'Active';
  const ratio = Number(getTradeMetrics(trade).ratio) || 0;
  return ratio > 0 ? 'Take Profit' : 'Stop Loss';
};

// 格式化货币金额，添加千位分隔符
const isActiveTrade = (trade: any) =>
  trade?.status === 'Active' || (!trade?.exit_date && !trade?.exit_price);

const applyLivePriceToTrade = (trade: any, price: number) => {
  const entryPrice = Number(trade?.entry_price) || 0;
  const size = parseShareSize(trade?.size);
  const direction = Number(trade?.direction) || 1;
  trade.current_price = price;
  trade.price_is_live = true;
  trade.Market_Value = (price * size).toFixed(2);
  trade.Ratio =
    entryPrice > 0
      ? (((price - entryPrice) / entryPrice) * 100).toFixed(2)
      : '0.00';
  trade.Amount = ((price - entryPrice) * size * direction).toFixed(2);
};

const updateActiveTradePrices = async () => {
  if (priceRefreshInFlight) return;
  const activeTrades = trades.value.filter((t: any) => isActiveTrade(t));
  if (!activeTrades.length) return;

  const quotes = activeTrades.map((t: any) => ({
    symbol: t.symbol,
    trade_market: t.trade_market || 'US',
  }));

  priceRefreshInFlight = true;
  try {
    const res = await getStockPrices(quotes);
    if (!res?.success || !res.data) return;

    const priceMap = res.data as Record<string, number>;
    trades.value = trades.value.map((trade: any) => {
      if (!isActiveTrade(trade)) return trade;
      const nextPrice = priceMap[trade.symbol];
      if (nextPrice == null || !(Number(nextPrice) > 0)) return trade;
      const next = { ...trade };
      applyLivePriceToTrade(next, Number(nextPrice));
      return next;
    });

    if (res.updated_at) {
      livePriceUpdatedAt.value = res.updated_at;
    } else {
      livePriceUpdatedAt.value = new Date().toISOString();
    }
  } catch (err) {
    console.warn('Failed to refresh active trade prices:', err);
  } finally {
    priceRefreshInFlight = false;
  }
};

const getTradeMetrics = (trade: any) => {
  const entryPrice = Number(trade?.entry_price) || 0;
  const size = parseShareSize(trade?.size);
  const direction = Number(trade?.direction) || 1;
  const active = isActiveTrade(trade);

  let price = active ? Number(trade?.current_price) : Number(trade?.exit_price);
  if (!price || Number.isNaN(price)) {
    price = entryPrice;
  }

  const entryAmount = entryPrice * size;
  const marketValue = price * size;
  const amount = (price - entryPrice) * size * direction;
  const ratio = entryPrice > 0 ? ((price - entryPrice) / entryPrice) * 100 : 0;

  return { entryAmount, marketValue, amount, ratio, price, active };
};

const formatRatio = (ratio: number | string) => {
  const num = Number(ratio) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getPnlClass = (ratio: number | string) => {
  const num = Number(ratio) || 0;
  if (num > 0) return 'pnl-profit';
  if (num < 0) return 'pnl-loss';
  return 'pnl-neutral';
};

const formatCurrency = formatMoneyAmount;

/** 交易策略文案按换行分段，每段首行缩进 2em */
const splitStrategyParagraphs = (text: string) => {
  if (!text?.trim()) return [];
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
};

// 格式化点赞数
const formatLikesCount = (count: number | string | undefined) => {
  if (!count && count !== 0) return '0K';
  
  // 转换为数字
  const num = typeof count === 'string' ? parseFloat(count) : count;
  
  if (isNaN(num)) return '0K';
  
  // 如果大于1000，显示为K格式
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  // 否则直接显示数字
  return num.toString();
};


</script>

<style scoped>

:root {
  --primary-color: #667eea;
  --primary-dark: #764ba2;
  --secondary-color: #fa709a;
  --accent-color: #00f2fe;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --text-color: #ffffff;
  --border-color: rgba(255, 255, 255, 0.1);
  --gold-color: #f093fb;
}

.app-container {
  background: var(--bg-primary);
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* 全新的网格布局系统 */
.modern-home-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;
}

/* 左侧边栏 - 交易员资料 */
.trader-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: sticky;
  top: 100px;
  height: fit-content;
}

.trader-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}

.trader-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  cursor: zoom-in;
}

.trader-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  background: var(--primary-gradient);
  padding: 3px;
  box-sizing: border-box;
}

.trader-info {
  text-align: center;
}

.trader-name {
  font-size: 24px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.trader-title {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-lg);
}

.trader-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
}

.metric-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text-primary);
}

.metric-value.positive {
  color: var(--color-success);
}

.metric-value.negative {
  color: var(--color-danger);
}

.metric-label {
  font-size: 12px;
  color: var(--text-muted);
}

/* 快速统计卡片 */
.quick-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.3);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-number.positive {
  color: var(--color-success);
}

.stat-number.negative {
  color: var(--color-danger);
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  width: 100%;
  min-width: 0;
  overflow: visible;
}

/* 策略区域 */
.strategy-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.strategy-section .section-title {
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 24px;
  font-weight: 700;
}

.section-title-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 28px;
  flex-shrink: 0;
  -webkit-text-fill-color: initial;
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
}

.title-icon-emoji {
  line-height: 1;
}

.update-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-left: auto;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 2s ease-in-out infinite;
}

.strategy-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  bottom: -1px;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.strategy-panel {
  animation: fadeIn 0.3s ease;
}

.panel-header h3 {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.panel-body {
  color: var(--text-secondary);
  line-height: 1.7;
}

.analysis-box {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 8px var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-md);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.22) 0%, rgba(118, 75, 162, 0.12) 100%);
  border: 1px solid rgba(129, 140, 248, 0.45);
  border-left: 5px solid #818cf8;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.18);
}

.analysis-icon-wrap {
  grid-column: 1;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  align-self: start;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary-gradient);
  box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.18), var(--shadow-md);
}

.analysis-icon {
  font-size: 22px;
  line-height: 1;
}

.analysis-label {
  grid-column: 2;
  grid-row: 1;
  display: inline-block;
  align-self: start;
  margin-bottom: 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.22);
  border: 1px solid rgba(165, 180, 252, 0.35);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.analysis-text {
  grid-column: 2;
  grid-row: 2;
  margin: 0;
  font-size: clamp(0.95rem, 1.6vw, 1.08rem);
  font-weight: 600;
  line-height: 1.65;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.95);
  word-break: break-word;
}

.strategy-paragraph {
  margin: 0 0 0.65em;
  text-indent: 2em;
}

.strategy-paragraph:last-child {
  margin-bottom: 0;
}

.media-container {
  margin-top: var(--spacing-lg);
}

.media-player {
  width: 100%;
  border-radius: var(--border-radius-sm);
  background: rgba(0, 0, 0, 0.2);
}

.share-focus {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-focus-disclaimer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
}

.share-focus-disclaimer-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a78bfa;
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.55);
  flex-shrink: 0;
}

.share-focus-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-focus-item {
  position: relative;
  padding: 22px 22px 22px 26px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(129, 140, 248, 0.35);
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.12);
}

.share-focus-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, #818cf8 0%, #c084fc 100%);
}

.share-focus-item:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(167, 139, 250, 0.28);
}

.share-focus-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.share-focus-symbol-block {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 120px;
}

.share-focus-rank {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(129, 140, 248, 0.25);
  color: #e0e7ff;
  font-size: 15px;
  font-weight: 800;
}

.share-focus-symbol {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #fff;
  line-height: 1.1;
  text-transform: uppercase;
}

.share-focus-caption {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c4b5fd;
}

.share-focus-stats {
  display: flex;
  align-items: stretch;
  flex: 1;
  justify-content: flex-end;
  gap: 0;
  min-width: 0;
}

.share-focus-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 110px;
  padding: 0 18px;
}

.share-focus-stat:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.08);
}

.share-focus-stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
  white-space: nowrap;
}

.share-focus-stat-value {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  white-space: nowrap;
}

.share-focus-stat-accent {
  color: #86efac;
}

.focus-notice {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-radius: var(--border-radius);
}

.focus-notice-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.focus-notice-title {
  font-size: 13px;
  font-weight: 700;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 6px;
}

.focus-notice-body p {
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  font-weight: 700;
  line-height: 1.6;
}

.focus-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.focus-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.24);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.focus-date-badge svg {
  width: 16px;
  height: 16px;
  color: #a5b4fc;
}

.focus-other-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.focus-other-item {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.16) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-left: 4px solid #818cf8;
  color: #ffffff;
  font-size: clamp(1.1rem, 2.2vw, 1.35rem);
  font-weight: 800;
  line-height: 1.55;
  letter-spacing: 0.02em;
}

.focus-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

.focus-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-left: 4px solid #818cf8;
  border-radius: var(--border-radius);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.12);
}

.focus-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
}

.focus-content {
  flex: 1;
  min-width: 0;
}

.focus-label {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c4b5fd;
}

.focus-text {
  flex: 1;
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: 800;
  line-height: 1.55;
  color: #ffffff;
  letter-spacing: 0.02em;
  word-break: break-word;
}

.warning-box {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 8px var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-md);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(127, 29, 29, 0.12) 100%);
  border: 1px solid rgba(248, 113, 113, 0.45);
  border-left: 5px solid #f87171;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.18);
}

.warning-icon-wrap {
  grid-column: 1;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  align-self: start;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.2), 0 4px 16px rgba(239, 68, 68, 0.35);
}

.warning-icon {
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  color: #fff;
}

.warning-label {
  grid-column: 2;
  grid-row: 1;
  display: inline-block;
  align-self: start;
  margin-bottom: 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid rgba(252, 165, 165, 0.35);
  color: #fecaca;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.warning-text {
  grid-column: 2;
  grid-row: 2;
  margin: 0;
  font-size: clamp(0.95rem, 1.6vw, 1.08rem);
  font-weight: 600;
  line-height: 1.65;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.95);
  word-break: break-word;
}

/* 交易记录区域 */
.trades-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

.view-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-gradient);
  color: white;
}

/* 网格视图 */
.trades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.trade-card-modern {
  background: linear-gradient(165deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.92) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.trade-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
}

.trade-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-xs);
}

.trade-symbol-section {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.symbol-badge {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.market-tag {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(102, 126, 234, 0.12);
  color: var(--color-primary);
  flex-shrink: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-indicator.status-active .status-dot {
  background: var(--color-success);
}

.status-indicator.status-take-profit {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-indicator.status-take-profit .status-dot {
  background: var(--color-success);
}

.status-indicator.status-stop-loss {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.status-indicator.status-stop-loss .status-dot {
  background: var(--color-danger);
}

.trade-card-modern .status-indicator {
  border: none;
  box-shadow: none;
}

.trade-card-modern .status-indicator .status-label {
  white-space: nowrap;
}

.trade-image-wrapper {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.trade-image-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.trade-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
}

.trade-image-default {
  object-fit: cover;
  background: #1a2332;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
  color: white;
}

.trade-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-overlay svg {
  width: 32px;
  height: 32px;
}

/* Trade card data layout */
.trade-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trade-prices-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.trade-price-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.trade-price-block:last-child {
  text-align: right;
  align-items: flex-end;
}

.trade-price-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.12);
  color: rgba(165, 180, 252, 0.9);
  flex-shrink: 0;
}

.trade-price-arrow svg {
  width: 14px;
  height: 14px;
}

.trade-block-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.trade-block-label-entry {
  color: #a5b4fc;
}

.trade-block-label-current {
  color: #6ee7b7;
}

.trade-block-label-exit {
  color: #94a3b8;
}

.trade-block-date {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.3;
  white-space: nowrap;
}

.trade-block-price {
  font-size: clamp(14px, 2.4vw, 17px);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.trade-block-price-live {
  color: #6ee7b7;
}

.trade-stats-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.trade-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.trade-stat-row:last-child {
  border-bottom: none;
}

.trade-stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  flex-shrink: 0;
}

.trade-stat-value {
  font-size: clamp(13px, 2.2vw, 15px);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-align: right;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trade-pnl-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid transparent;
}

.trade-pnl-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.trade-pnl-item:last-child {
  text-align: right;
  align-items: flex-end;
}

.trade-pnl-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.trade-pnl-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.55);
}

.trade-pnl-number {
  font-size: clamp(15px, 2.6vw, 18px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.trade-pnl-footer.pnl-profit {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.06) 100%);
  border-color: rgba(16, 185, 129, 0.22);
}

.trade-pnl-footer.pnl-profit .trade-pnl-number {
  color: #34d399;
}

.trade-pnl-footer.pnl-loss {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(239, 68, 68, 0.06) 100%);
  border-color: rgba(239, 68, 68, 0.22);
}

.trade-pnl-footer.pnl-loss .trade-pnl-number {
  color: #f87171;
}

.trade-pnl-footer.pnl-neutral {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.trade-pnl-footer.pnl-neutral .trade-pnl-number {
  color: var(--text-primary);
}

.trade-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

/* 表格视图 */
.trades-table-wrapper {
  margin-top: var(--spacing-lg);
  overflow-x: auto;
}

.trades-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.trades-table thead {
  background: rgba(102, 126, 234, 0.1);
}

.trades-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.trades-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 14px;
}

.trade-row:hover {
  background: rgba(102, 126, 234, 0.05);
}

.symbol-cell {
  font-weight: 700;
}

.market-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-primary);
}

.trades-table .status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  border: none;
  box-shadow: none;
}

.trades-table .status-badge.status-active,
.trades-table .status-badge.status-take-profit {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.trades-table .status-badge.status-stop-loss {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.trades-table .status-badge.status-default {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
}

.pnl-ratio,
.pnl-amount {
  font-weight: 700;
}

.pnl-ratio.profit,
.pnl-amount.profit {
  color: var(--color-success);
}

.pnl-ratio.loss,
.pnl-amount.loss {
  color: var(--color-danger);
}

.chart-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.chart-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.chart-btn svg {
  width: 16px;
  height: 16px;
}

/* 移动端交易列表 */
.trades-mobile-list {
  display: flex;
  flex-direction: column;
  margin-top: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.trades-mobile-row {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.trades-mobile-row:last-child {
  border-bottom: none;
}

.trades-mobile-row:active {
  background: rgba(102, 126, 234, 0.08);
}

.trades-mobile-row-top {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.trades-mobile-symbol {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-primary);
}

.trades-mobile-market {
  flex-shrink: 0;
  padding: 2px 6px;
  font-size: 9px;
  line-height: 1.2;
}

.trades-mobile-status {
  flex-shrink: 0;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  border: none;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.trades-mobile-status--active {
  background: rgba(16, 185, 129, 0.14);
  color: #34d399;
}

.trades-mobile-status--profit {
  background: rgba(16, 185, 129, 0.14);
  color: #34d399;
}

.trades-mobile-status--loss {
  background: rgba(239, 68, 68, 0.14);
  color: #f87171;
}

.trades-mobile-row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
  min-width: 0;
}

.trades-mobile-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.3;
}

.trades-mobile-price {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .modern-home-layout {
    grid-template-columns: 280px 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 968px) {
  /* 显示移动端抖音风格布局 */
  .mobile-profile-hero {
    display: block !important;
    width: 100%;
  }
  
  /* 确保移动端布局正确 */
  .app-container {
    padding: 0;
  }
  
  .modern-home-layout {
    padding: 0;
    grid-template-columns: 1fr;
  }
  
  /* 桌面端确保主内容显示 */
  .trader-sidebar.mobile-hidden {
    display: none;
  }
  
  .main-content {
    width: 100%;
    padding: 8px 10px;
    padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
  }
  
  .mobile-profile-header {
    position: relative;
    background: var(--bg-primary);
    overflow: hidden;
  }
  
  .mobile-profile-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 132px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    opacity: 0.28;
    z-index: 0;
  }
  
  .mobile-profile-content {
    position: relative;
    z-index: 1;
    padding: 14px 12px 8px;
    background: linear-gradient(to bottom, transparent 0%, var(--bg-primary) 55%);
  }

  .mobile-profile-card {
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 14px 12px 12px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  }
  
  .mobile-profile-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
  }
  
  .mobile-avatar-wrapper {
    position: relative;
    width: 68px;
    height: 68px;
    flex-shrink: 0;
    cursor: pointer;
    padding: 3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #818cf8 0%, #a78bfa 55%, #6366f1 100%);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  }
  
  .mobile-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(15, 23, 42, 0.85);
    object-fit: cover;
    display: block;
  }
  
  .avatar-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid rgba(15, 23, 42, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: 700;
  }
  
  .mobile-profile-basic {
    flex: 1;
    min-width: 0;
    padding-top: 2px;
  }
  
  .mobile-name-large {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .mobile-title-inline {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-pnl-strip {
    display: flex;
    align-items: stretch;
    gap: 0;
    padding: 8px 10px;
    margin-bottom: 8px;
    border-radius: 10px;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(129, 140, 248, 0.18);
  }

  .mobile-pnl-item {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mobile-pnl-divider {
    width: 1px;
    margin: 0 8px;
    background: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .mobile-pnl-label {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  .mobile-pnl-value {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-pnl-value.positive {
    color: var(--color-success);
  }

  .mobile-pnl-value.negative {
    color: var(--color-danger);
  }

  .mobile-stats-bar {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 4px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .mobile-stat-chip {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    text-align: center;
  }

  .mobile-stat-chip strong {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .mobile-stat-chip span {
    font-size: 9px;
    color: var(--text-muted);
    line-height: 1.2;
    white-space: nowrap;
  }
  
  .mobile-bio-text {
    margin: 8px 2px 0;
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.45;
  }
  
  .modern-home-layout {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 0;
  }
  
  /* 隐藏侧边栏 */
  .trader-sidebar {
    display: none;
  }
  
  .main-content {
    padding: var(--spacing-md);
    padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
  }
  
  /* 交易策略更突出 */
  .strategy-section.mobile-strategy-prominent {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
  }
  
  .strategy-section.mobile-strategy-prominent .section-title {
    font-size: 22px;
    margin-bottom: 0;
  }
  
  .strategy-section.mobile-strategy-prominent .section-header {
    margin-bottom: var(--spacing-lg);
  }
  
  .trades-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .trades-section {
    padding: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }
  
  .section-title {
    font-size: 17px;
  }

  .title-icon {
    font-size: 18px;
  }

  .analysis-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }

  .warning-text {
    font-size: 14px;
    font-weight: 600;
  }

  .panel-header h3 {
    font-size: 15px;
  }
}

/* 移动端底部快速操作栏 */
.mobile-bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 6px 8px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  z-index: 998;
  gap: 4px;
}

.mobile-bottom-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 2px;
  min-height: 48px;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  min-width: 0;
}

.mobile-btn-label {
  font-size: 9px;
  font-weight: 500;
  line-height: 1.15;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-btn-label--platform {
  font-size: 8px;
  line-height: 1.2;
  white-space: normal;
  text-align: center;
}

.mobile-bottom-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.mobile-bottom-btn:hover,
.mobile-bottom-btn:active {
  color: var(--color-primary);
  background: rgba(102, 126, 234, 0.1);
}

.mobile-bottom-btn svg.liked {
  fill: var(--color-danger);
  stroke: var(--color-danger);
}

.mobile-like-count {
  font-size: 9px;
  line-height: 1;
  color: #c4b5fd;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 968px) {
  .mobile-bottom-actions {
    display: grid;
  }

  .contact-btn {
    display: none;
  }

  .redirect-message {
    bottom: calc(58px + env(safe-area-inset-bottom, 0px));
    padding: 10px 16px;
    font-size: 0.8125rem;
    max-width: calc(100% - 24px);
  }
  
  /* 移动端策略部分更突出 */
  .strategy-section.mobile-strategy-prominent {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-top: var(--spacing-lg);
  }
  
  .strategy-section.mobile-strategy-prominent .section-title {
    font-size: 24px;
    font-weight: 800;
  }
  
  .strategy-section.mobile-strategy-prominent .tab-button {
    font-size: 15px;
    padding: 14px 20px;
  }
  
  .strategy-section.mobile-strategy-prominent .panel-body {
    font-size: 15px;
    line-height: 1.8;
  }

  .strategy-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-wrap: nowrap;
    margin-left: -4px;
    margin-right: -4px;
    padding-left: 4px;
    padding-right: 4px;
  }

  .strategy-tabs::-webkit-scrollbar {
    display: none;
  }

  .strategy-tabs .tab-button {
    flex-shrink: 0;
    white-space: nowrap;
  }
}

@media (max-width: 640px) {
  .modern-home-layout {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }
  
  .trader-sidebar {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .trader-card {
    padding: var(--spacing-lg);
  }
  
  .trader-avatar-wrapper {
    width: 100px;
    height: 100px;
    margin-bottom: var(--spacing-md);
  }
  
  .trader-name {
    font-size: 20px;
  }
  
  .trader-title {
    font-size: 13px;
  }
  
  .trader-metrics {
    gap: var(--spacing-sm);
  }
  
  .metric-item {
    padding: var(--spacing-sm);
  }
  
  .metric-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
  
  .metric-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .metric-value {
    font-size: 20px;
    font-weight: 800;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .stat-card {
    padding: var(--spacing-md);
  }
  
  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .stat-icon-wrapper svg {
    width: 20px;
    height: 20px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .action-button {
    padding: var(--spacing-md);
  }
  
  .action-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .action-icon-wrapper svg {
    width: 20px;
    height: 20px;
  }
  
  .strategy-section,
  .trades-section {
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
  }
  
  .section-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .title-icon {
    font-size: 18px;
  }
  
  .update-badge {
    font-size: 11px;
    padding: 4px 10px;
  }
  
  .strategy-tabs {
    gap: var(--spacing-xs);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .strategy-tabs::-webkit-scrollbar {
    display: none;
  }
  
  .tab-button {
    padding: 10px 16px;
    font-size: 13px;
    white-space: nowrap;
  }
  
  .panel-header h3 {
    font-size: 14px;
  }
  
  .share-focus-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .share-focus-stats {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .share-focus-stat {
    min-width: 0;
    padding: 10px 0;
  }

  .share-focus-stat:not(:last-child)::after {
    display: none;
  }

  .share-focus-stat:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .share-focus-stat-label,
  .share-focus-stat-value {
    white-space: normal;
  }

  .share-focus-symbol {
    font-size: 20px;
  }

  .focus-notice {
    padding: var(--spacing-md);
  }

  .focus-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .focus-item {
    padding: var(--spacing-sm);
  }
  
  .focus-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .warning-box {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 10px 12px;
    padding: var(--spacing-md);
  }

  .warning-icon-wrap {
    grid-column: 1;
    grid-row: 1;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2), 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .warning-icon {
    font-size: 22px;
  }

  .warning-label {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }

  .warning-text {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.65;
  }

  .analysis-box {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 10px 12px;
    padding: var(--spacing-md);
  }

  .analysis-icon-wrap {
    grid-column: 1;
    grid-row: 1;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.18), var(--shadow-md);
  }

  .analysis-icon {
    font-size: 20px;
  }

  .analysis-label {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }

  .analysis-text {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.6;
  }

  .welcome-desktop-only {
    display: none !important;
  }

  .welcome-modal-glow {
    display: none !important;
  }

  .welcome-popup-modal,
  .welcome-popup-modal--mobile {
    background: linear-gradient(165deg, #1a2240 0%, #12182e 100%);
    border: 1px solid rgba(129, 140, 248, 0.35);
    border-radius: 20px;
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.04) inset;
    overflow: hidden;
  }

  .welcome-popup-modal::before,
  .welcome-popup-modal--mobile::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #fbbf24 50%, #764ba2 100%);
  }

  .welcome-modal-dialog,
  .welcome-modal-dialog--mobile {
    margin: 20px 16px;
    max-width: calc(100% - 32px);
  }

  .welcome-modal-body,
  .welcome-modal-body--mobile-simple {
    padding: 0;
  }

  .welcome-announcement--mobile {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 0 1rem;
    background: transparent;
    border: none;
  }

  .welcome-mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 3rem 0.5rem;
  }

  .welcome-mobile-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(102, 126, 234, 0.18);
    border: 1px solid rgba(129, 140, 248, 0.35);
    color: #c4b5fd;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .welcome-mobile-badge svg {
    width: 14px;
    height: 14px;
    color: #a5b4fc;
  }

  .welcome-announcement--mobile .welcome-announcement-title {
    margin: 0;
    padding: 0.25rem 1.25rem 0.75rem;
    padding-right: 3rem;
    font-size: 1.0625rem;
    font-weight: 700;
    line-height: 1.45;
    color: #fde68a;
    text-align: left;
    letter-spacing: 0.01em;
  }

  .welcome-announcement-scroll {
    margin: 0 1rem;
    max-height: min(52vh, 360px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1rem 1rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .welcome-announcement--mobile .welcome-announcement-text {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 400;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.88);
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .welcome-mobile-dismiss {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 2rem);
    margin: 1rem auto 0;
    padding: 13px 20px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .welcome-mobile-dismiss:active {
    transform: scale(0.98);
    box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
  }

  .welcome-close-btn {
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.7);
    z-index: 3;
  }

  .warning-text {
    font-size: 13px;
    font-weight: 600;
  }
  
  .trades-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .trade-card-modern {
    padding: 14px;
    gap: 12px;
  }

  .trade-card-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .symbol-badge {
    font-size: 17px;
  }

  .trade-image-wrapper {
    height: 124px;
  }

  .trade-prices-row {
    padding: 12px;
    gap: 8px;
  }

  .trade-price-arrow {
    width: 24px;
    height: 24px;
  }

  .trade-stat-row {
    padding: 10px 12px;
  }

  .trade-pnl-footer {
    padding: 12px 14px;
  }
  
  .trades-mobile-symbol {
    font-size: 13px;
  }

  .trades-mobile-status {
    font-size: 9px;
    padding: 3px 8px;
  }

  .trades-mobile-date {
    font-size: 10px;
  }

  .trades-mobile-price {
    font-size: 12px;
  }

  .trades-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .trades-table {
    min-width: 900px;
  }
  
  .trades-table th,
  .trades-table td {
    padding: 10px 8px;
    font-size: 12px;
  }
  
  .trades-table th {
    font-size: 10px;
  }
}

body {
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}



.card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
  background: var(--bg-glass-hover);
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
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(255, 215, 0, 0.1);
}

.stock-center {
  flex: 1;
  text-align: center;
}

.stock-symbol {
  font-size: 1.4rem;
  font-weight: 700;
  background: var(--primary-gradient);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  animation: subtleGlow 4s ease-in-out infinite;
}

@keyframes subtleGlow {
  0%, 100% { 
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% { 
    background-position: 100% 50%;
    filter: brightness(1.1);
  }
}

.stock-name {
  font-size: 0.85rem;
  color: #a0a0a0;
}

/* 国家标识样式 */
.country-badge-container {
  display: flex;
  align-items: center;
}

.country-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  text-align: center;
  min-width: 50px;
}

.country-flag {
  display: none; /* 隐藏旗帜图标 */
}

.country-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 简洁的国家标识样式 */
.country-usa {
  background: #28a745;
  border-color: #28a745;
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.country-uk {
  background: #007bff;
  border-color: #007bff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.country-cn {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.country-default {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

/* 状态标识样式 */
.status-badge-container {
  display: flex;
  align-items: center;
}

.status-badge-enhanced {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid;
  background: transparent;
  text-align: center;
  min-width: 70px;
}

.status-icon {
  display: none; /* 隐藏状态图标 */
}

.status-text {
  font-weight: 600;
}

/* 旧版增强徽章（仅 .status-badge-enhanced，勿影响表格/卡片） */
.status-badge-enhanced.status-active {
  background: transparent;
  border-color: #28a745;
  color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.status-badge-enhanced.status-take-profit {
  background: transparent;
  border-color: #01b622;
  color: #01b622;
  box-shadow: 0 2px 8px rgba(1, 182, 34, 0.2);
}

.status-badge-enhanced.status-stop-loss {
  background: transparent;
  border-color: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
}

.status-badge-enhanced.status-closed {
  background: linear-gradient(135deg, #888888 0%, #555555 100%);
  border-color: #888888;
  color: white;
}

.status-badge-enhanced.status-pending {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-color: #FFD700;
  color: #000;
}

.status-badge-enhanced.status-cancelled {
  background: linear-gradient(135deg, #FF4444 0%, #CC0000 100%);
  border-color: #FF4444;
  color: white;
}

.status-badge-enhanced.status-default {
  background: linear-gradient(135deg, #666666 0%, #444444 100%);
  border-color: #666666;
  color: white;
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
  color: #01b622;
  position: relative;
}

.profit-negative {
  color: #e74c3c;
  position: relative;
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
}

/* Welcome Popup Modal Styles */
.welcome-modal-dialog {
  max-width: 680px;
}

#welcomePopupModal.show .modal-dialog {
  animation: welcomeModalIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes welcomeModalIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.welcome-popup-modal {
  position: relative;
  background: rgba(26, 31, 58, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg), 0 0 60px rgba(102, 126, 234, 0.15);
  overflow: hidden;
}

.welcome-modal-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.welcome-modal-glow--primary {
  top: -80px;
  right: -60px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 70%);
}

.welcome-modal-glow--secondary {
  bottom: -60px;
  left: -40px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.15) 0%, transparent 70%);
}

.welcome-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.welcome-close-btn svg {
  width: 16px;
  height: 16px;
}

.welcome-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: rgba(102, 126, 234, 0.4);
}

.welcome-modal-body {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.welcome-profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.welcome-avatar-ring {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 3px;
  background: var(--primary-gradient);
}

.welcome-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-primary);
}

.welcome-profile-info {
  min-width: 0;
}

.welcome-badge {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-primary);
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.24);
}

.welcome-trader-name {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-trader-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.welcome-tagline {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
}

.welcome-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 1.5rem;
}

.welcome-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all var(--transition-base);
}

.welcome-stat-card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.06);
  transform: translateY(-2px);
}

.welcome-stat-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--primary-gradient);
  color: white;
}

.welcome-stat-icon svg {
  width: 18px;
  height: 18px;
}

.welcome-stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  word-break: break-all;
}

.welcome-stat-value.positive {
  color: var(--color-success);
}

.welcome-stat-value.negative {
  color: var(--color-danger);
}

.welcome-stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.welcome-announcement {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-radius: var(--border-radius);
}

.welcome-announcement-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #fbbf24;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.welcome-announcement-header svg {
  width: 16px;
  height: 16px;
}

.welcome-announcement-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.welcome-announcement-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.welcome-benefits {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.welcome-benefits-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.welcome-benefits-title svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.welcome-benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.welcome-benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--border-radius-sm);
  background: rgba(102, 126, 234, 0.06);
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

.welcome-benefit-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-success);
}

.welcome-cta-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-gradient);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow);
}

.welcome-cta-btn svg {
  width: 20px;
  height: 20px;
}

.welcome-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.45);
}

.welcome-cta-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .welcome-profile-header {
    flex-direction: column;
    text-align: center;
  }

  .welcome-stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-benefits-grid {
    grid-template-columns: 1fr;
  }

  .welcome-trader-name {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .mobile-profile-content {
    padding: 10px 10px 6px;
  }

  .mobile-profile-card {
    padding: 12px 10px 10px;
  }

  .mobile-avatar-wrapper {
    width: 62px;
    height: 62px;
  }

  .mobile-name-large {
    font-size: 16px;
  }

  .mobile-title-inline {
    font-size: 11px;
  }

  .mobile-pnl-value {
    font-size: 11px;
  }

  .mobile-stat-chip strong {
    font-size: 11px;
  }

  .main-content {
    padding: var(--spacing-sm);
    padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  }

  .strategy-section.mobile-strategy-prominent {
    padding: var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  .strategy-section.mobile-strategy-prominent .section-title {
    font-size: 16px;
  }

  .strategy-section.mobile-strategy-prominent .tab-button {
    padding: 10px 12px;
    font-size: 12px;
  }

  .section-title {
    font-size: 15px;
  }

  .analysis-text {
    font-size: 13px;
  }

  .update-badge {
    font-size: 10px;
    padding: 3px 8px;
  }

  .welcome-announcement--mobile .welcome-announcement-title {
    font-size: 1rem;
    padding-right: 2.75rem;
  }

  .welcome-announcement-scroll {
    max-height: min(48vh, 300px);
    padding: 0.875rem;
  }

  .welcome-announcement--mobile .welcome-announcement-text {
    font-size: 0.875rem;
    line-height: 1.7;
  }

  .welcome-mobile-dismiss {
    padding: 12px 18px;
    font-size: 0.875rem;
  }

  .welcome-cta-btn {
    width: 100%;
    justify-content: center;
  }

  .contact-popup {
    width: calc(100% - 32px);
    left: 16px;
    right: 16px;
    bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  }
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

.performance-value.profit-positive {
  color: #01b622 !important;
}

.performance-value.profit-negative {
  color: #e74c3c !important;
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

.trading-focus {
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.trading-focus h4 {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trading-focus h4::before {
  content: "🎯";
  font-size: 1rem;
}

.trading-focus ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trading-focus li {
  color: #e0e0e0;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  line-height: 1.6;
  position: relative;
  padding-left: 1.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.trading-focus li::before {
  content: "▶";
  color: #ffd700;
  position: absolute;
  left: 0;
  top: 0.75rem;
  font-size: 0.8rem;
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
  right: 24px;
  bottom: 24px;
  background: #ffd700;
  color: #1a1a2e;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.contact-btn i {
  font-size: 1rem;
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
/* 全新的快速操作栏 */
.quick-actions {
            display: flex;
            flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
        }

.action-button {
            display: flex;
            align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: 0;
}

.action-button:hover {
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: var(--shadow-md);
}

.action-button:hover::before {
  opacity: 0.1;
}

.action-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.action-button:hover .action-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.action-icon-wrapper svg {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

.leaderboard-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.vip-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.likes-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.likes-btn.active .action-icon-wrapper {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  animation: heartBeat 0.6s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
}

.action-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.action-value {
  font-size: 13px;
  font-weight: 600;
  color: #c4b5fd;
  letter-spacing: 0.02em;
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

 .redirect-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            padding: 15px 30px;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            font-weight: 500;
            z-index: 10000;
            white-space: nowrap;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            -webkit-transform: translateX(-50%);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            will-change: transform, opacity;
        }

        .redirect-message::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #ffd700 0%, #4361ee 100%);
            animation: progressBar 3s linear forwards;
            -webkit-animation: progressBar 3s linear forwards;
            opacity: 0.15;
        }

        .redirect-message .text {
            background: linear-gradient(90deg, #ffd700 0%, #4361ee 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: textGradient 3s linear forwards;
            -webkit-animation: textGradient 3s linear forwards;
        }

        .redirect-message .dots {
            display: inline-block;
            width: 24px;
        }

        .redirect-message .dots::after {
            content: '';
            animation: dots 1s infinite;
            -webkit-animation: dots 1s infinite;
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

/* Trading Strategy 灯泡闪烁发光 */
.glow-bulb {
  display: inline-block;
  color: #facc15;
  animation: bulb-blink 1.4s ease-in-out infinite;
}

@keyframes bulb-blink {
  0%, 100% {
    opacity: 0.7;
    color: #f59e0b;
    transform: scale(0.96);
    filter: drop-shadow(0 0 3px rgba(250, 204, 21, 0.7))
            drop-shadow(0 0 6px rgba(234, 179, 8, 0.5));
  }
  50% {
    opacity: 1;
    color: #fef08a;
    transform: scale(1.08);
    filter: drop-shadow(0 0 8px rgba(254, 240, 138, 1))
            drop-shadow(0 0 16px rgba(250, 204, 21, 0.95))
            drop-shadow(0 0 24px rgba(255, 255, 180, 0.85));
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

 @keyframes progressBar {
     0% {
         transform: translateX(-100%);
     }
     100% {
         transform: translateX(0);
     }
 }

 @keyframes textGradient {
     0% {
         opacity: 0.7;
         background-position: 0 0;
     }
     50% {
         opacity: 1;
         background-position: 100% 0;
     }
     100% {
         opacity: 0.7;
         background-position: 200% 0;
     }
 }

 @keyframes dots {
     0% { content: '.'; }
     33% { content: '..'; }
     66% { content: '...'; }
     100% { content: ''; }
 }
</style>

