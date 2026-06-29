<template>
  <div class="ai-tools-page">
    <!-- Navigation Bar -->
    <navcomponent></navcomponent>

    <!-- AI Header -->
    <div class="ai-header">
      <div class="container">
        <h1><i class="bi bi-robot"></i> AI Trading Tools</h1>
        <p>Advanced AI-powered stock analysis and selection tools</p>
      </div>
    </div>

    <!-- AI Tools Container -->
    <div class="container" style="max-width: 1200px;">
      <div class="ai-tools-container">
        <!-- AI Recommendation History -->
        <div class="ai-tool-card">
          <div class="tool-header">
            <div class="tool-icon">
              <i class="bi bi-stars"></i>
            </div>
            <div class="tool-title">
              <h3>AI Recommendation History</h3>
              <p>Intelligent stock selection based on market data, technical analysis, and AI algorithms</p>
            </div>
            <div>
              <a href="/AITools" class="ai-tools-text">AI Tools</a>
            </div>
          </div>
          
          <div class="tool-content">
           
              <h4><i class="bi bi-trophy"></i> AI Recommendations</h4>
              <div id="stockPickerResults">
                <div class="loading-spinner" v-if="isLoading">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Analyzing...</span>
                  </div>
                  <p style="margin-top: 1rem;">Load AI recommendation history data...</p>
                </div>
                <div v-else-if="errorMessage">
                  <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Error generating recommendations: {{ errorMessage }}
                  </div>
                </div>
                <div v-else-if="recommendations.length === 0">
                  <div class="text-center text-muted">
                    <i class="bi bi-info-circle" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">No recommendations found for the selected criteria</p>
                  </div>
                </div>
                <div v-else>
                  <div class="results-section" 
                    v-for="(item, index) in recommendations" 
                    :key="index" 
                   
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <div class="stock-header">
                      <div class="stock-symbol">{{ item.out_info.symbol }}</div>
                      <div class="stock-price-info">
                        <span class="current-price">{{parseFloat(item.put_price || 0).toFixed(2)}}</span>
                        <span class="price-change positive">
                          Recommended price
                        </span>
                      </div>
                      <div class="stock-price-info">
                        <span class="current-price">{{parseFloat(item.currprice || 0).toFixed(2)}}</span>
                        <span class="price-change" :class="calculateRatio(item) >= 0 ? 'positive' : 'negative'">
                          Current price
                        </span>
                      </div>
                      <div class="stock-price-info">
                        <span class="current-price">{{ calculateRatio(item).toFixed(2) }}%</span>
                        <span class="price-change" :class="calculateRatio(item) >= 0 ? 'positive' : 'negative'">
                          P&L Ratio
                        </span>
                      </div>
                      <div class="stock-price-info">
                        <span class="current-price">{{ formatDate(item.put_time) }}</span>
                        <span class="price-change negative">
                          Recommended date
                        </span>
                      </div>
                    </div>
                    
                    <div class="stock-name">{{ item.out_info.name }}</div>
                    
                    <div class="stock-score">
                      <span class="score-badge">AI Score: {{ item.out_info.score || 0 }}/100</span>
                      <span :class="['badge', `bg-${getScoreColor(item.out_info.score || 0)}`]">{{ getScoreLabel(item.out_info.score || 0) }}</span>
                    </div>
                    
                    <div class="stock-metrics">
                      <div class="metric-item">
                        <span class="metric-label">Market Cap:</span>
                        <span class="metric-value">{{ formatMarketCap(item.out_info.market_cap || 0) }}</span>
                      </div>
                      <div v-if="item.out_info.pe_ratio > 0" class="metric-item">
                        <span class="metric-label">P/E Ratio:</span>
                        <span class="metric-value">{{ parseFloat(item.out_info.pe_ratio).toFixed(1) }}</span>
                      </div>
                      <div class="metric-item">
                        <span class="metric-label">Volume:</span>
                        <span class="metric-value" :class="parseFloat(item.out_info.volume_ratio || 1) > 1.5 ? 'high-volume' : ''">
                          {{ parseFloat(item.out_info.volume_ratio || 1).toFixed(1) }}x
                        </span>
                      </div>
                    </div>
                    
                    <div class="stock-reason">{{ item.out_info.reason }}</div>
                    
                    <div class="stock-footer">
                      <span class="sector-tag">
                        <i class="bi bi-tag"></i> {{ item.out_info.sector }}
                      </span>
                      <span class="return-estimate" :class="parseFloat(item.out_info.expectedReturn || 0) >= 0 ? 'positive' : 'negative'">
                        <i class="bi bi-graph-up"></i> {{ item.out_info.expectedReturn }}%
                      </span>
                      <span class="risk-level">
                        <i class="bi bi-shield"></i> {{ item.out_info.riskLevel }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   
    </div>
  </div>
</template>

<script>
import { getAIHistory } from '@/api/module/web/ai'
import navcomponent from '../component/nav/nav.vue'
import { useUserStore } from '@/store';
import router from '@/router';
import { formatUSDate } from '@/utils/dateFormat';
import { formatMarketCapRight } from '@/utils/formatNumber';
export default {
  name: 'AIHistoryView',
  components: {
    navcomponent
  },
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      recommendations: [],
      // 新增的筛选和分页功能
      searchTerm: '',
      selectedTimeframe: '',
      sortBy: 'date',
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    // 筛选后的推荐记录
    filteredRecommendations() {
      let filtered = this.recommendations;
      
      // 搜索筛选
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          item.out_info.symbol.toLowerCase().includes(term) ||
          item.out_info.name.toLowerCase().includes(term)
        );
      }
      
      // 时间筛选
      if (this.selectedTimeframe) {
        const days = parseInt(this.selectedTimeframe);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.put_time);
          return itemDate >= cutoffDate;
        });
      }
      
      // 排序
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'symbol':
            return a.out_info.symbol.localeCompare(b.out_info.symbol);
          case 'performance':
            return this.calculateRatio(b) - this.calculateRatio(a);
          case 'score':
            return (b.out_info.score || 0) - (a.out_info.score || 0);
          case 'date':
          default:
            return new Date(b.put_time) - new Date(a.put_time);
        }
      });
      
      return filtered;
    },
    
    // 分页后的数据
    paginatedRecommendations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRecommendations.slice(start, end);
    },
    
    // 总页数
    totalPages() {
      return Math.ceil(this.filteredRecommendations.length / this.itemsPerPage);
    },
    
    // 可见页码
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    
    // 统计信息
    positiveRecommendations() {
      return this.recommendations.filter(item => this.calculateRatio(item) > 0).length;
    },
    
    negativeRecommendations() {
      return this.recommendations.filter(item => this.calculateRatio(item) < 0).length;
    },
    
    averagePerformance() {
      if (this.recommendations.length === 0) return 0;
      const total = this.recommendations.reduce((sum, item) => sum + this.calculateRatio(item), 0);
      return total / this.recommendations.length;
    },
    
    averageScore() {
      if (this.recommendations.length === 0) return 0;
      const total = this.recommendations.reduce((sum, item) => sum + (item.out_info.score || 0), 0);
      return total / this.recommendations.length;
    }
  },
  mounted() {
    const userStore = useUserStore();
    if (!userStore.token) {
      router.push('/userlogin');
      return;
    }
    this.loadRecommendations();
  },
  methods: {
    async loadRecommendations() {
      this.isLoading = true;
      this.errorMessage = '';
      this.recommendations = [];
      
      try {
        const data = await getAIHistory();
        
        if (!data.success) {
          throw new Error(data.error || 'Server returned error status');
        }
        
        this.recommendations = data.data || [];
      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    calculateRatio(item) {
      const currentPrice = parseFloat(item.out_info.current_price || 0);
      const currPrice = parseFloat(item.currprice || 0);
      return currentPrice > 0 ? ((currPrice - currentPrice) / currentPrice) * 100 : 0;
    },
    formatMarketCap: formatMarketCapRight,
    getScoreColor(score) {
      if (score >= 80) return 'success';
      if (score >= 60) return 'warning';
      return 'danger';
    },
    getScoreLabel(score) {
      if (score >= 80) return 'Strong Buy';
      if (score >= 60) return 'Buy';
      if (score >= 40) return 'Hold';
      return 'Sell';
    },
    
    // 新增的方法
    formatDate(dateString) {
      return formatUSDate(dateString);
    },
    
    getDaysAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    },
    
    getPerformanceLabel(performance) {
      if (performance > 10) return 'Excellent';
      if (performance > 5) return 'Good';
      if (performance > 0) return 'Positive';
      if (performance > -5) return 'Neutral';
      return 'Poor';
    },
    
    getStatusBadge(performance) {
      if (performance > 10) return 'bg-success';
      if (performance > 5) return 'bg-info';
      if (performance > 0) return 'bg-primary';
      if (performance > -5) return 'bg-warning';
      return 'bg-danger';
    },
    
    getStatusText(performance) {
      if (performance > 10) return 'Outstanding';
      if (performance > 5) return 'Good';
      if (performance > 0) return 'Profitable';
      if (performance > -5) return 'Neutral';
      return 'Loss';
    },
    
    changePage(page) {
      this.currentPage = page;
    },
    
    viewDetails(item) {
      // 查看详细信息
      console.log('View details for:', item);
      // 这里可以添加模态框或跳转到详情页面
    },
    
    addToWatchlist(item) {
      // 添加到观察列表
      console.log('Add to watchlist:', item);
      // 这里可以添加API调用
    }
  }
};
</script>

<style scoped>
.ai-tools-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #13141f 0%, #181c2b 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.navbar {
  background-color: #181c2b;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  border-bottom: 1px solid #ffd700;
}

.navbar-brand {
  color: #ffd700;
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-brand:hover {
  color: #ffd700;
}

.back-btn {
  background: #13141f;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #202336;
  border-color: #ffd700;
  color: #ffd700;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.ai-header {
  background: linear-gradient(135deg, #ffb300 0%, #ffd700 50%, #b8860b 100%);
  padding: 3rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.ai-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10,5 L15,10 L10,15 L5,10 Z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>') repeat;
  opacity: 0.1;
}

.ai-header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #13141f;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(255,255,255,0.2);
  position: relative;
  z-index: 1;
}

.ai-header p {
  font-size: 1.2rem;
  color: #13141f;
  opacity: 0.9;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

.ai-tools-container {
  padding: 2rem 0;
}

.ai-tool-card {
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
  border-top: 3px solid #ffd700;
  padding: 2rem;
}

.ai-tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.ai-tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffd700 0%, #b8860b 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.ai-tool-card:hover::before {
  transform: scaleX(1);
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tool-icon {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  color: #1a1a2e;
  font-size: 1.25rem;
}

.tool-title {
  flex: 1;
}

.tool-title h3 {
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
}

.tool-title p {
  color: #a0a0a0;
  margin: 0;
  font-size: 0.95rem;
}

.ai-tools-text {
  color: #ffd700;
  text-decoration: none;
  border: 1px solid #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.ai-tools-text:hover {
  background: #ffd700;
  color: #13141f;
  text-decoration: none;
}

.tool-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.results-section {
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  min-height: 200px;
  width: 100%;
}

.results-section h4 {
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
}

.spinner-border {
  color: #ffd700;
}

.stock-recommendation {
  background: linear-gradient(145deg, #181c2b 0%, #13141f 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  border-left: 4px solid #ffd700;
}

.stock-recommendation:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  border-left-color: #ffb300;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.stock-symbol {
  font-size: 1.2rem;
  font-weight: 650;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.stock-name {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin-bottom: 1rem;
  font-weight: 500;
}

.stock-price-info {
  text-align: right;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  display: block;
}

.price-change {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.price-change.positive {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.price-change.negative {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.stock-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.score-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  color: #1a1a2e;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.stock-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 80px;
}

.metric-label {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
}

.metric-value.high-volume {
  color: #ffd700;
}

.stock-reason {
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.1);
  border-radius: 8px;
  border-left: 3px solid #ffd700;
}

.stock-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.sector-tag {
  display: inline-block;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.return-estimate {
  display: inline-block;
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.risk-level {
  display: inline-block;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.alert {
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #ffd700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-danger {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

/* AI Animation Effects */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.ai-thinking {
  animation: pulse 1.5s infinite;
}

/* Result Display Animation */
.result-item {
  opacity: 0;
  transform: translateY(20px);
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Text colors */
.text-success {
  color: #ffd700;
}

.text-danger {
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-header h1 {
    font-size: 2.5rem;
  }
  
  .tool-header {
    flex-direction: column;
    text-align: center;
  }
  
  .tool-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stock-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stock-price-info {
    text-align: left;
  }
  
  .stock-metrics {
    justify-content: center;
  }
  
  .stock-footer {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }
  
  .ai-tool-card {
    padding: 1.5rem 1rem;
  }
  
  .ai-header h1 {
    font-size: 2rem;
  }
  
  .ai-header p {
    font-size: 1rem;
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>