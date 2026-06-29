<template>
  <div class="app-container">
      <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark mb-3">
      <div class="container" style="font-size: 30px;">
      
                <i class="bi bi-trophy-fill" style="color:#ffd700;margin-right: 20px;"></i> Trader Leaderboard
            
        <div class="navbar-nav ms-auto">
         
         <a href="/" class="back-btn" style="text-align: center; margin-top: 20px; "><i class="bi bi-arrow-left"></i> Back to Dashboard</a>
        </div>
      </div>
    </nav>
  <div class="leaderboard-container">


    <!-- 头部区域 -->
    <div class="leaderboard-header">
      <h1>Trader Leaderboard</h1>
      <p>Competition Period: 1st - Last day of each month (Monthly Competition)</p>

<p>Important Notice: Any form of cheating will result in permanent disqualification from the rankings.</p>
    </div>

    <!-- 竞赛介绍卡片 -->
    <div class="competition-info-card">
      <div class="competition-section total-profit-section">
        <div class="section-label">Total Profit</div>
        <div class="section-value">
            <p style="margin-bottom: 0.5rem; text-align: center; display: flex; justify-content: center; gap: 2rem;font-size: 1rem;">
                            <span>🥇 $100,000</span>
                            <span>🥈 $80,000</span>
                            <span>🥉 $50,000</span>
                        </p>
        </div>
       
      </div>
      
      <div class="competition-section vip-section">
        <div class="section-label">VIP Traders</div>
        <div class="section-value">
            <p style="margin-bottom: 0.5rem; text-align: center; display: flex; justify-content: center; gap: 2rem; font-size: 1.2rem;">
                            <span>🥇 $50,000</span>
                            <span>🥈 $30,000</span>
                            <span>🥉 $10,000</span>
                        </p>
        </div>
       
      </div>
      
      <div class="competition-section likes-section">
        <div class="section-label">Total Likes</div>
        <div class="section-value">
            <p style="margin-bottom: 0.5rem; text-align: center; display: flex; justify-content: center; gap: 2rem;font-size: 1.2rem;">
                            <span>🥇 $10,000</span>
                            <span>🥈 $8,000</span>
                            <span>🥉 $5,000</span>
                        </p>
        </div>
     
      </div>
    </div>

    <!-- 竞赛规则区域 -->
    <div v-if="showDetails" class="competition-rules-section">
      <h4>Competition Rules</h4>
      <ul>
        <li>Traders are ranked based on their total profit percentage</li>
        <li>Top 3 traders will receive exclusive rewards</li>
        <li>Competition resets every Sunday at midnight UTC</li>
        <li>All verified traders are automatically enrolled</li>
      </ul>
    </div>

    <!-- 排序选项 -->
    <div class="sort-options">
      <div :class="['sort-option', { active: currentSortType === 'followers' }]" @click="sortBy('followers')">
        <i class="bi bi-people-fill"></i>
        Followers
      </div>
      <div :class="['sort-option', { active: currentSortType === 'profit' }]" @click="sortBy('profit')">
        <i class="bi bi-currency-dollar"></i>
        Total Profit
      </div>
      <div :class="['sort-option', { active: currentSortType === 'likes' }]" @click="sortBy('likes')">
        <i class="bi bi-hand-thumbs-up-fill"></i>
        Likes
      </div>
    </div>

    <!-- 桌面端前三名展示 -->
    <div class="podium-row">
      <!-- 第二名卡片 -->
      <div v-if="traders.length > 1" class="podium-card podium-rank-2">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">2</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[1].profile_image_url" :alt="traders[1].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[1].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[1].trader_name }}</div>
        <div class="podium-title">{{ traders[1].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[1].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[1].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[1].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item" @click="handleLikeClick(traders[1].id)">
            <i class="bi bi-hand-thumbs-up-fill" ></i>
            {{ traders[1].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>

      <!-- 第一名卡片 -->
      <div v-if="traders.length > 0" class="podium-card podium-rank-1">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">1</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[0].profile_image_url" :alt="traders[0].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[0].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[0].trader_name }}</div>
        <div class="podium-title">{{ traders[0].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[0].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[0].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[0].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item" @click="handleLikeClick(traders[0].id)">
            <i class="bi bi-hand-thumbs-up-fill" ></i>
            {{ traders[0].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>

      <!-- 第三名卡片 -->
      <div v-if="traders.length > 2" class="podium-card podium-rank-3">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">3</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[2].profile_image_url" :alt="traders[2].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[2].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[2].trader_name }}</div>
        <div class="podium-title">{{ traders[2].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[2].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[2].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[2].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-hand-thumbs-up-fill" @click="handleLikeClick(traders[2].id)"></i>
            {{ traders[2].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端轮播组件 -->
    <div class="mobile-podium-carousel">
       <!-- 第一名卡片 -->
      <div v-if="traders.length > 0" class="podium-card-mobile podium-rank-1">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">1</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[0].profile_image_url" :alt="traders[0].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[0].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[0].trader_name }}</div>
        <div class="podium-title">{{ traders[0].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[0].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[0].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[0].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item" @click="handleLikeClick(traders[0].id)">
            <i class="bi bi-hand-thumbs-up-fill" ></i>
            {{ traders[0].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>

       <!-- 第二名卡片 -->
      <div v-if="traders.length > 1" class="podium-card-mobile podium-rank-2">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">2</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[1].profile_image_url" :alt="traders[1].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[1].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[1].trader_name }}</div>
        <div class="podium-title">{{ traders[1].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[1].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[1].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[1].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item" @click="handleLikeClick(traders[1].id)">
            <i class="bi bi-hand-thumbs-up-fill" ></i>
            {{ traders[1].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>

     

      <!-- 第三名卡片 -->
      <div v-if="traders.length > 2" class="podium-card-mobile podium-rank-3">
        <div class="podium-avatar-container">
          <div class="podium-rank-badge">
            <div class="rank-number">3</div>
          </div>
          <div class="podium-avatar">
            <img :src="traders[2].profile_image_url" :alt="traders[2].trader_name">
          </div>
        </div>
        <div class="podium-profit">
          <span class="podium-profit-amount">{{ formatMoneySigned(traders[2].total_profit) }}</span>
          <div class="podium-profit-bar">
            <div class="podium-profit-fill" style="width: 100%"></div>
          </div>
        </div>
        <div class="podium-name">{{ traders[2].trader_name }}</div>
        <div class="podium-title">{{ traders[2].professional_title }}</div>
        <div class="podium-bottom-row">
          <div class="podium-bottom-item">
            <i class="bi bi-activity"></i>
            {{ traders[2].total_trades }}<span class="podium-bottom-label">Trades</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-percentage"></i>
            {{ traders[2].win_rate }}%<span class="podium-bottom-label">Win Rate</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-people-fill"></i>
            {{ traders[2].followers_count }}<span class="podium-bottom-label">Followers</span>
          </div>
          <div class="podium-bottom-item">
            <i class="bi bi-hand-thumbs-up-fill" @click="handleLikeClick(traders[2].id)"></i>
            {{ traders[2].likes_count }}<span class="podium-bottom-label">Likes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4-20名列表 -->
    <div class="list-table" v-if="traders.length>3">
      <div v-for="(trader, index) in traders.slice(3, traders.length)" :key="trader.id" class="list-row">
        <div class="list-rank">{{ index + 4 }}</div>
        <img :src="trader.profile_image_url" class="list-avatar" :alt="trader.trader_name">
        <div style="min-width:120px;">
          <div class="list-name">{{ trader.trader_name }}</div>
        </div>
        <div class="list-middle-data">
          <div class="list-stat-item">
            <i class="bi bi-people-fill"></i>
            {{ trader.followers_count.toLocaleString() }}
            <span class="stat-label">Members</span>
          </div>
          <div class="list-stat-item" @click="handleLikeClick(trader.id)">
            <i class="bi bi-hand-thumbs-up-fill like-btn" ></i>
            <span class="likes-count">{{ trader.likes_count }}</span>
            <span class="stat-label">Likes</span>
          </div>
          <div class="list-stat-item">
            <i class="bi bi-graph-up"></i>
            {{ trader.win_rate }}%
            <span class="stat-label">Win Rate</span>
          </div>
          <div class="list-stat-item">
            <i class="bi bi-clock-history"></i>
            {{ trader.total_trades.toLocaleString() }}
            <span class="stat-label">Trades</span>
          </div>
        </div>
        <div class="list-profit ms-auto">
          <span class="list-social-label">Monthly Profit</span>
          {{ formatMoneySigned(trader.total_profit) }}
        </div>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="traders.length === 0" class="no-data-message">
      <i class="bi bi-search"></i>
      <p>No traders found</p>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import{ getleaderboard, likeleaderboard } from '../../api/module/web/index'
import { formatMoneySigned } from '@/utils/formatNumber';
import { layer } from '@layui/layui-vue';
// 模拟数据
const traders = ref([
]);

// 状态管理
const currentSortType = ref('profit');
const showDetails = ref(false);
const carouselTrack = ref<HTMLElement>();
const currentIndex = ref(1);
// 排序函数
function sortBy(sortType: string) {
  currentSortType.value = sortType;
  
 
 
  get_leaderboard();
  // 重新初始化轮播
  initMobileCarousel();
}

// // 点赞功能
// function likeTrader(traderId: number) {
//   console.log(traderId)
//     handleLikeClick(traderId)
// }

// 切换详情显示
function toggleDetails() {
  showDetails.value = !showDetails.value;
}

// 初始化移动端轮播
function initMobileCarousel() {
  if (!carouselTrack.value) return;
  
  const wrappers = carouselTrack.value.querySelectorAll('.carousel-avatar-wrapper');
  currentIndex.value = 1;
  
  updateAvatarPositions(wrappers);
  
  // 点击事件
  wrappers.forEach((wrapper, index) => {
    wrapper.addEventListener('click', () => {
      if (index !== currentIndex.value) {
        currentIndex.value = index;
        updateAvatarPositions(wrappers);
        updateCarouselData();
      }
    });
  });
  
  // 触摸滑动支持
  let startX = 0;
  let isDragging = false;
  
  carouselTrack.value.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    e.preventDefault();
  });
  
  carouselTrack.value.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    wrappers.forEach((wrapper, index) => {
      const offset = index - currentIndex.value;
      const xPos = offset * 160 + diff * 0.5;
      const scale = index === currentIndex.value ? 1.5 : 0.8;
      (wrapper as HTMLElement).style.transform = `translate(-50%, 0) translateX(${xPos}px) scale(${scale})`;
    });
  });
  
  carouselTrack.value.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    
    if (Math.abs(diff) > 30) {
      if (diff > 0 && currentIndex.value > 0) {
        currentIndex.value--;
      } else if (diff < 0 && currentIndex.value < 2) {
        currentIndex.value++;
      }
      
      wrappers.forEach(wrapper => {
        (wrapper as HTMLElement).style.transition = 'all 0.3s cubic-bezier(.4,1.3,.6,1)';
      });
      
      updateAvatarPositions(wrappers);
      updateCarouselData();
      
      setTimeout(() => {
        wrappers.forEach(wrapper => {
          (wrapper as HTMLElement).style.transition = '';
        });
      }, 300);
    } else {
      updateAvatarPositions(wrappers);
    }
    
    isDragging = false;
  });
}

// 更新轮播头像位置
function updateAvatarPositions(wrappers: NodeListOf<Element>) {
  wrappers.forEach((wrapper, index) => {
    const offset = index - currentIndex.value;
    const xPos = offset * 160;
    const scale = index === currentIndex.value ? 1.5 : 0.8;
    const zIndex = index === currentIndex.value ? 3 : 1;
    const opacity = index === currentIndex.value ? 1 : 0.6;
    
    const wrapperEl = wrapper as HTMLElement;
    const avatarEl = wrapper.querySelector('.carousel-avatar') as HTMLElement;
    const badgeEl = wrapper.querySelector('.rank-badge') as HTMLElement;
    
    if (index === currentIndex.value) {
      wrapperEl.style.zIndex = zIndex.toString();
      wrapperEl.style.opacity = opacity.toString();
      wrapperEl.style.transform = `translate(-50%, 0) translateX(${xPos}px) scale(${scale})`;
      avatarEl.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
      badgeEl.style.opacity = '1';
    } else {
      wrapperEl.style.zIndex = zIndex.toString();
      wrapperEl.style.opacity = opacity.toString();
      wrapperEl.style.transform = `translate(-50%, 0) translateX(${xPos}px) scale(${scale})`;
      avatarEl.style.boxShadow = 'none';
      badgeEl.style.opacity = '0.8';
    }
  });
}

// 更新轮播数据显示
function updateCarouselData() {
  // 根据当前选中的索引获取对应的交易者数据
  let selectedTrader;
  if (currentIndex.value === 0) {
    // 左侧显示第二名
    selectedTrader = traders.value[1];
  } else if (currentIndex.value === 1) {
    // 中间显示第一名
    selectedTrader = traders.value[0];
  } else {
    // 右侧显示第三名
    selectedTrader = traders.value[2];
  }
  
  if (!selectedTrader) return;
  
  const dataEl = document.getElementById('carouselData');
  if (!dataEl) return;
  
  // 更新DOM内容
  const nameEl = dataEl.querySelector('.carousel-name');
  const titleEl = dataEl.querySelector('.carousel-title');
  const statsEl = dataEl.querySelector('.carousel-stats');
  
  if (nameEl && titleEl && statsEl) {
    nameEl.textContent = selectedTrader.trader_name;
    titleEl.textContent = selectedTrader.professional_title;
    
    statsEl.innerHTML = `
      <div class="carousel-stat">
        <i class="bi bi-currency-dollar stat-icon" style="color:#2ecc71;"></i>
        <span class="stat-value">${selectedTrader.total_profit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}$</span>
        <span class="stat-label">Monthly Profit</span>
      </div>
      <div class="carousel-stat">
        <i class="bi bi-people-fill stat-icon" style="color:#ffd700;"></i>
        <span class="stat-value">${selectedTrader.followers_count.toLocaleString()}</span>
        <span class="stat-label">Followers</span>
      </div>
      <div class="carousel-stat" click="handleLikeClick(${selectedTrader.id})">
        <i class="bi bi-hand-thumbs-up-fill stat-icon" style="color:#ffd700;"></i>
        <span class="stat-value">${selectedTrader.likes_count.toLocaleString()}</span>
        <span class="stat-label">Likes</span>
      </div>
      <div class="carousel-stat">
        <i class="bi bi-graph-up stat-icon" style="color:#2ecc71;"></i>
        <span class="stat-value">${selectedTrader.win_rate}%</span>
        <span class="stat-label">Win Rate</span>
      </div>
    `;
  }
}
const get_leaderboard=async()=>{
  let res=await getleaderboard({'sort':currentSortType.value});
  if(res.success){
    traders.value=res.data;
  }
}
// 处理点赞点击事件
const handleLikeClick = async (id:number) => {
  try {
          try{
              let histaryday = new Date();
              histaryday.setDate(histaryday.getDate() - 1);
              console.log(histaryday.toISOString().slice(0, 10))
              localStorage.removeItem(`loadlikes_${histaryday.toISOString().slice(0, 10)}`)
          }
          catch(error){
            
          }
        const today = new Date().toISOString().slice(0, 10);
        const likeKey = `loadlikes_${today}`;
      if (localStorage.getItem(likeKey)) {
         layer.msg("Today and past, please come back tomorrow. Thank you for your support!", { icon : 6, time: 2500})
       
        return;
      }
    const response = await likeleaderboard({ id: id});
    
    if (response.success) {
       localStorage.setItem(likeKey, '1');
       layer.msg("Liked successfully, thank you!", { icon : 6, time: 2500})
      get_leaderboard();
    //  isLiked.value = response.isLiked;
      
    //   // 更新点赞数
    //   if (isLiked.value) {
    //     like sCount.value++;
    //   } else {
    //     likesCount.value--;
    //   }
      
    //   // 更新显示的点赞数
    //   if (trader_profiles.value) {
    //     trader_profiles.value.likes_count = likesCount.value;
    //   }
      
    //   // 更新UI显示
    //   updateLikeIcon();
    } else {
      console.error('Like operation failed:', response.message);
    }
  } catch (error) {
    console.error('Error during like operation:', error);
  }
};

// 组件挂载时初始化
onMounted(() => {
  get_leaderboard('profit')
  // 从URL获取排序参数
  const urlParams = new URLSearchParams(window.location.search);
  const sortType = urlParams.get('sort') || 'profit';
  if (sortType !== currentSortType.value) {
    sortBy(sortType);
  }
  
  // 监听窗口大小变化
  const handleResize = () => {
    // 无需为移动设备初始化轮播
  };
  
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时清理
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<style scoped>
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
/* 全局样式 */
* {
  box-sizing: border-box;
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

/* 容器样式 */
.leaderboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 返回按钮 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
}

/* 头部区域 */
.leaderboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.leaderboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #ffffff, #14f195);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.leaderboard-header p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 竞赛信息卡片 */
.competition-info-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.competition-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.competition-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #14f195, #2dd4bf);
}

.section-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.section-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
}

.section-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.vip-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
}

.vip-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  border-radius: 4px;
  transition: width 1s ease;
}

.details-toggle {
  background: none;
  border: none;
  color: #14f195;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  padding: 5px 0;
  transition: all 0.3s ease;
}

.details-toggle:hover {
  color: #2dd4bf;
  transform: translateX(3px);
}

/* 竞赛规则区域 */
.competition-rules-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
  transition: all 0.3s ease;
}

.competition-rules-section h4 {
  color: #14f195;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.competition-rules-section ul {
  margin: 0;
  padding-left: 20px;
}

.competition-rules-section li {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 排序选项 */
.sort-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.sort-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: all 0.5s ease;
}

.sort-option:hover::before {
  left: 100%;
}

.sort-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.2);
}

.sort-option.active {
  background: linear-gradient(135deg, #14f195, #2dd4bf);
  border-color: #14f195;
  box-shadow: 0 8px 25px rgba(20, 241, 149, 0.3);
  animation: borderShine 3s infinite;
}

/* 领奖台样式 */
.podium-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 60px;
  height: 520px;
}

.podium-card {
  min-width: 380px;
  max-width: 420px;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}



.podium-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
  animation: shine 3s infinite;
}

.podium-rank-1 {
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 237, 78, 0.1));
  border-color: rgba(255, 215, 0, 0.3);
  z-index: 3;
}

.podium-rank-2 {
  height: 100%;
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(229, 231, 235, 0.1));
  border-color: rgba(192, 192, 192, 0.3);
  z-index: 2;
}

.podium-rank-3 {
  height: 100%;
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(253, 186, 116, 0.1));
  border-color: rgba(205, 127, 50, 0.3);
  z-index: 1;
}

.podium-avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.podium-rank-badge {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 3;
  margin-right: 0; /* 排名徽章在头像左侧 */
}

.podium-rank-1 .podium-rank-badge {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
}

.podium-rank-2 .podium-rank-badge {
  background: linear-gradient(135deg, #c0c0c0, #e5e7eb);
}

.podium-rank-3 .podium-rank-badge {
  background: linear-gradient(135deg, #cd7f32, #fdba74);
}

.rank-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.podium-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 2;
  margin-left: -10px; /* 调整头像位置，让排名徽章部分重叠 */
}

.podium-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.podium-profit {
  margin-bottom: 15px;
}

.podium-profit-amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #14f195;
}

.podium-profit-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
}

.podium-profit-fill {
  height: 100%;
  background: linear-gradient(90deg, #14f195, #2dd4bf);
  border-radius: 2px;
  animation: shine 3s infinite;
}

.podium-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
}

.podium-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.podium-bottom-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.podium-bottom-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
 cursor: pointer;
}

.podium-bottom-item i {
  font-size: 1.2rem;
  color: #ffffff;
}

.podium-bottom-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  margin-top: 3px;
}

/* 移动端轮播 */
.mobile-podium-carousel {
  display: none;
  position: relative;
  max-width: 360px;
  
}

.podium-card-mobile {
  min-width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.carousel-track {
  position: relative;
  height: 150px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-avatar-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s cubic-bezier(.4,1.3,.6,1);
}

.carousel-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.carousel-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.rank-number {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}

.carousel-data {
  text-align: center;
}

.carousel-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
}

.carousel-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
}

.carousel-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.carousel-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* 列表样式 */
.list-table {
  margin-bottom: 50px;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.list-row:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  transform: translateX(10px);
  border-color: rgba(255, 255, 255, 0.2);
}

.list-rank {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  font-size: 1.1rem;
  margin-right: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.list-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-right: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.list-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.list-middle-data {
  flex: 1;
  display: flex;
  gap: 40px;
  margin: 0 30px;
  font-weight: 600;
}

.list-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.list-stat-item i {
  font-size: 1.1rem;
  color: #ffffff;
}

.like-btn {
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  transform: scale(1.2);
  color: #14f195;
}

.list-profit {
  text-align: right;
  color: rgb(49, 212, 49);
    font-size: 16px;
    font-weight: 600;
}

.list-social-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 3px;
}

.likes-count {
  margin-left: 5px;
}

/* 无数据提示 */
.no-data-message {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.no-data-message i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
}

.no-data-message p {
  font-size: 1.1rem;
  margin: 0;
}

/* 动画定义 */
@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes borderShine {
  0% {
    border-image-slice: 1;
    border-image-source: linear-gradient(90deg, transparent, #14f195, transparent);
    background-position: -200% 0;
  }
  100% {
    border-image-slice: 1;
    border-image-source: linear-gradient(90deg, transparent, #14f195, transparent);
    background-position: 200% 0;
  }
}

@keyframes rankShine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .competition-info-card {
    grid-template-columns: 1fr;
  }
  
  .podium-row {
    flex-wrap: wrap;
    height: auto;
    align-items: stretch;
  }
  
  .podium-card {
    height: auto !important;
    margin-bottom: 20px;
  }
  
  .list-middle-data {
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .leaderboard-container {
    padding: 15px;
  }
  
  .leaderboard-header h1 {
    font-size: 2rem;
  }
  
  .sort-options {
    gap: 5px;
  }
  
  .sort-option {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
  
  .podium-row {
    display: none;
  }
  
  .mobile-podium-carousel {
    display: block;
  }
  
  .list-table {
    margin-top: 30px;
  }
  
  .list-row {
    padding: 15px;
    flex-wrap: wrap;
  }
  
  .list-rank {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
    margin-right: 10px;
  }
  
  .list-avatar {
    width: 45px;
    height: 45px;
    margin-right: 10px;
  }
  
  .list-middle-data {
    width: 100%;
    margin: 15px 0;
    gap: 10px;
  }
  
  .list-stat-item .stat-value {
    font-size: 0.9rem;
  }
  
  .list-stat-item .stat-label {
    font-size: 0.7rem;
  }
  
  .list-profit {
    margin: 0 auto;
    text-align: center;
    color: rgb(49, 212, 49);
    font-size: 16px;
    font-weight: 600;
  }
  
  .list-social-label {
    display: none;
  }
}
</style>