<template>
  <div class="app-container">
    <div class="number-flow"></div>
    <navcomponent />
    <div class="main-content">
     <section class="dashboard-hero">
        <div class="hero-bg-shapes" aria-hidden="true">
          <div class="hero-shape hero-shape-1"></div>
          <div class="hero-shape hero-shape-2"></div>
        </div>
        <div class="hero-inner">
          <div class="hero-profile-block">
            <button type="button" class="avatar-ring" id="avatar-preview-trigger" @click="handleAvatarClick">
              <img
                :src="user_info?.avatar_url || 'https://lnndxivliqxifhpdpidr.supabase.co/storage/v1/object/public/avatars/avatars/avatars/123456_0868673e94664ac2959bbe029a76675d.webp'"
                alt="avatar"
                class="hero-avatar"
              >
              <input
                ref="avatarFileInput"
                type="file"
                accept="image/*"
                style="display: none;"
                @change="handleAvatarFileChange"
              >
            </button>
            <div class="hero-copy">
              <span class="membership-badge">{{ user_info.membership_level || 'Member' }}</span>
              <h1 class="hero-title">Welcome back, {{ user_info.username }}</h1>
              <p class="hero-subtitle">Let professional investment strategies help you grow your wealth</p>
              <div class="hero-actions">
                <button type="button" class="btn-primary-gradient" @click="handleUploadTradeRecord">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Trade Record
                </button>
                <button type="button" class="btn-secondary-glass" id="settings-btn" @click="handleSettingsClick">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
     </section>

    <!-- Stats overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Initial Capital</div>
        <div class="stat-value stat-positive">{{ formatMoneyRight(user_info.initial_asset) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Profit</div>
        <div class="stat-value stat-accent">{{ formatMoneySigned(user_info.utotle_profit) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Monthly Profit</div>
        <div class="stat-value stat-positive">{{ formatMoneySigned(user_info.umonth_profit) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Last Month Profit</div>
        <div class="stat-value stat-positive">{{ formatMoneySigned(user_info.uprvmonth_profit) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Holding Profit</div>
        <div class="stat-value stat-warning" id="holding-profit-card">{{ formatMoneySigned(user_info.hold_profit) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Available Points</div>
        <div class="stat-value stat-accent">{{ formatCurrency(user_info.membership_points) }}</div>
      </div>
    </div>

    <!-- Investment Announcements & Strategies (Enhanced Version) -->
    <div class="section" style="max-width: 1400px;">
      <h2 class="card-title">Investment Announcements & Strategies</h2>
      <div v-if="!Vipdata.announcements_List || Vipdata.announcements_List.length === 0" class="no-announcements">
        <div style="text-align: center; padding: 40px; color: #b0c4e6; font-size: 1.1rem;">
          <i class="bi bi-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
          No Announcements
        </div>
      </div>
      <div v-else>
        <div class="announcement-card" v-for="value in Vipdata.announcements_List">
          <div class="announcement-header">
            <span class="announcement-title">{{ value.title }}</span>
            <span class="priority-badge priority-high">Priority: {{ value.priority }}</span>
          </div>
          <div class="announcement-content">{{ value.content }}</div>
          <div class="announcement-meta">
            <span>Publisher: {{ value.publisher }}</span>
            <span><span class="us-time" data-time="{{ value.publish_time }}">{{ formatUSDate(value.publish_time) }}</span></span>
          </div>
        </div>
      </div>
      <!-- VIP Trading Records Table Area -->
    <div class="vip-trades-section" style="max-width: 1400px;">
      <!-- PC Table -->
      <!-- <div class="table-wrapper trade-table-pc">
        <table class="vip-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Direction</th>
              <th>Symbol</th>
              <th>Entry Price</th>
              <th>Current Price</th>
              <th>Exit Price</th>
              <th>Quantity</th>
              <th>PnL</th>
              <th>ROI</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trade in Vipdata.tradelist" :key="trade.id">
              <td class="symbol-cell">{{ trade.trade_market }}</td>
              <td class="symbol-cell"><span class="trade-type-table">{{ trade.direction==1?'Long':'Short' }}</span></td>
              <td class="symbol-cell">{{ trade.symbol }}</td>
              <td>{{ formatPriceRight(trade.entry_price, trade.currency) }}</td>
              <td class="current-price" :data-symbol="trade.symbol">
                {{ trade.current_price ? formatPriceRight(trade.current_price, trade.currency) : '-' }}
              </td>
              <td>{{ trade.exit_price ? formatPriceRight(trade.exit_price, trade.currency) : '-' }}</td>
              <td>{{ trade.size }}</td>
              <td class="pnl-cell">
                <span class="trade-profit-table" >{{ formatMoneySigned(trade.profitAmount) }}</span>
              </td>
              <td class="roi-cell">
                <span class="trade-profit-table" >
                  {{ parseFloat(trade.profitRatio) > 0 ? '+' : '' }}{{ trade.profitRatio }}%
                </span>
              </td>
              <td class="date-cell">
                {{ formatUSDate(trade.entry_date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
     
      <!-- Mobile Table -->
      <div class="trade-card-list trade-mobile-list">
        <div v-for="t in Vipdata.tradelist" :key="t.id" class="trade-card">
          <div class="trade-card-header">
            <span class="trade-symbol">{{ t.trade_market || '-' }}</span>
            <span class="trade-symbol">{{ t.symbol || '-' }}</span>
            <span :class="['trade-type', t.direction==1 ? 'sell' : 'buy']">{{ t.direction==1 ? 'Long' : 'Short' }}</span>
            <span class="trade-date">{{ formatUSDate(t.entry_date) }}</span>
          </div>
          <div class="trade-card-body">
            <div class="trade-info-group">
              <div><span class="label">Entry:</span> <b>{{ formatPriceRight(t.entry_price, t.currency) }}</b></div>
           
              <div v-if="t.exit_price"><span class="label">Exit:</span> <b>{{ formatPriceRight(t.exit_price, t.currency) }}</b></div>
              <div v-else><span class="label" >Current:</span> <b>{{ t.current_price ? formatPriceRight(t.current_price, t.currency) : 'Loading...' }}</b></div>
               <div><span class="label">Qty:</span> <b>{{ t.quantity || t.size }}</b></div>
            </div>
          
            <div class="trade-info-group">
              <div>
                <span class="label">P&L:</span>
                <span class="trade-profit-table" v-if="t.exit_price" :class="getProfitColor(((t.exit_price-t.entry_price)*(t.quantity||t.size)*t.direction))">
                  {{ formatMoneySigned(((t.exit_price-t.entry_price)*(t.quantity||t.size)*t.direction), t.currency) }}
                </span>
                 <span class="trade-profit-table" v-else :class="getProfitColor(t.current_price ? ((t.current_price-t.entry_price)*(t.quantity||t.size)*t.direction) : 0)">
                  {{ t.current_price ? formatMoneySigned(((t.current_price-t.entry_price)*(t.quantity||t.size)*t.direction), t.currency) : 'Loading...' }}
                </span>
              </div>
              <div>
                <span class="label">Ratio:</span>
                <span class="trade-profit-table" v-if="t.exit_price" :class="getProfitColor(((t.exit_price-t.entry_price)/t.entry_price*t.direction*100))">
                  {{((t.exit_price-t.entry_price)/t.entry_price*t.direction*100).toFixed(2) }}%
                </span>
                 <span class="trade-profit-table" v-else :class="getProfitColor(t.current_price ? ((t.current_price-t.entry_price)/t.entry_price*t.direction*100) : 0)">
                  {{ t.current_price ? ((t.current_price-t.entry_price)/t.entry_price*t.direction*100).toFixed(2) + '%' : 'Loading...' }}
                </span>
               

              </div>
               <div v-if="exit_date"><span class="label">Exit Date:</span> <b>{{ t.exit_time ? formatUSDate(t.exit_time) : '-' }}</b></div>
               <div v-else><span class="label">Entry Date:</span> <b>{{ t.entry_time ? formatUSDate(t.entry_time) : '-' }}</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- Trading Records (Position Analysis/Historical Trading) -->
     <div class="section">
        <h2 class="card-title">My Trade Records</h2>
        <!-- Statistics Cards Area (Total Assets, Total Market Value, Available Funds) -->
        <div class="flex-row mb-24">
            <div class="card" style="flex:1;min-width:220px;">
                <div class="glass-stat-label">Total Assets</div>
                <div class="glass-stat-value gold-number">{{ formatMoneyRight(user_info.initial_asset+user_info.utotle_profit+user_info.now_amount-user_info.hold_amount) }}</div>
                <div class="progress-bar" style="width:85%"></div>
               
            </div>
            <div class="card" style="flex:1;min-width:220px;">
                <div class="glass-stat-label">Total Market Value</div>
                <div class="glass-stat-value" style="color:#00ffae;">{{ formatMoneyRight(user_info.now_amount) }}</div>
                <div class="progress-bar" style="width:65%;background:#00ffae;"></div>
            </div>
            <div class="card" style="flex:1;min-width:220px;">
                <div class="glass-stat-label">Available Funds</div>
                <div class="glass-stat-value" style="color:#faad14;">{{ formatMoneyRight(user_info.initial_asset+user_info.utotle_profit-user_info.hold_amount) }}</div>
                <div class="progress-bar" style="width:50%;background:#faad14;"></div>
            </div>
        </div>
        <div id="trade-record-detail">
         
          <!-- Mobile Cards (5 items) -->
          <div class="trade-card-list trade-mobile-list">
            
            <div class="trade-card" v-for="t in Vipdata.user_trade_list" :key="t.id">
              <div class="trade-card-header">
                <span class="trade-symbol">{{ t.trade_market || '-' }}</span>
                 <span class="trade-symbol">{{ t.symbol || '-' }}</span>
                  <span class="trade-type sell">{{t.direction==1?"Long":"Short"}}</span>
                
                <span class="trade-date">{{ formatUSDate(t.entry_date) }}</span>
              </div>
              <div class="trade-card-body">
                <div class="trade-info-group">
                  <div><span class="label">Entry:</span> <b>{{ formatPriceRight(t.entry_price, t.currency) }}</b></div>
                  
                  <div v-if="t.exit_date"><span class="label">Exit Date:</span> <b>{{ formatUSDate(t.exit_date) }}</b></div>
                  <div v-else><span class="label">Entry Date:</span> <b>{{ formatUSDate(t.entry_date) }}</b></div>
                   <div><span class="label">Qty:</span> <b>{{ t.size || t.quantity }}</b></div>
                </div>
                <div class="trade-info-group">
                   <div>
                    <span class="label">P&L:</span>
                    <span class="trade-profit-table" v-if="t.exit_price" :class="getProfitColor(((t.exit_price-t.entry_price)*(t.size||t.quantity)*t.direction))">
                      {{ formatMoneySigned(((t.exit_price-t.entry_price)*(t.size||t.quantity)*t.direction), t.currency) }}
                    </span>
                    <span class="trade-profit-table" v-else :class="getProfitColor(t.current_price ? ((t.current_price-t.entry_price)*(t.size||t.quantity)*t.direction) : 0)">
                      {{ t.current_price ? formatMoneySigned(((t.current_price-t.entry_price)*(t.size||t.quantity)*t.direction), t.currency) : 'Loading...' }}
                    </span>
                  </div>
                  <div>
                    <span class="label">Ratio:</span>
                    <span class="trade-profit-table" v-if="t.exit_price" :class="getProfitColor(((t.exit_price-t.entry_price)/t.entry_price*t.direction*100))">
                      {{((t.exit_price-t.entry_price)/t.entry_price*t.direction*100).toFixed(2) }}%
                    </span>
                    <span class="trade-profit-table" v-else :class="getProfitColor(t.current_price ? ((t.current_price-t.entry_price)/t.entry_price*t.direction*100) : 0)">
                      {{ t.current_price ? ((t.current_price-t.entry_price)/t.entry_price*t.direction*100).toFixed(2) + '%' : 'Loading...' }}
                    </span>
                  </div>
                   <div v-if="t.exit_price"><span class="label">Exit:</span> <b>{{ formatPriceRight(t.exit_price, t.currency) }}</b></div>
                   <div v-else><span class="label">Current:</span> <b>{{ t.current_price ? formatPriceRight(t.current_price, t.currency) : 'Loading...' }}</b></div>
                </div>
                <!-- Close Trade Button - Only show when exit price is empty, positioned on the right -->
                <div v-if="!t.exit_price" class="trade-close-btn-container" style="display:flex;justify-content:flex-end;margin-top:2px;">
                  <a class="btn-primary-gradient close-trade-btn" @click="openCloseTradeModal(t)">Close Trade</a>
                </div>
              
            </div>
            
            
            
          </div>
        
        <!-- Close Trade Modal -->
        <div id="close-trade-modal" v-show="isCloseTradeModalOpen" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:2000;align-items:center;justify-content:center;display:flex;">
          <div style="background:#232B3E;border-radius:18px;max-width:600px;width:90vw;max-height:92vh;overflow:auto;padding:32px 24px 24px 24px;position:relative;">
            <button @click="closeCloseTradeModal" style="position:absolute;right:18px;top:18px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;">×</button>
            <h3 style="color:#FFD700;text-align:center;margin-bottom:24px;">Close Trade</h3>
            
            <div v-if="selectedTrade" class="close-trade-form">
              <div class="form-item">
                <label for="exit_date" style="color:#fff;">Exit Data</label>
                <input type="date" id="exit_date" v-model="closeTradeForm.exitDate" required style="width:100%;padding:12px 16px;border:1px solid #FFD70033;border-radius:8px;background:#181F2A;color:#fff;font-size:1rem;">
              </div>
              
              <div class="form-item">
                <label for="exit_price" style="color:#fff;">Exite Price</label>
                <input type="number" id="exit_price" v-model="closeTradeForm.exitPrice" placeholder="please enter Exite Price" step="0.01" required style="width:100%;padding:12px 16px;border:1px solid #FFD70033;border-radius:8px;background:#181F2A;color:#fff;font-size:1rem;">
              </div>
              
              <div class="form-item">
                <label for="trade_image" style="color:#fff;">Trade Image</label>
                <div class="custom-file">
                  <input type="file" id="trade_image" ref="tradeImageInput" @change="handleImageChange" accept="image/*" style="display:none;">
                  <button type="button" @click="$refs.tradeImageInput.click()" class="btn btn-outline-primary w-100" style="padding:12px 16px;border:1px solid #FFD70033;border-radius:8px;background:#181F2A;color:#fff;" :disabled="isUploading">{{ isUploading ? 'upload...' : 'Click to select file' }}</button>
                </div>
                <div v-if="fileUrl" class="image-preview-container" style="margin-top:12px;">
                  <img :src="fileUrl" alt="Trade Image" style="max-width:100%;max-height:200px;border-radius:8px;">
                </div>
              </div>
              
              <div class="form-actions" style="margin-top:24px;display:flex;gap:12px;">
                <button type="button" @click="closeCloseTradeModal" class="styled-button" style="flex:1;background:#444;" :disabled="isUploading">{{ isUploading ? 'uploading...' : 'Cancel' }}</button>
                <button type="button" @click="confirmCloseTrade" class="styled-button" style="flex:1;background:linear-gradient(90deg, #FFD700 0%, #FFB300 100%);color:#181F2A;" :disabled="isUploading">{{ isUploading ? 'uploading...' : 'Save' }}</button>
              </div>
            </div>
          </div>
        </div>
            
           
            
            
          </div>
        </div>
    </div>
    

    <!-- Member Profit Ranking -->
    <div class="section" style="max-width: 1400px;">
      <h2 class="card-title" style="font-size:2.2rem;font-weight:900;color:#FFD700;text-shadow:0 2px 8px rgba(24,31,42,0.53);margin-bottom:24px;">Member Profit Ranking</h2>
      <div class="card member-rank-table-pc" style="border:3px solid #FFD700;padding:36px 28px 28px 28px;box-shadow:0 0 24px rgba(255,215,0,0.2);">
        <table class="ant-table w-100" style="border-radius:18px;overflow:hidden;background:#181F2A;">
          <thead>
           <tr style="background:#232e4a;">
                        <th style="text-align:center;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Rank</th>
                        <th style="text-align:left;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Avatar</th>
                        <th style="text-align:left;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Member</th>
                        <th style="text-align:left;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Membership Level</th>
                        <th style="text-align:right;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Total Profit ($)</th>
                        <th style="text-align:right;color:#FFD700;font-size:1.18rem;font-weight:900;letter-spacing:1px;">Monthly Profit ($)</th>
                    </tr>
          </thead>
          <tbody>
            <tr v-for="(user,index) in displayedUsers" :key="index" class="rank-row" style="border-bottom:1.5px solid rgba(255,215,0,0.13);background:linear-gradient(90deg,#232B3E 80%,#232e4a 100%);">
              <td style="text-align:center;font-weight:900;">
                <span style="font-size:1.6rem;" :style="{color: user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#b0c4e6' : user.rank === 3 ? '#faad14' : '#fff', textShadow: user.rank <= 3 ? '0 0 8px rgba(255,215,0,0.6)' : 'none'}">
                  {{ index+1 }}
                </span>
              </td>
              <td style="text-align:left;">
                 <img :src="user.avatar_url" 
                                 style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #FFD700;box-shadow:0 0 8px #FFD70033;"
                                 ></td>
              <td style="text-align:left;font-weight:700;font-size:1.12rem;letter-spacing:1px;color:#fff;">{{ user.username }}</td>
              <td style="text-align:left;">
                <span class="membership-badge diamond-member" style="font-size:1.08rem;font-weight:900;padding:6px 18px;border-radius:20px;box-shadow:0 0 12px #FFD70055;letter-spacing:1px;background:linear-gradient(90deg,#b0c4e6 60%,#FFD700 100%);color:#232B3E;">
                                {{ user.membership_level  }}
                            </span>
               
              </td>
              <td style="text-align:right;font-weight:900;">
                <span style="font-size:1.12rem;" :style="{color: parseFloat(user.monthly_profit) > 0 ? '#00ffae' : parseFloat(user.totalProfit) < 0 ? '#ff4d4f' : '#b0c4e6'}">
                  {{ formatMoneySigned(user.utotle_profit) }}
                </span>
              </td>
              <td style="text-align:right;font-weight:900;">
                <span style="font-size:1.12rem;" :style="{color: parseFloat(user.profitRate) > 0 ? '#52c41a' : parseFloat(user.profitRate) < 0 ? '#ff4d4f' : '#b0c4e6'}">
                  {{ formatMoneySigned(user.umonth_profit) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 查看所有按钮 -->
      <div style="text-align:center;margin-top:24px;">
        <button v-if="Vipdata.usersSort && Vipdata.usersSort.length > 5" 
                class="styled-button" 
                @click="openRankingsModal">
          View All Rankings ({{ Vipdata.usersSort.length }} members)
        </button>
      </div>

      <!-- Mobile Member Ranking -->
      <div class="member-rank-mobile-list">
        <div v-for="(user, index) in displayedUsers" :key="user.id" class="member-rank-mobile-card" style="background:linear-gradient(135deg,#232B3E 60%,#232e4a 100%);border-radius:14px;box-shadow:0 4px 16px rgba(24,31,42,0.2),0 0 0 2px rgba(255,215,0,0.13);border:1.5px solid rgba(255,215,0,0.10);padding:14px 12px 10px 12px;margin-bottom:14px;display:flex;flex-direction:column;gap:8px;">
          <div class="rank-row-main" style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
            <span class="rank-num" style="font-size:1.18rem;font-weight:900;min-width:24px;text-align:center;" :style="{color: index === 0 ? '#FFD700' : index === 1 ? '#b0c4e6' : index === 2 ? '#faad14' : '#fff'}">{{ index + 1 }}</span>
            <img :src="user.avatar_url" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #FFD700;box-shadow:0 0 4px rgba(255,215,0,0.2);display:flex;align-items:center;justify-content:center;"></img>
            <span class="rank-name" style="font-weight:700;font-size:1.05rem;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;">{{ user.username }}</span>
            <span class="rank-level" :class="user.membership_level" style="font-size:0.95rem;padding:2px 10px;border-radius:8px;background:#1a2236;margin-left:4px;min-width:80px;text-align:center;display:inline-block;">{{ user.membership_level }}</span>
          </div>
          <div class="rank-row-bottom" style="display:flex;justify-content:space-between;font-size:1.05em;margin-top:2px;">
            <span class="rank-amount" style="font-weight:900;font-size:1.08rem;" :style="{color: parseFloat(user.utotle_profit) > 0 ? '#00ffae' : parseFloat(user.utotle_profit) < 0 ? '#ff4d4f' : '#b0c4e6'}">{{ formatMoneySigned(user.utotle_profit) }}</span>
            <span class="rank-rate" style="font-weight:900;font-size:1.08rem;" :style="{color: parseFloat(user.umonth_profit) > 0 ? '#52c41a' : parseFloat(user.umonth_profit) < 0 ? '#ff4d4f' : '#b0c4e6'}">{{ formatMoneySigned(user.umonth_profit) }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Video Courses -->
    <div class="section">
        <h2 class="card-title">Video Tutorials</h2>
        <div id="videos-container" class="flex-row" style="display:flex;flex-wrap:wrap;gap:24px;">
            <div class="card" style="flex:0 0 calc(33.333% - 16px);min-width:320px;" v-for="value in displayedVideos" :key="value.id">
                <div style="height:280px;background:#232e4a;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;">
                    <video :src="value.video_url" controls="" style="width:100%;height:280px;border-radius:12px;background:#232e4a;"></video>
                </div>
                <h4 style="color:#fff;margin-bottom:16px;">{{ value.title }}</h4>
                <div style="color:#b0c4e6;margin-bottom:12px;height:140px;overflow-y: auto;">{{ value.description }}</div>
                <div style="color:#b0c4e6;margin-bottom:12px;">Last Updated: {{ formatUSDate(value.last_update) }}</div>
            </div>
        </div>
        <div style="text-align:center;margin-top:18px;" v-if="displayedVideos && displayedVideos.length > 2">
            <button id="show-all-videos-btn" 
                    class="styled-button" 
                    @click="goToVideosPage">
              View More Videos
            </button>
        </div>
    </div>

    <!-- Video Modal -->
    <div id="videos-modal" v-show="isVideosModalOpen" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:2000;align-items:center;justify-content:center;display:flex;">
        <div style="background:#232B3E;border-radius:18px;max-width:1100px;width:98vw;max-height:92vh;overflow:auto;padding:32px 18px 24px 18px;position:relative;">
            <button @click="closeVideosModal" style="position:absolute;right:18px;top:18px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;">×</button>
                                <h3 style="color:#FFD700;text-align:center;margin-bottom:24px;">All videos</h3>
            <div class="flex-row" id="videos-modal-list">
                <div class="card" style="flex:1;min-width:320px;max-width:520px;margin:12px;" v-for="(video, index) in Vipdata.vedioslist" :key="index">
                    <div style="height:280px;background:#232e4a;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;">
                        <video :src="video.video_url" controls style="width:100%;height:280px;border-radius:12px;background:#232e4a;"></video>
                    </div>
                    <h4 style="color:#fff;margin-bottom:16px;">{{ video.title }}</h4>
                    <div style="color:#b0c4e6;margin-bottom:12px;height:140px;overflow-y: scroll;">{{ video.description }}</div>
                    <div style="color:#b0c4e6;margin-bottom:12px;">Last Updated: {{ formatUSDate(video.last_update) }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Documents Modal -->
    <div id="documents-modal" v-show="isDocumentsModalOpen" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:2000;align-items:center;justify-content:center;display:flex;">
        <div style="background:#232B3E;border-radius:18px;max-width:1100px;width:98vw;max-height:92vh;overflow:auto;padding:32px 18px 24px 18px;position:relative;">
            <button @click="closeDocumentsModal" style="position:absolute;right:18px;top:18px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;">×</button>
            <h3 style="color:#FFD700;text-align:center;margin-bottom:24px;">All Documents</h3>
            <div class="flex-col" id="documents-modal-list" style="gap:24px;">
                <div class="card mb-24" v-for="(document, index) in Vipdata.documentslist" :key="index">
                    <div style="display:flex;align-items:center;gap:24px;">
                        <span class="avatar-glow" style="width:64px;height:64px;display:inline-flex;align-items:center;justify-content:center;font-size:2.5rem;background:#232b3e;margin-right:8px;">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="file-text" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M534 352V136H196c-17.7 0-32 14.3-32 32v688c0 17.7 14.3 32 32 32h632c17.7 0 32-14.3 32-32V352H534zm-64 0H264V200h206v152zm-80 120h160c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H390c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8zm0 120h160c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H390c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8z"></path>
                            </svg>
                        </span>
                        <div style="flex:1;">
                            <h4 style="color:#fff;margin-bottom:12px;">{{ document.title }}</h4>
                            <div style="color:#b0c4e6;margin-bottom:16px;">{{ document.description }}</div>
                            <div style="display:flex;align-items:center;gap:16px;color:#b0c4e6;font-size:0.9rem;">
                                <span>Last Updated: {{ formatUSDate(document.last_update) }}</span>
                            </div>
                            <div style="margin-top:16px;display:flex;gap:16px;">
                                <a :href="document.file_url" download="" target="_blank" style="color:#FFD700;text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z"></path>
                                        <path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                                    </svg>
                                    Download
                                </a>
                                <a :href="document.file_url" target="_blank" class="styled-button" style="padding:4px 18px;font-size:1rem;">Preview</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 <!-- Documents -->
    <div class="section">
                        <h2 class="card-title">Documents</h2>
        <div id="documents-container">
        <div class="card mb-24" v-for="value in displayedDocuments">
            <div style="display:flex;align-items:center;gap:24px;" >
                <span class="avatar-glow" style="width:64px;height:64px;display:inline-flex;align-items:center;justify-content:center;font-size:2.5rem;background:#232b3e;margin-right:8px;">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="file-text" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M534 352V136H196c-17.7 0-32 14.3-32 32v688c0 17.7 14.3 32 32 32h632c17.7 0 32-14.3 32-32V352H534zm-64 0H264V200h206v152zm-80 120h160c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H390c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8zm0 120h160c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H390c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8z"></path>
                    </svg>
                </span>
                <div style="flex:1;">
                    <h4 style="color:#fff;margin-bottom:12px;">{{ value.title }}</h4>
                    <div style="color:#b0c4e6;margin-bottom:16px;">{{ value.description }}</div>
                    <div style="display:flex;align-items:center;gap:16px;color:#b0c4e6;font-size:0.9rem;">
                        <span>Last Updated: {{ formatUSDate(value.last_update) }}</span>
                    </div>
                    <div style="margin-top:16px;display:flex;gap:16px;">
                        <a :href="value.file_url" download="" target="_blank" style="color:#FFD700;text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z"></path>
                                <path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                            </svg>
                            Download
                        </a>
                        <a :href="value.file_url" target="_blank" class="styled-button" style="padding:4px 18px;font-size:1rem;">Preview</a>
                    </div>
                </div>
            </div>
        </div>
     
    </div>
        <div style="text-align:center;margin-top:24px;">
            <button v-if="!showAllDocuments && displayedDocuments && displayedDocuments.length >2" 
                    id="show-all-documents-btn" 
                    class="styled-button" 
                    @click="goToDocumentsPage">
              View More Documents
            </button>
            <button v-else-if="showAllDocuments" 
                    class="styled-button" 
                    @click="toggleDocumentsView">
              Show Top 5 Only
            </button>
        </div>
    </div>

    <!-- Member Benefits Cards Area -->
    <div class="section" style="max-width: 1400px;">
       <h2 class="card-title">Membership Agreement & Benefits</h2>
        <div class="vip-benefit-subtitle" style="text-align:center;color:#b0c4e6;font-size:1.2rem;margin-bottom:48px;">Exclusive member benefits to help your wealth grow</div>
      <div class="vip-benefit-grid">
        <div class="vip-benefit-card">
                <div class="benefit-icon-wrapper">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="url(#g1pro)"/>
                        <path d="M10 34L20 20L28 28L38 12" stroke="#FFD700" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="10" cy="34" r="2" fill="#FFD700"/>
                        <circle cx="20" cy="20" r="2" fill="#FFD700"/>
                        <circle cx="28" cy="28" r="2" fill="#FFD700"/>
                        <circle cx="38" cy="12" r="2" fill="#FFD700"/>
                        <defs>
                            <radialGradient id="g1pro" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientTransform="matrix(48 0 0 48 0 0)" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFD700" stop-opacity="0.18"/>
                                <stop offset="1" stop-color="#232B3E" stop-opacity="0.9"/>
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="benefit-title">Professional Investment Strategies</h3>
                <ul class="benefit-list">
                    <li>Daily strategies from a senior team</li>
                    <li>Personalized portfolio advice</li>
                    <li>Real-time risk alerts</li>
                </ul>
            </div>
            <div class="vip-benefit-card">
                <div class="benefit-icon-wrapper">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="url(#g2pro)"/>
                        <path d="M24 8L36 14V24C36 36 24 40 24 40C24 40 12 36 12 24V14L24 8Z" stroke="#FFD700" stroke-width="3" fill="none"/>
                        <path d="M18 26L23 32L32 18" stroke="#FFD700" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <radialGradient id="g2pro" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientTransform="matrix(48 0 0 48 0 0)" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFD700" stop-opacity="0.18"/>
                                <stop offset="1" stop-color="#232B3E" stop-opacity="0.9"/>
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="benefit-title">Risk Protection Mechanism</h3>
                <ul class="benefit-list">
                    <li>Multiple risk control systems</li>
                    <li>Loss compensation guarantee</li>
                    <li>Fund security guarantee</li>
                </ul>
            </div>
            <div class="vip-benefit-card">
                <div class="benefit-icon-wrapper">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="url(#g3pro)"/>
                        <path d="M12 36H36L31 16L24 28L17 16L12 36Z" fill="#FFD700" stroke="#FFD700" stroke-width="2"/>
                        <circle cx="17" cy="16" r="2" fill="#FFD700"/>
                        <circle cx="24" cy="28" r="2" fill="#FFD700"/>
                        <circle cx="31" cy="16" r="2" fill="#FFD700"/>
                        <defs>
                            <radialGradient id="g3pro" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientTransform="matrix(48 0 0 48 0 0)" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFD700" stop-opacity="0.18"/>
                                <stop offset="1" stop-color="#232B3E" stop-opacity="0.9"/>
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="benefit-title">VIP Exclusive Services</h3>
                <ul class="benefit-list">
                    <li>One-on-one investment advisor</li>
                    <li>Exclusive investment events</li>
                    <li>Priority response service</li>
                </ul>
            </div>
            <div class="vip-benefit-card">
                <div class="benefit-icon-wrapper">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="url(#g4pro)"/>
                        <rect x="12" y="16" width="24" height="10" rx="3" stroke="#FFD700" stroke-width="2.5" fill="none"/>
                        <path d="M24 16V26" stroke="#FFD700" stroke-width="2.5"/>
                        <circle cx="24" cy="12" r="2" fill="#FFD700"/>
                        <defs>
                            <radialGradient id="g4pro" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientTransform="matrix(48 0 0 48 0 0)" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFD700" stop-opacity="0.18"/>
                                <stop offset="1" stop-color="#232B3E" stop-opacity="0.9"/>
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="benefit-title">Professional Training Support</h3>
                <ul class="benefit-list">
                    <li>Practical investment courses</li>
                    <li>Skill improvement plans</li>
                    <li>One-on-one expert guidance</li>
                </ul>
            </div>
      </div>
    </div>

    <!-- Membership Agreement Section -->
    <div class="vip-agreement-section" style="max-width: 1400px;">
      <div class="agreement-header">
        <h3 class="agreement-title">Membership Agreement</h3>
        <p class="agreement-desc">This platform is a paid service focused on providing members with professional investment strategies and market analysis. Members pay commissions based on actual profits. In the event of significant losses, the platform will compensate and share commissions according to the ratios shown in the membership level table.</p>
      </div>
      <!-- PC Table Comparison -->
      <div class="agreement-table-section agreement-table-pc">
        <h4 class="table-title">Membership Commission Mechanism</h4>
        <div class="table-wrapper">
          <table class="vip-table">
            <thead>
              <tr>
                <th>Membership Level</th>
                <th>Fund Range</th>
                <th>Monthly Profit Ratio</th>
                <th>Commission Ratio</th>
              </tr>
            </thead>
            <tbody>
             
              <tr v-for="value in vipList">
                <td><span class="member-level">{{value.name}}</span></td>
                <td>>={{value.min_trading_volume}}</td>
                <td><span class="highlight">{{value.monthly_profit_ratio}}%</span></td>
                <td><span class="highlight">{{value.commission_ratio}}%</span></td>
              </tr>
            
            </tbody>
          </table>
        </div>
      </div>
      <!-- Mobile Card Display -->
      <div class="agreement-mobile-cards">
        <div class="mobile-section">
          <div class="mobile-section-title">Membership Commission Mechanism</div>
          <div class="mobile-card-list">
            <div class="mobile-card" v-for="value in vipList">
              <div class="mobile-badge-row"><span class="mobile-badge vip">{{value.name}}</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Fund Range</span><span class="mobile-info-value">>={{value.min_trading_volume}}</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Monthly Profit Ratio</span><span class="mobile-info-value">{{value.monthly_profit_ratio}}%</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Commission Ratio</span><span class="mobile-info-value">{{value.commission_ratio}}%</span></div>
            </div>
           
          </div>
        </div>
        <div class="mobile-section">
          <div class="mobile-section-title">Membership Compensation Mechanism</div>
          <div class="mobile-card-list">
            <div class="mobile-card" v-for="value in vipList">
              <div class="mobile-badge-row"><span class="mobile-badge vip">{{value.name}}</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Fund Range</span><span class="mobile-info-value">>={{value.min_trading_volume}}</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Risk Ratio</span><span class="mobile-info-value">{{value.monthly_profit_ratio}}%</span></div>
              <div class="mobile-info-row"><span class="mobile-info-label">Compensation Ratio</span><span class="mobile-info-value">{{value.commission_ratio}}%</span></div>
            </div>
            
          </div>
        </div>
      </div>
      <div class="agreement-table-section agreement-table-pc">
        <h4 class="table-title">Membership Compensation Mechanism</h4>
        <div class="table-wrapper">
          <table class="vip-table">
            <thead>
              <tr>
                <th>Membership Level</th>
                <th>Fund Range</th>
                <th>Risk Ratio</th>
                <th>Compensation Ratio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="value in vipList">
                <td><span class="member-level">{{value.name}}</span></td>
                <td>>={{value.min_trading_volume}}</td>
                <td><span class="highlight">{{value.risk_ratio}}%</span></td>
                <td><span class="highlight">{{value.compensation_ratio}}%</span></td>
              </tr>
             
            </tbody>
          </table>
        </div>
      </div>
      <div class="agreement-footer">
        <a class="view-agreement-btn" :href="trader_profiles.agreement" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;">
          View Full Agreement
        </a>
      </div>
    </div>
  </div>
  </div>
  
  <!-- VIP合作单位 -->
  <VipPartnerOrganizations />
  
  <!-- 会员排行榜弹窗 -->
  <div v-if="isRankingsModalOpen" class="rankings-modal-overlay" @click="closeRankingsModal">
    <div class="rankings-modal" @click.stop>
      <div class="rankings-modal-header">
        <h3 class="rankings-modal-title">Member Profit Ranking - All Members</h3>
        <button class="rankings-modal-close" @click="closeRankingsModal">×</button>
      </div>
      <div class="rankings-modal-content">
        <table class="rankings-modal-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Avatar</th>
              <th>Username</th>
              <th>Membership Level</th>
              <th>Total Profit</th>
              <th>Monthly Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in Vipdata.usersSort" :key="user.id" class="rank-row" style="border-bottom:1.5px solid rgba(255,215,0,0.13);background:linear-gradient(90deg,#232B3E 80%,#232e4a 100%);">
              <td style="text-align:center;font-weight:900;">
                <span style="font-size:1.6rem;" :style="{
                  color: index === 0 ? '#FFD700' : index === 1 ? '#b0c4e6' : index === 2 ? '#faad14' : '#fff',
                  textShadow: index <= 2 ? '0 0 8px rgba(255,215,0,0.6)' : 'none'
                }">
                  {{ index + 1 }}
                </span>
              </td>
              <td style="text-align:left;">
                <img :src="user.avatar_url || '/default-avatar.png'" 
                     :alt="user.username" 
                     style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #FFD700;box-shadow:0 0 8px #FFD70033;">
              </td>
              <td style="text-align:left;font-weight:700;font-size:1.12rem;letter-spacing:1px;color:#fff;">{{ user.username }}</td>
              <td style="text-align:left;">
                <span class="membership-badge" :class="user.membership_level" style="font-size:1.08rem;font-weight:900;padding:6px 18px;border-radius:20px;box-shadow:0 0 12px #FFD70055;letter-spacing:1px;background:linear-gradient(90deg,#b0c4e6 60%,#FFD700 100%);color:#232B3E;">
                  {{ user.membership_level }}
                </span>
              </td>
              <td style="text-align:right;font-weight:900;">
                <span style="font-size:1.12rem;" :style="{
                  color: parseFloat(user.utotle_profit) > 0 ? '#00ffae' : parseFloat(user.utotle_profit) < 0 ? '#ff4d4f' : '#b0c4e6'
                }">
                  {{ formatMoneySigned(user.utotle_profit) }}
                </span>
              </td>
              <td style="text-align:right;font-weight:900;">
                <span style="font-size:1.12rem;" :style="{
                  color: parseFloat(user.umonth_profit) > 0 ? '#52c41a' : parseFloat(user.umonth_profit) < 0 ? '#ff4d4f' : '#b0c4e6'
                }">
                  {{ formatMoneySigned(user.umonth_profit) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue';
import VipPartnerOrganizations from '@/components/VipPartnerOrganizations.vue';
import{ get_userinfo,get_membership_levels,get_VipDashboardData,closetrades, updateUserAvatar, get_stock_prices } from '../../api/module/web/vip'
import{ gettrader_profiles} from '../../api/module/web/index'
import { uploadImage } from '../../api/module/commone'
import { useUserStore } from '@/store';
import { formatUSDate } from '@/utils/dateFormat';
import { formatMoneyRight, formatMoneySigned, formatPriceRight } from '@/utils/formatNumber';
const router = useRouter();
const userStore = useUserStore()
// Video modal state
const isVideosModalOpen = ref(false);

// Open video modal
const openVideosModal = () => {
  isVideosModalOpen.value = true;
};

// Close video modal
const closeVideosModal = () => {
  isVideosModalOpen.value = false;
};

// Document modal state
const isDocumentsModalOpen = ref(false);

// Open document modal
const openDocumentsModal = () => {
  isDocumentsModalOpen.value = true;
};

// Close document modal
const closeDocumentsModal = () => {
  isDocumentsModalOpen.value = false;
};

// 获取盈亏颜色类
const getProfitColor = (value: number) => {
  if (value > 0) return 'profit-positive'; // 盈利用绿色
  if (value < 0) return 'profit-negative'; // 亏损用红色
  return 'profit-neutral'; // 中性用默认色
};

// Format currency, add thousand separators
const formatCurrency = (amount: number | string) => {
  if (amount === null || amount === undefined || amount === '') return '0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Mock data
const recentTrades = ref([
  
]);
const traderTerms=ref<string[]>([])
const topUsers = ref([
 
]);
const trader_profiles=ref({});
const vipList=ref([])
let user_info=ref({});
let Vipdata=ref({});
let vedioslist=ref([])

// 排行榜显示控制 - 默认只显示前5名
const showAllRankings = ref(false);

// 计算显示的会员列表
const displayedUsers = computed(() => {
  if (!Vipdata.value.usersSort || !Array.isArray(Vipdata.value.usersSort)) {
    return [];
  }
  
  if (showAllRankings.value) {
    // 显示所有会员（最多50名）
    return Vipdata.value.usersSort.slice(0, 50);
  } else {
    // 只显示前5名
    return Vipdata.value.usersSort.slice(0, 5);
  }
});

// 切换排行榜显示模式
const toggleRankingsView = () => {
  showAllRankings.value = !showAllRankings.value;
};

// 排行榜弹窗控制
const isRankingsModalOpen = ref(false);

// 打开排行榜弹窗
const openRankingsModal = () => {
  isRankingsModalOpen.value = true;
};

// 关闭排行榜弹窗
const closeRankingsModal = () => {
  isRankingsModalOpen.value = false;
};

// 视频显示控制
const showAllVideos = ref(false);

// 计算显示的视频列表
const displayedVideos = computed(() => {
  if (!Vipdata.value.vedioslist || !Array.isArray(Vipdata.value.vedioslist)) {
    return [];
  }
  
  if (showAllVideos.value) {
    // 显示所有视频
    return Vipdata.value.vedioslist;
  } else {
    // 只显示前3个视频
    return Vipdata.value.vedioslist.slice(0, 3);
  }
});

// 切换视频显示模式
const toggleVideosView = () => {
  showAllVideos.value = !showAllVideos.value;
};

// 跳转到视频页面
const goToVideosPage = () => {
  router.push('/videos');
};

// 跳转到文档页面
const goToDocumentsPage = () => {
  router.push('/documents');
};

// 文档显示控制
const showAllDocuments = ref(false);

// 计算显示的文档列表
const displayedDocuments = computed(() => {
  if (!Vipdata.value.documentslist || !Array.isArray(Vipdata.value.documentslist)) {
    return [];
  }
  
  if (showAllDocuments.value) {
    // 显示所有文档
    return Vipdata.value.documentslist;
  } else {
    // 只显示前5个文档
    return Vipdata.value.documentslist.slice(0, 5);
  }
});

// 切换文档显示模式
const toggleDocumentsView = () => {
  showAllDocuments.value = !showAllDocuments.value;
};
onMounted(()=>{
  if(!userStore.userInfo.signing)
  {
    router.push('/vip')
  }
  try{
  Vipdata.value=userStore.VipData
  vipList.value=userStore.vipList
  
  // 如果已有数据，也要进行排序
  if (Vipdata.value && Object.keys(Vipdata.value).length > 0) {
    sortTradeLists();
  }
  }
  catch{}
 get_user_info()
 getVipDashboardData()
 gettraderprofiles()
 get_membership_levels_list()
 
 // Set timer to update stock prices every 10 seconds
 setInterval(() => {
   if (Vipdata.value && (Vipdata.value.tradelist || Vipdata.value.user_trade_list)) {
     updateStockPrices();
   }
 }, 10000);
})
const gettraderprofiles= async()=>{
  try {
    const res=await gettrader_profiles();
    if(res.success && res.data && res.data.trader_profiles){
      const traderProfile = res.data.trader_profiles;
      // 检查terms是否存在且为字符串
      if (traderProfile.terms && typeof traderProfile.terms === 'string') {
        // 将terms字符串按行分割成数组
        traderTerms.value = traderProfile.terms.split('\n').filter(term => term.trim() !== '');
      } else {
        traderTerms.value = [];
        console.warn('trader_profiles.terms 不存在或不是字符串');
      }
    }
  } catch (error) {
    console.error('加载交易员条款失败:', error);
    traderTerms.value = [];
  }
};
const get_membership_levels_list=async()=>{
  const res=await get_membership_levels()
  if(res.success)
  {
    vipList.value=res.data
    vipList.value.forEach(item => {
      item.benefits=item.benefits.split(',')
    });
    userStore.vipList=vipList.value
  }
}
const get_user_info=async()=>{
  const res=await get_userinfo();
  if(res.success){
    user_info.value=res.data;
  }
}
const getVipDashboardData=async()=>{
  const res=await get_VipDashboardData();
  if(res.success){
    Vipdata.value=res.data;
    userStore.VipData=res.data
    
    // 对交易列表进行排序
    sortTradeLists();
    
    // Get real-time prices for all held stocks
    await updateStockPrices();
  }

}

// 排序交易列表函数
const sortTradeLists = () => {
  // 对 VIP 交易列表排序
  if (Vipdata.value.tradelist && Array.isArray(Vipdata.value.tradelist)) {
    Vipdata.value.tradelist.sort((a: any, b: any) => {
      // 首先按持仓状态排序：持仓在前，平仓在后
      const isHoldingA = !a.exit_price;
      const isHoldingB = !b.exit_price;
      
      if (isHoldingA !== isHoldingB) {
        return isHoldingA ? -1 : 1; // 持仓在前
      }
      
      // 同状态内按时间排序
      if (isHoldingA) {
        // 持仓的按买入时间排序（最新的在前）
        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        return dateB.getTime() - dateA.getTime();
      } else {
        // 平仓的按平仓时间排序（最新的在前）
        const dateA = new Date(a.exit_time || a.entry_date);
        const dateB = new Date(b.exit_time || b.entry_date);
        return dateB.getTime() - dateA.getTime();
      }
    });
  }
  
  // 对用户交易列表排序
  if (Vipdata.value.user_trade_list && Array.isArray(Vipdata.value.user_trade_list)) {
    Vipdata.value.user_trade_list.sort((a: any, b: any) => {
      // 首先按持仓状态排序：持仓在前，平仓在后
      const isHoldingA = !a.exit_price;
      const isHoldingB = !b.exit_price;
      
      if (isHoldingA !== isHoldingB) {
        return isHoldingA ? -1 : 1; // 持仓在前
      }
      
      // 同状态内按时间排序
      if (isHoldingA) {
        // 持仓的按买入时间排序（最新的在前）
        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        return dateB.getTime() - dateA.getTime();
      } else {
        // 平仓的按平仓时间排序（最新的在前）
        const dateA = new Date(a.exit_date || a.entry_date);
        const dateB = new Date(b.exit_date || b.entry_date);
        return dateB.getTime() - dateA.getTime();
      }
    });
  }
}

// Update real-time stock prices
const updateStockPrices = async () => {
  try {
    // Collect all held stock symbols
    const symbols = [];
    
    // Collect stock symbols from VIP trading records
    if (Vipdata.value.tradelist) {
      Vipdata.value.tradelist.forEach(trade => {
        if (trade.symbol && !trade.exit_price) { // Only get open positions
          symbols.push(trade.symbol);
        }
      });
    }
    
    // Collect stock symbols from user trading records
    if (Vipdata.value.user_trade_list) {
      Vipdata.value.user_trade_list.forEach(trade => {
        if (trade.symbol && !trade.exit_price) { // Only get open positions
          symbols.push(trade.symbol);
        }
      });
    }
    
    // Remove duplicates
    const uniqueSymbols = [...new Set(symbols)];
    
    if (uniqueSymbols.length > 0) {
      console.log('Updating stock prices for symbols:', uniqueSymbols);
      try {
        // Call price API
        console.log('Calling stock price API with symbols:', uniqueSymbols);
        const priceRes = await get_stock_prices(uniqueSymbols);
        console.log('Stock price API response:', priceRes);
        
        if (priceRes && priceRes.success && priceRes.data) {
          const priceMap = Array.isArray(priceRes.data)
            ? Object.fromEntries(
                priceRes.data
                  .filter((item: { symbol?: string; price?: number | null }) => item?.symbol && item.price != null)
                  .map((item: { symbol: string; price: number }) => [item.symbol, item.price])
              )
            : priceRes.data;
          console.log('Price map received:', priceMap);
          
          // Update prices in VIP trading records
          if (Vipdata.value.tradelist) {
            Vipdata.value.tradelist.forEach(trade => {
              if (priceMap[trade.symbol]) {
                trade.current_price = priceMap[trade.symbol];
              }
            });
          }
          
          // Update prices in user trading records
          if (Vipdata.value.user_trade_list) {
            Vipdata.value.user_trade_list.forEach(trade => {
              if (priceMap[trade.symbol]) {
                trade.current_price = priceMap[trade.symbol];
              }
            });
          }
          
          // Update data in store
          userStore.VipData = Vipdata.value;
        } else {
          console.warn('Stock price API returned unsuccessful response:', priceRes);
          // Use mock prices when API returns unsuccessful response
          const mockPrices = {};
          uniqueSymbols.forEach(symbol => {
            mockPrices[symbol] = Math.random() * 100 + 10; // Mock prices 10-110
          });
          
          // Update prices in VIP trading records
          if (Vipdata.value.tradelist) {
            Vipdata.value.tradelist.forEach(trade => {
              if (mockPrices[trade.symbol]) {
                trade.current_price = mockPrices[trade.symbol];
              }
            });
          }
          
          // Update prices in user trading records
          if (Vipdata.value.user_trade_list) {
            Vipdata.value.user_trade_list.forEach(trade => {
              if (mockPrices[trade.symbol]) {
                trade.current_price = mockPrices[trade.symbol];
              }
            });
          }
          
          // Update data in store
          userStore.VipData = Vipdata.value;
        }
      } catch (apiError) {
        console.error('Stock price API error:', apiError);
        console.warn('Stock price API temporarily unavailable, using mock prices:', apiError);
        // If API is unavailable, use mock prices
        const mockPrices = {};
        uniqueSymbols.forEach(symbol => {
          mockPrices[symbol] = Math.random() * 100 + 10; // Mock prices 10-110
        });
        
        // Update prices in VIP trading records
        if (Vipdata.value.tradelist) {
          Vipdata.value.tradelist.forEach(trade => {
            if (mockPrices[trade.symbol]) {
              trade.current_price = mockPrices[trade.symbol];
            }
          });
        }
        
        // Update prices in user trading records
        if (Vipdata.value.user_trade_list) {
          Vipdata.value.user_trade_list.forEach(trade => {
            if (mockPrices[trade.symbol]) {
              trade.current_price = mockPrices[trade.symbol];
            }
          });
        }
        
        // Update data in store
        userStore.VipData = Vipdata.value;
      }
    }
  } catch (error) {
    console.error('Failed to update stock prices:', error);
  }
}
// Click event handler - navigate to new page
const handleUploadTradeRecord = () => {
  router.push('/trade-upload');
};

const handleSettingsClick = () => {
  router.push('/settings');
};

// Close Trade Modal related state and functions
const isCloseTradeModalOpen = ref(false);
const selectedTrade = ref(null);
const closeTradeForm = ref({
  exitPrice: '',
  exitDate: '',
  tradeFile: null
});
const fileUrl = ref('');
const isUploading = ref(false); // Upload status flag

// Open close trade modal
const openCloseTradeModal = (trade) => {
  selectedTrade.value = trade;
  closeTradeForm.value = {
    exitPrice: '',
    exitDate: new Date().toISOString().split('T')[0], // Default today
    tradeFile: null
  };
  fileUrl.value = '';
  isCloseTradeModalOpen.value = true;
};

// Close close trade modal
const closeCloseTradeModal = () => {
  isCloseTradeModalOpen.value = false;
  selectedTrade.value = null;
  fileUrl.value = '';
};

// Handle image upload
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Set uploading state
    isUploading.value = true;
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Call uploadImage API to upload image
      const response = await uploadImage(formData);
      
      // Assume the response contains image URL
      // Field name may need adjustment based on actual API response
      fileUrl.value = response.data.url || URL.createObjectURL(file);
      closeTradeForm.value.tradeFile = file;
      
      console.log('Image upload successful:', response);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed, please try again');
      fileUrl.value = '';
      closeTradeForm.value.tradeFile = null;
    } finally {
      // Reset upload state
      isUploading.value = false;
      // Clear input to allow selecting the same file again
      event.target.value = '';
    }
  }
};

// Confirm close trade
  const confirmCloseTrade = async () => {
    if (!selectedTrade.value || !closeTradeForm.value.exitPrice || !closeTradeForm.value.exitDate) {
      alert('Please fill in the exit price and exit date');
      return;
    }
    
    try {
      // Construct request data
      const tradeData = {
        id: selectedTrade.value.id,
        exit_price: closeTradeForm.value.exitPrice,
        exit_date: closeTradeForm.value.exitDate,
        image_url: fileUrl.value // Pass image URL
      };
      
      // Call API to close trade
      const response = await closetrades(tradeData);
      
      if (response.success) {
        // Refresh data after success
        await getVipDashboardData();
        closeCloseTradeModal();
        alert('Transaction closed successfully');
      } else {
        throw new Error(response.message || 'Closing transaction failed');
      }
    } catch (error) {
      console.error('Closing transaction failed:', error);
      alert(error.message || 'Closing transaction');
    }
  };

  // Avatar upload related logic
  const avatarFileInput = ref<HTMLInputElement | null>(null);
  const isAvatarUploading = ref(false);
  
  // Click avatar to trigger file selection
  const handleAvatarClick = () => {
    if (avatarFileInput.value) {
      avatarFileInput.value.click();
    }
  };
  
  // Handle avatar file selection
  const handleAvatarFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      isAvatarUploading.value = true;
      
      // Show uploading prompt
      console.log('Uploading avatar, please wait...');
      
      try {
        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);
        
        // Call uploadImage API to upload image
        const uploadResponse = await uploadImage(formData);
        
        if (uploadResponse.success) {
          // 假设返回的response包含图片URL
          const imageUrl = uploadResponse.data.url;
          
          // 调用updateUserAvatar接口更新用户头像
          const updateResponse = await updateUserAvatar({ avatar_url: imageUrl });
          
          if (updateResponse.success) {
            // 成功后刷新用户信息
            await get_user_info();
            // 更新本地预览
            if (user_info.value) {
              user_info.value.avatar_url = imageUrl;
            }
            alert('Avatar updated successfully');
          } else {
            throw new Error(updateResponse.message || 'Failed to update avatar');
          }
        } else {
          throw new Error(uploadResponse.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload avatar, please try again');
      } finally {
        // Reset upload state和input
        isAvatarUploading.value = false;
        if (input) {
          input.value = '';
        }
      }
    }
  };
</script>

<style scoped>
/* ===== VIP Dashboard — unified site design system ===== */
.dashboard-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-2xl);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.hero-bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.12);
}

.hero-shape-1 {
  width: 220px;
  height: 220px;
  top: -80px;
  right: -40px;
}

.hero-shape-2 {
  width: 160px;
  height: 160px;
  bottom: -60px;
  left: -20px;
  background: rgba(250, 112, 154, 0.1);
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-profile-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.avatar-ring {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.hero-avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(102, 126, 234, 0.55);
  box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.12), var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.avatar-ring:hover .hero-avatar {
  transform: scale(1.03);
  box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.18), var(--shadow-glow);
}

.hero-copy {
  flex: 1;
  min-width: 240px;
}

.membership-badge {
  display: inline-block;
  padding: 6px 14px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.18);
  border: 1px solid rgba(102, 126, 234, 0.35);
  color: #c4b5fd;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 10px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  max-width: 560px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-primary-gradient,
.btn-secondary-glass {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary-gradient svg,
.btn-secondary-glass svg {
  width: 18px;
  height: 18px;
}

.btn-primary-gradient {
  border: none;
  background: var(--primary-gradient);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.btn-primary-gradient:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.btn-secondary-glass {
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.45);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-md);
}

.stat-label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  word-break: break-word;
}

.stat-unit {
  font-size: 0.85rem;
  margin-left: 2px;
  opacity: 0.75;
}

.stat-positive { color: #34d399; }
.stat-accent { color: #c4b5fd; }
.stat-warning { color: #fbbf24; }

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .dashboard-hero { padding: var(--spacing-xl) var(--spacing-lg); }
  .hero-profile-block { flex-direction: column; text-align: center; }
  .hero-subtitle { margin-left: auto; margin-right: auto; }
  .hero-actions { justify-content: center; }
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.close-trade-btn {
  padding: 8px 16px !important;
  font-size: 12px !important;
  height: auto !important;
  text-decoration: none;
}

 /* Form Styles for Modals */
 .form-item {
   margin-bottom: 16px;
 }
 
 .form-item label {
   display: block;
   margin-bottom: 8px;
   color: #333;
   font-weight: 500;
 }
 
 .form-input,
 .form-select {
   width: 100%;
   padding: 8px 12px;
   border: 1px solid #d9d9d9;
   border-radius: 4px;
   transition: all 0.3s;
 }
 
 .form-input:focus,
 .form-select:focus {
   outline: none;
   border-color: #4096ff;
   box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
 }
 
 /* Modal z-index settings */
 .modal {
   z-index: 9999 !important;
 }
 
 .modal-backdrop {
   z-index: 1040;
 }
 
 .app-container {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-primary);
  margin: 0;
  padding: 0;
  position: relative;
  min-height: 100vh;
}

.app-container::before,
.app-container::after,
.number-flow {
  display: none;
}

.number-flow::before,
.number-flow::after {
  content: '';
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
  height: 200px;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 50px,
    rgba(255, 215, 0, 0.03) 50px,
    rgba(255, 215, 0, 0.03) 100px
  );
  animation: numberFlow 15s infinite linear;
}

.number-flow::after {
  animation-delay: 7s;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 80px,
    rgba(0, 255, 174, 0.02) 80px,
    rgba(0, 255, 174, 0.02) 120px
  );
}

@keyframes numberFlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes lightBeam {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}
        /* Add forced-colors media query */
        @media (forced-colors: active) {
            .gold-text { forced-color-adjust: none; }
            .green-text { forced-color-adjust: none; }
            .big-number { forced-color-adjust: none; }
            .gold-number { forced-color-adjust: none; }
            .card-title, .section h2, .agreement-title, h2.card-title { forced-color-adjust: none; }
            .styled-button, .ant-btn-primary { forced-color-adjust: none; }
            .avatar-glow, .ant-avatar { forced-color-adjust: none; }
            .glass-stat-card { forced-color-adjust: none; }
            .glass-stat-label { forced-color-adjust: none; }
            .glass-stat-value { forced-color-adjust: none; }
            .glass-stat-sub { forced-color-adjust: none; }
            .ant-table { forced-color-adjust: none; }
            .ant-table-thead > tr > th { forced-color-adjust: none; }
            .ant-table-tbody > tr > td { forced-color-adjust: none; }
            .ant-tag { forced-color-adjust: none; }
            .ant-progress-bg { forced-color-adjust: none; }
            .ant-btn-link { forced-color-adjust: none; }
        }
        .main-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: var(--spacing-xl) var(--spacing-lg) 80px;
            position: relative;
            z-index: 1;
        }
        @media (max-width: 900px) { .main-content { padding: 24px 8px 40px 8px; } }
        .section {
            background: var(--bg-glass);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: var(--spacing-xl);
            padding: var(--spacing-xl) var(--spacing-lg);
            border: 1px solid var(--border-color);
            position: relative;
        }
        @media (max-width: 600px) {
          html, body {
            background: linear-gradient(135deg, #232B3E 60%, #222a3a 100%) !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          .main-content {
            max-width: 100vw !important;
            width: 100vw !important;
            min-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            left: 0 !important;
            position: relative !important;
            background: none !important;
            box-shadow: none !important;
          }
          .section {
            padding: 8px 0 !important;
            min-height: unset !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: none !important;
            border: none !important;
          }
          .vip-trade-cards-blackgold {
            padding: 0 !important;
            min-height: unset !important;
            margin-bottom: 0 !important;
            box-shadow: none !important;
            background: none !important;
          }
          .vip-trade-card-blackgold {
            margin: 0 0 16px 0;
            width: 100vw !important;
            max-width: 100vw !important;
            border-radius: 0 !important;
          }
        }
        .gold-text { 
            color: var(--text-primary);
            font-weight: 700;
            letter-spacing: 0.02em;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .green-text { 
            color: #34d399; 
            font-weight: 600;
        }
        .big-number { 
            font-family: 'Roboto Mono', 'Inter', monospace; 
            font-size: 2rem; 
            color: #34d399; 
            font-weight: 700;
        }
        .gold-number { 
            color: #c4b5fd;
            font-weight: 700;
        }
        .card-title,
        .section h2,
        .agreement-title,
        h2.card-title {
            color: var(--text-primary) !important;
            font-weight: 700;
            letter-spacing: 0.02em;
            margin-top: 28px;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
            background: transparent;
            display: inline-block;
        }
        .card-title::after,
        .section h2::after,
        h2.card-title::after {
            content: '';
            display: block;
            width: 48px;
            height: 3px;
            margin-top: 10px;
            border-radius: 999px;
            background: var(--primary-gradient);
        }
        .styled-button, .ant-btn-primary {
            background: var(--primary-gradient) !important;
            color: #fff !important;
            border: none !important;
            font-weight: 600;
            border-radius: var(--border-radius-sm) !important;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-base);
            height: 44px;
            padding: 0 24px;
            font-size: 0.95rem;
        }
        .styled-button:hover, .ant-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg), var(--shadow-glow);
        }
        .avatar-glow, .ant-avatar {
            border: 3px solid rgba(102, 126, 234, 0.5) !important;
            box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.12) !important;
            background: var(--bg-secondary) !important;
        }
        .glass-stat-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: var(--spacing-md);
            margin: var(--spacing-xl) 0;
        }
        .glass-stat-card {
            background: var(--bg-glass);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: var(--spacing-lg) var(--spacing-md);
            text-align: center;
            transition: all var(--transition-base);
        }
        .glass-stat-card:hover {
            transform: translateY(-4px);
            border-color: rgba(102, 126, 234, 0.35);
            box-shadow: var(--shadow-md);
        }
        .glass-stat-label { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px; font-weight: 500; min-height: auto; }
        .glass-stat-value {
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: 0.02em;
        }
        .glass-stat-sub { color: #c4b5fd; font-size: 0.95rem; margin-top: 6px; font-weight: 600; }
        .glass-stat-unit { font-size: 0.85rem; margin-left: 4px; color: var(--text-muted); }
        .ant-table { background: transparent !important; color: #fff; border-radius: 16px; overflow: hidden; }
        .ant-table-thead > tr > th { background: rgba(102, 126, 234, 0.12) !important; color: var(--text-primary) !important; font-weight: 600; font-size: 0.95rem; border-bottom: 1px solid var(--border-color) !important; text-align: center; }
        .ant-table-tbody > tr > td { background: transparent !important; color: var(--text-primary); font-size: 0.95rem; border-bottom: 1px solid var(--border-color) !important; text-align: center; font-weight: 500; }
        .ant-table-tbody > tr:hover > td { background: rgba(102, 126, 234, 0.08) !important; }
        .ant-btn-link { color: #c4b5fd !important; font-weight: 600; }
        .ant-btn-link:hover { color: #a78bfa !important; }
        .flex-row { display: flex; flex-wrap: wrap; gap: 40px; }
        .flex-col { display: flex; flex-direction: column; gap: 18px; }
        .mb-32 { margin-bottom: 32px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-16 { margin-bottom: 16px; }
        .mt-24 { margin-top: 24px; }
        .center { text-align: center; }
        .w-100 { width: 100%; }
        .card {
            background: var(--bg-glass);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            padding: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
            color: var(--text-primary);
            transition: all var(--transition-base);
        }
        .card:hover {
            box-shadow: var(--shadow-md);
            border-color: rgba(102, 126, 234, 0.35);
            transform: translateY(-4px);
        }
        .progress-bar { background: var(--primary-gradient); height: 8px; border-radius: 999px; }
        .progress-labels { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; margin-top: 10px; font-weight: 500; }
        /* 福利卡片优化 */
        .benefit-card { box-shadow: 0 8px 32px #FFD70022, 0 0 0 2px #FFD70022; border: 1.5px solid #FFD70033; background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%); }
        .benefit-card:hover { box-shadow: 0 16px 64px 0 #FFD70044, 0 0 0 3px #FFD700; border-color: #FFD700; transform: translateY(-6px) scale(1.04); }
        .benefit-card img { filter: drop-shadow(0 0 8px #FFD70088); }
        /* 响应式调整 - 表格部分 */
        @media (max-width: 1200px) {
            .vip-benefit-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .vip-benefit-grid {
                grid-template-columns: 1fr;
            }
            
            .table-wrapper {
                padding: 0 2px;
                border-radius: 8px;
                min-width: unset;
                max-width: 100vw;
                overflow-x: auto;
            }
            
            .vip-table {
                font-size: 0.98rem;
                min-width: 600px;
                border-radius: 8px;
            }
            
            .vip-table th, .vip-table td {
                padding: 8px 4px;
            }
        }
        
        @media (max-width: 480px) {
            .vip-table {
                font-size: 0.92rem;
                min-width: 480px;
            }
        }
        /* 分割线 */
        .divider { height: 1.5px; background: linear-gradient(90deg,#FFD70022 0%,#FFD70088 50%,#FFD70022 100%); border: none; margin: 40px 0; }
        /* 福利卡片高端升级 */
        .benefit-row { gap: 48px !important; }
        .benefit-card {
            background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
            box-shadow: 0 12px 48px #FFD70033, 0 0 0 3px #FFD70033;
            border: 2.5px solid #FFD70044;
            border-radius: 32px;
            transition: all 0.35s cubic-bezier(.4,2,.6,1);
            position: relative;
            min-width: 260px;
            aspect-ratio: 1/1;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-bottom: 0;
        }
        .benefit-card:hover {
            box-shadow: 0 24px 64px 0 #FFD70077, 0 0 0 5px #FFD700;
            border-color: #FFD700;
            transform: translateY(-10px) scale(1.06);
            z-index: 2;
        }
        .benefit-card img {
            filter: drop-shadow(0 0 16px #FFD70088);
        }
        @media (max-width: 1200px) {
            .benefit-row { gap: 24px !important; }
            .benefit-card { min-width: 48% !important; max-width: 48% !important; margin-bottom: 24px; }
        }
        @media (max-width: 900px) {
            .benefit-row { gap: 16px !important; }
            .benefit-card { min-width: 98% !important; max-width: 100% !important; margin-bottom: 18px; }
        }
        /* VIP交易记录表格样式 */
        .vip-table {
            width: 100%;
            min-width: 1440px;
            table-layout: auto;
            border-collapse: separate;
            border-spacing: 0 6px;
            background: rgba(24, 31, 42, 0.98);
        }
        
        .vip-table th {
            background: linear-gradient(90deg, #232e4a 0%, #181F2A 100%);
            color: #FFD700;
            font-weight: 700;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #FFD700;
        }
        
        .vip-table td {
            padding: 16px 20px;
            text-align: center;
            color: #fff;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .vip-table tr:hover td {
            background: rgba(255, 215, 0, 0.05);
        }
        
        .trade-type-table.buy {
            background: #00ffae22;
            color: #00ffae;
            border: 1.5px solid #00ffae;
            border-radius: 12px;
            padding: 2px 14px;
            font-weight: 700;
        }
        
        .trade-type-table.sell {
            background: #cf132222;
            color: #cf1322;
            border: 1.5px solid #cf1322;
            border-radius: 12px;
            padding: 2px 14px;
            font-weight: 700;
        }
        
        .trade-profit-table.profit-positive {
            color: #00ffae;
            font-weight: 900;
        }
        
        .trade-profit-table.profit-negative {
            color: #cf1322;
            font-weight: 900;
        }
        
        .trade-profit-table.profit-neutral {
            color: #ffffff;
            font-weight: 600;
        }
        @media (min-width: 1200px) {
            .benefit-row { gap: 56px !important; }
            .benefit-card { min-width: 340px !important; max-width: 24% !important; height: 340px !important; }
        }
        @media (max-width: 1199px) {
            .benefit-row { gap: 24px !important; }
            .benefit-card { min-width: 48% !important; max-width: 48% !important; height: 320px !important; }
        }
        @media (max-width: 900px) {
            .benefit-row { gap: 16px !important; }
            .benefit-card { min-width: 98% !important; max-width: 100% !important; height: auto !important; }
        }
        /* VIP福利卡片网格布局 */
        .vip-benefit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
            margin-bottom: 48px;
        }

        /* VIP福利卡片样式 */
        .vip-benefit-card {
            background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
            border-radius: 24px;
            padding: 32px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1.5px solid rgba(255, 215, 0, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .vip-benefit-card:hover {
            transform: translateY(-8px);
            border-color: #FFD700;
            box-shadow: 0 16px 48px rgba(255, 215, 0, 0.15);
        }

        .benefit-icon-wrapper {
            margin-bottom: 24px;
            display: inline-block;
            padding: 16px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 50%;
        }

        .benefit-title {
            color: #FFD700;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .benefit-list {
            list-style: none;
            padding: 0;
            margin: 0;
            text-align: left;
        }

        .benefit-list li {
            color: #b0c4e6;
            margin-bottom: 12px;
            padding-left: 24px;
            position: relative;
        }

        .benefit-list li:before {
            content: "•";
            color: #FFD700;
            position: absolute;
            left: 0;
            font-size: 1.2rem;
        }

        /* 会员协议部分样式 */
        .vip-agreement-section {
            background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
            border-radius: 24px;
            padding: 40px;
            margin-top: 48px;
            border: 1.5px solid rgba(255, 215, 0, 0.1);
        }

        .agreement-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .agreement-title {
            color: #FFD700;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .agreement-desc {
            color: #b0c4e6;
            font-size: 1.1rem;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
        }

        .agreement-table-section {
            margin-bottom: 40px;
            width: 100%;
        }

        .table-title {
            color: #FFD700;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
        }

        .table-wrapper {
            overflow-x: auto;
            padding: 0 8px;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            background: none;
            width: 100%;
            max-width: 100%;
        }

        .vip-table {
            width: 100%;
            min-width: 1440px;
            table-layout: auto;
            border-collapse: separate;
            border-spacing: 0 6px;
            background: rgba(24, 31, 42, 0.98);
        }

        .vip-table th {
            background: linear-gradient(90deg, #232e4a 0%, #181F2A 100%);
            color: #FFD700;
            font-weight: 700;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #FFD700;
        }

        .vip-table td {
            padding: 16px 20px;
            text-align: center;
            color: #fff;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .vip-table tr:hover td {
            background: rgba(255, 215, 0, 0.05);
        }

        .member-level {
            color: #FFD700;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 20px;
            background: rgba(255, 215, 0, 0.1);
        }

        .highlight {
            color: #FFD700;
            font-weight: 700;
        }

        .agreement-footer {
            text-align: center;
            margin-top: 40px;
        }

        .view-agreement-btn {
            background: linear-gradient(90deg, #FFD700 0%, #FFB300 100%);
            color: #181F2A;
            border: none;
            padding: 12px 32px;
            border-radius: 24px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .view-agreement-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
        }

        /* 响应式调整 */
        @media (max-width: 1200px) {
            .vip-benefit-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .vip-benefit-grid {
                grid-template-columns: 1fr;
            }

            .vip-agreement-section {
                padding: 24px;
            }

            .agreement-title {
                font-size: 1.5rem;
            }

            .table-title {
                font-size: 1.2rem;
            }
            .card-title {
                font-size: 1.3rem;
                margin-bottom: 18px;
            }
            .section {
                padding: 12px 2px;
                margin-bottom: 12px;
                border-radius: 10px;
            }
            .card {
                padding: 16px 8px;
                border-radius: 10px;
            }
            .glass-stat-card {
                padding: 18px 8px;
                min-width: 120px;
                border-radius: 10px;
            }
            .glass-stat-label, .glass-stat-value, .glass-stat-sub {
                font-size: 0.98rem;
            }
            .benefit-title {
                font-size: 1.1rem;
            }
            .benefit-list li {
                font-size: 0.98rem;
            }
            .vip-benefit-card {
                padding: 16px 8px;
                border-radius: 10px;
            }
            .vip-agreement-section {
                border-radius: 10px;
            }
            .agreement-header {
                margin-bottom: 18px;
            }
            .agreement-table-section {
                margin-bottom: 18px;
            }
            .table-wrapper {
                padding: 0 2px;
                border-radius: 8px;
                min-width: unset;
                max-width: 100vw;
                overflow-x: auto;
            }
            .vip-table {
                font-size: 0.98rem;
                min-width: 600px;
                border-radius: 8px;
            }
            .vip-table th, .vip-table td {
                padding: 8px 4px;
            }
            .view-agreement-btn, .styled-button {
                width: 100%;
                margin-bottom: 10px;
                font-size: 1rem;
                padding: 10px 0;
            }
            #trade-record-pagination {
                display: flex;
                flex-direction: column;
                gap: 8px;
                align-items: stretch;
            }
            .section, .table-wrapper {
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
            .card-title {
                padding-left: 12px !important;
                padding-right: 12px !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
        }
        @media (max-width: 480px) {
            .vip-table {
                font-size: 0.92rem;
                min-width: 480px;
            }
            .card-title, .agreement-title {
                font-size: 1.1rem;
            }
            .glass-stat-label, .glass-stat-value, .glass-stat-sub {
                font-size: 0.92rem;
            }
        }
        .trade-type-table.buy {
            background: #00ffae22;
            color: #00ffae;
            border: 1.5px solid #00ffae;
            border-radius: 12px;
            padding: 2px 14px;
            font-weight: 700;
        }
        .trade-type-table.sell {
            background: #cf132222;
            color: #cf1322;
            border: 1.5px solid #cf1322;
            border-radius: 12px;
            padding: 2px 14px;
            font-weight: 700;
        }
        .trade-profit-table.profit-positive {
            color: #00ffae;
            font-weight: 900;
        }
        .trade-profit-table.profit-negative {
            color: #cf1322;
            font-weight: 900;
        }
        .trade-profit-table.profit-neutral {
            color: #ffffff;
            font-weight: 600;
        }
        /* 移动端会员权益对比卡片样式 */
        .agreement-mobile-cards { display: none; }
        @media (max-width: 768px) {
            .agreement-table-pc { display: none !important; }
            .agreement-mobile-cards { display: block; margin-top: 12px; }
            .mobile-card-list { display: flex; flex-direction: column; gap: 16px; }
            .mobile-card {
                background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
                border-radius: 14px;
                box-shadow: 0 4px 16px #181F2A33, 0 0 0 2px #FFD70022;
                border: 1.5px solid rgba(255, 215, 0, 0.08);
                padding: 18px 16px 12px 16px;
            }
            .mobile-card-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
            }
            .mobile-card-title {
                color: #b0c4e6;
                font-size: 1.05rem;
                font-weight: 600;
            }
            .mobile-card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
                font-size: 1.02rem;
            }
            .mobile-card-row:last-child { border-bottom: none; }
        }
        .mobile-card {
            background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
            border-radius: 18px;
            box-shadow: 0 8px 32px #181F2A33, 0 0 0 2px #FFD70022;
            border: 1.5px solid rgba(255, 215, 0, 0.12);
            padding: 18px 16px 14px 16px;
            position: relative;
            overflow: hidden;
        }
        .mobile-card-badge-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 8px;
        }
        .mobile-badge {
            display: inline-block;
            font-size: 1.1rem;
            font-weight: 900;
            padding: 6px 18px;
            border-radius: 20px;
            color: #fff;
            box-shadow: 0 0 12px #FFD70055;
            letter-spacing: 1px;
        }
        .mobile-badge.vip { background: linear-gradient(90deg,#FFD700 60%,#FFB300 100%); color: #232B3E; }
        .mobile-badge.gold { background: linear-gradient(90deg,#ffe066 60%,#FFD700 100%); color: #232B3E; }
        .mobile-badge.diamond { background: linear-gradient(90deg,#b0c4e6 60%,#FFD700 100%); color: #232B3E; }
        .mobile-badge.black { background: linear-gradient(90deg,#232B3E 60%,#FFD700 100%); color: #FFD700; border:2px solid #FFD700; }
        .mobile-card-amount {
            font-size: 1.08rem;
            color: #b0c4e6;
            font-weight: 700;
            margin-bottom: 8px;
            margin-left: 2px;
        }
        .mobile-card-divider {
            height: 1.5px;
            background: linear-gradient(90deg,#FFD70022 0%,#FFD70088 50%,#FFD70022 100%);
            border: none;
            margin: 8px 0 10px 0;
        }
        .mobile-card-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 0;
        }
        .mobile-card-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 1.02rem;
            color: #fff;
            font-weight: 600;
            padding: 2px 0;
        }
        .mobile-card-item .icon {
            font-size: 1.1rem;
            margin-right: 2px;
        }
        .mobile-card-item .highlight {
            color: #FFD700;
            font-weight: 900;
            margin-left: 4px;
        }
        .member-rank-mobile-list { display: none; margin-top: 10px; }
        .member-rank-mobile-card {
            background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
            border-radius: 14px;
            box-shadow: 0 4px 16px #181F2A33, 0 0 0 2px #FFD70022;
            border: 1.5px solid rgba(255, 215, 0, 0.10);
            padding: 12px 12px 8px 12px;
            margin-bottom: 12px;
        }
        .member-rank-mobile-card .rank-row {
            display: flex;
            align-items: center;
        }
        .member-rank-mobile-card .rank-row-main {
            gap: 8px;
            margin-bottom: 6px;
        }
        .member-rank-mobile-card .rank-row-bottom {
            gap: 12px;
            justify-content: flex-end;
        }
        .member-rank-mobile-card .rank-num {
            font-size: 1.18rem;
            font-weight: 900;
            color: #FFD700;
            min-width: 24px;
            text-align: center;
            flex-shrink: 0;
        }
        .member-rank-mobile-card .rank-avatar {
            width: 28px; height: 28px; border-radius: 50%; background: #232b3e; color: #FFD700; font-weight: 900; text-align: center; line-height: 28px; font-size: 1.08rem; box-shadow: 0 0 6px #FFD70033; flex-shrink: 0;
        }
        .member-rank-mobile-card .rank-name {
            color: #fff; font-weight: 700; font-size: 1.05rem; margin: 0 4px; white-space:nowrap; flex: 1 1 0%; min-width: 0; overflow: hidden; text-overflow: ellipsis;
        }
        .member-rank-mobile-card .rank-level {
            font-size: 0.98rem; font-weight: 700; border-radius: 10px; padding: 2px 14px; margin-left: 0; flex-shrink: 0;
            width: 80px; min-width: 80px; max-width: 80px; text-align: center; display: inline-block;
        }
        .member-rank-mobile-card .rank-level.vip { background: #FFD700; color: #232B3E; }
        .member-rank-mobile-card .rank-level.gold { background: #ffe066; color: #232B3E; }
        .member-rank-mobile-card .rank-level.diamond { background: #b0c4e6; color: #232B3E; }
        .member-rank-mobile-card .rank-level.black { background: #232B3E; color: #FFD700; border:1.5px solid #FFD700; }
        .member-rank-mobile-card .rank-rate {
            color: #00ffae; font-weight: 900; font-size: 1.13rem; min-width: 60px; text-align: right; flex-shrink: 0;
        }
        .member-rank-mobile-card .rank-amount {
            color: #FFD700; font-weight: 900; font-size: 1.13rem; min-width: 80px; text-align: right; flex-shrink: 0;
        }
        @media (max-width: 768px) {
            .member-rank-table-pc { display: none !important; }
            .member-rank-mobile-list { display: block; }
        }
        .trade-record-header-flex {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 12px;
        }
        .trade-record-summary {
            color: #b0c4e6;
            font-size: 1.05rem;
            margin-bottom: 0;
            margin-top: 2px;
        }
        .trade-record-toggle-btn-wrap {
            display: flex;
            justify-content: center;
            margin: 12px 0 8px 0;
        }
        .trade-toggle-btn {
            background: linear-gradient(90deg, #FFD700 0%, #FFB300 100%);
            color: #232B3E;
            border: none;
            border-radius: 22px;
            font-weight: 900;
            font-size: 1.08rem;
            padding: 8px 36px;
            box-shadow: 0 4px 16px #FFD70033;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s;
        }
        .trade-toggle-btn:hover {
            background: linear-gradient(90deg, #FFE066 0%, #FFD700 100%);
            box-shadow: 0 8px 24px #FFD70055;
            transform: translateY(-2px) scale(1.03);
        }
        .trade-record-detail {
            overflow: hidden;
            transition: max-height 0.35s cubic-bezier(.4,2,.6,1), opacity 0.25s;
            max-height: 1200px;
            opacity: 1;
        }
        .trade-record-detail-collapsed {
            max-height: 0 !important;
            opacity: 0;
            pointer-events: none;
        }
        .trade-record-detail-expanded {
            max-height: 1200px;
            opacity: 1;
            pointer-events: auto;
        }
        @media (max-width: 768px) {
            .trade-record-header-flex {
                flex-direction: column;
                align-items: flex-start;
                gap: 2px;
            }
            .trade-record-toggle-btn-wrap {
                margin: 10px 0 6px 0;
            }
            .trade-toggle-btn {
                width: 100%;
                font-size: 1.05rem;
                padding: 10px 0;
            }
        }
        /* 会员收益排名表格"排名"列左对齐 */
        .member-rank-table-pc table tr td:first-child,
        .member-rank-table-pc table tr th:first-child {
            text-align: left !important;
            padding-left: 24px !important;
        }
        .profit-amount-cell {
            font-weight: bold;
            font-size: 1.08rem;
        }
        .profit-amount-cell.positive { color: #00ffae; }
        .profit-amount-cell.negative { color: #ff4d4f; }
        .profit-amount-cell.zero { color: #ffd700; }
        .rank-row:hover {
            background: linear-gradient(90deg,#FFD70022 0%,#fffbe6 100%) !important;
            box-shadow: 0 2px 12px #FFD70033;
            transition: all 0.2s;
        }
        .ratio-badge {
          display: inline-block;
          min-width: 32px;
          padding: 2px 8px;
          background: linear-gradient(90deg, #FFD700 60%, #FFB300 100%);
          color: #232B3E;
          font-weight: 900;
          font-size: 1rem;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 2px 8px #FFD70033;
          letter-spacing: 1px;
        }
        .membership-badge {
            display: inline-block;
            padding: 3px 18px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 1.05rem;
        }
        .membership-badge.gold-member {
            background: linear-gradient(90deg,#FFD700,#FFB300);
            color: #232B3E;
        }
        .membership-badge.diamond-member {
            background: linear-gradient(90deg,#b0c4e6,#fff);
            color: #232B3E;
        }
        .membership-badge.black-card-member {
            background: linear-gradient(90deg,#232B3E,#FFD700);
            color: #FFD700;
            border: 1.5px solid #FFD700;
        }
        .membership-badge.regular-member {
            background: #eee;
            color: #232B3E;
        }
        /* 移动端会员收益排名卡片样式 */
        @media (max-width: 768px) {
          .member-rank-mobile-list {
            display: block;
            margin-top: 10px;
          }
          .member-rank-mobile-card {
            background: #232e4a;
            border-radius: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 16px;
            padding: 16px 12px;
            color: #fff;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .rank-row-main {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }
          .rank-num {
            font-size: 1.3em;
            font-weight: bold;
            width: 28px;
            text-align: center;
          }
          .rank-avatar {
            border-radius: 50%;
            border: 2px solid #b0c4e6;
            width: 36px;
            height: 36px;
            object-fit: cover;
          }
          .rank-name {
            font-weight: 500;
            flex: 1;
            margin-left: 6px;
          }
          .rank-level {
            font-size: 0.95em;
            padding: 2px 8px;
            border-radius: 8px;
            background: #1a2236;
            margin-left: 4px;
          }
          .rank-row-bottom {
            font-size: 1.05em;
            justify-content: space-between;
            margin-top: 2px;
          }
        }
        @media (min-width: 769px) {
          .member-rank-mobile-list { display: none !important; }
        }
        @media (max-width: 768px) {
          .agreement-table-pc { display: none !important; }
          .agreement-mobile-cards { display: block !important; }
        }
        @media (min-width: 769px) {
          .agreement-mobile-cards { display: none !important; }
        }
        .mobile-card-label {
          display: inline-block;
          min-width: 140px;
          color: #FFD700;
          font-weight: 700;
          text-align: left;
        }
        .mobile-card-value {
          color: #FFD700;
          font-weight: 900;
          margin-left: 8px;
        }
        @media (max-width: 768px) {
          .agreement-table-pc { display: none !important; }
          .agreement-mobile-cards { display: block !important; }
        }
        @media (min-width: 769px) {
          .agreement-mobile-cards { display: none !important; }
        }
        .agreement-mobile-cards {
          margin-top: 24px;
        }
        .mobile-section-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 12px;
          margin-top: 24px;
          letter-spacing: 1px;
          text-align: left;
          border-bottom: 2.5px solid #FFD700;
          padding-bottom: 4px;
        }
        .mobile-card-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .mobile-card {
          background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
          border-radius: 18px;
          box-shadow: 0 4px 16px #181F2A33, 0 0 0 2px #FFD70022;
          border: 1.5px solid rgba(255,215,0,0.10);
          padding: 18px 16px 14px 16px;
          position: relative;
          overflow: hidden;
        }
        .mobile-badge-row {
          margin-bottom: 10px;
          text-align: left;
        }
        .mobile-badge {
          display: inline-block;
          font-size: 1.1rem;
          font-weight: 900;
          padding: 6px 18px;
          border-radius: 20px;
          color: #232B3E;
          background: linear-gradient(90deg,#FFD700 60%,#FFB300 100%);
          box-shadow: 0 0 12px #FFD70055;
          letter-spacing: 1px;
        }
        .mobile-badge.gold { background: linear-gradient(90deg,#ffe066 60%,#FFD700 100%); color: #232B3E; }
        .mobile-badge.diamond { background: linear-gradient(90deg,#b0c4e6 60%,#FFD700 100%); color: #232B3E; }
        .mobile-badge.black { background: linear-gradient(90deg,#232B3E 60%,#FFD700 100%); color: #FFD700; border:2px solid #FFD700; }
        .mobile-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;
        }
        .mobile-info-label {
          color: #b0c4e6;
          font-size: 1.05rem;
          font-weight: 700;
        }
        .mobile-info-value {
          color: #FFD700;
          font-size: 1.08rem;
          font-weight: 900;
          margin-left: 12px;
        }
        @media (max-width: 768px) {
          .agreement-table-pc { display: none !important; }
          .agreement-mobile-cards { display: block !important; }
        }
        @media (min-width: 769px) {
          .agreement-mobile-cards { display: none !important; }
        }
        .member-rank-table-pc th {
          font-size: 1.18rem;
          font-weight: 900;
          color: #FFD700;
          background: #232e4a;
          border-bottom: 3px solid #FFD700;
          text-align: center;
          letter-spacing: 1px;
          padding: 18px 0;
        }
        .member-rank-table-pc td {
          font-size: 1.08rem;
          font-weight: 700;
          color: #fff;
          background: #232b3e;
          text-align: center;
          padding: 12px 0;
        }
        .member-rank-table-pc .membership-badge {
          display: inline-block;
          font-size: 1.08rem;
          font-weight: 900;
          padding: 6px 18px;
          border-radius: 20px;
          margin-right: 8px;
          background: linear-gradient(90deg,#FFD700 60%,#FFB300 100%);
          color: #232B3E;
          box-shadow: 0 0 12px #FFD70055;
          letter-spacing: 1px;
        }
        .member-rank-table-pc .membership-badge.gold-member { background: linear-gradient(90deg,#ffe066 60%,#FFD700 100%); color: #232B3E; }
        .member-rank-table-pc .membership-badge.diamond-member { background: linear-gradient(90deg,#b0c4e6 60%,#FFD700 100%); color: #232B3E; }
        .member-rank-table-pc .membership-badge.supreme-black-card { background: linear-gradient(90deg,#232B3E 60%,#FFD700 100%); color: #FFD700; border:2px solid #FFD700; }
        .member-rank-table-pc .membership-badge.regular-member { background: #eee; color: #232B3E; }
        /* 表格容器样式 */
        .table-wrapper {
            overflow-x: auto;
            padding: 0 8px;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            background: none;
            width: 100%;
            max-width: 100%;
        }
        /* 投资公告与策略（美化版） */
        .announcement-card {
          background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
          border-radius: 20px;
          box-shadow: 0 4px 24px #181F2A33, 0 0 0 2px #FFD70022;
          border: 1.5px solid rgba(255,215,0,0.10);
          padding: 28px 24px 20px 24px;
          margin-bottom: 28px;
          position: relative;
          color: #fff;
          transition: box-shadow 0.2s;
        }
        .announcement-card:hover {
          box-shadow: 0 8px 32px #FFD70044, 0 0 0 3px #FFD700;
        }
        .announcement-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .announcement-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 1px;
          flex: 1;
        }
        .priority-badge {
          font-size: 0.98rem;
          font-weight: 900;
          border-radius: 14px;
          padding: 4px 18px;
          margin-left: 12px;
          box-shadow: 0 2px 8px #FFD70033;
          letter-spacing: 1px;
          position: relative;
          top: 0;
          right: 0;
          display: inline-block;
        }
        .priority-high { background: linear-gradient(90deg,#ff4d4f 60%,#ffb300 100%); color: #fff; }
        .priority-medium { background: linear-gradient(90deg,#faad14 60%,#ffd700 100%); color: #232B3E; }
        .priority-low { background: linear-gradient(90deg,#00ffae 60%,#b0c4e6 100%); color: #232B3E; }
        .announcement-content {
          font-size: 1.08rem;
          color: #b0c4e6;
          margin-bottom: 18px;
          line-height: 1.7;
          word-break: break-all;
          white-space: pre-wrap;
        }
        .announcement-meta {
          font-size: 0.98rem;
          color: #b0c4e6;
          display: flex;
          gap: 24px;
          justify-content: flex-end;
          align-items: center;
        }
        .no-announcements {
          background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
          border-radius: 20px;
          box-shadow: 0 4px 24px #181F2A33, 0 0 0 2px #FFD70022;
          border: 1.5px solid rgba(255,215,0,0.10);
          padding: 40px 24px;
          margin-bottom: 28px;
          color: #b0c4e6;
          text-align: center;
        }
        .no-announcements i {
          font-size: 2.5rem;
          margin-bottom: 15px;
          color: #FFD700;
          opacity: 0.7;
        }
        .vip-trade-cards-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          justify-content: flex-start;
        }
        .vip-trade-card {
          background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
          border-radius: 20px;
          box-shadow: 0 8px 32px #181F2A33, 0 0 0 2px #FFD70022;
          border: 1.5px solid rgba(255, 255, 255, 0.10);
          color: #fff;
          padding: 28px 22px 18px 22px;
          min-width: 320px;
          max-width: 370px;
          flex: 1 1 320px;
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .vip-trade-card:hover {
          box-shadow: 0 16px 64px 0 #FFD70044, 0 0 0 3px #FFD700;
          border-color: #FFD700;
          transform: translateY(-6px) scale(1.03);
        }
        .vip-trade-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .vip-trade-symbol {
          font-size: 1.3rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 1px;
        }
        .vip-trade-type.buy {
          background: #00ffae22;
          color: #00ffae;
          border: 1.5px solid #00ffae;
          border-radius: 10px;
          padding: 2px 14px;
          font-weight: 700;
          font-size: 1.05rem;
        }
        .vip-trade-type.sell {
          background: #cf132222;
          color: #cf1322;
          border: 1.5px solid #cf1322;
          border-radius: 10px;
          padding: 2px 14px;
          font-weight: 700;
          font-size: 1.05rem;
        }
        .vip-trade-status {
          margin-left: auto;
          font-size: 1.05rem;
          font-weight: 700;
          padding: 2px 12px;
          border-radius: 10px;
          background: #232b3e;
          border: 1.5px solid #FFD70055;
          color: #FFD700;
        }
        .status-open { background: #232b3e; color: #FFD700; }
        .status-closed, .status-平仓 { background: #00ffae22; color: #00ffae; border-color: #00ffae; }
        .status-cancelled, .status-已取消 { background: #cf132222; color: #cf1322; border-color: #cf1322; }
        .vip-trade-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .vip-trade-info-group {
          display: flex;
          gap: 18px;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .vip-trade-info-group > div {
          min-width: 120px;
          font-size: 1.05rem;
        }
        .vip-trade-pnl.up, .vip-trade-roi.up { color: #00ffae; font-weight: 900; }
        .vip-trade-pnl.down, .vip-trade-roi.down { color: #cf1322; font-weight: 900; }
        @media (max-width: 900px) {
          .vip-trade-cards-grid { flex-direction: column; gap: 16px; }
          .vip-trade-card { min-width: 0; max-width: 100%; padding: 18px 8px; border-radius: 10px; }
          .vip-trade-info-group > div { min-width: 90px; font-size: 0.98rem; }
        }
        .vip-trade-cards-premium {
          display: flex;
          flex-wrap: wrap;
          gap: 36px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .vip-trade-card-premium {
          background: rgba(24,31,42,0.98);
          border-radius: 28px;
          box-shadow: 0 12px 48px 0 #181F2A55, 0 2px 24px #FFD70022;
          border: 1.5px solid rgba(255,215,0,0.13);
          color: #fff;
          padding: 32px 28px 22px 28px;
          min-width: 360px;
          max-width: 420px;
          flex: 1 1 420px;
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
          transition: box-shadow 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .vip-trade-cards-premium {
            flex-wrap: wrap;
            justify-content: center;
          }
          .vip-trade-card-premium {
            flex-basis: calc(50% - 36px);
            margin-left: 0;
            margin-right: 0;
          }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-premium { flex-direction: column; gap: 18px; }
          .vip-trade-card-premium { min-width: 0; max-width: 100%; padding: 18px 8px; border-radius: 14px; }
          .vip-trade-premium-body { flex-direction: column; gap: 8px; }
        }
        .vip-trade-card-premium:before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, #FFD70033 0%, rgba(255,215,0,0) 80%);
          z-index: 0;
        }
        .vip-trade-card-premium-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 10px;
          z-index: 1;
        }
        .vip-trade-symbol-premium {
          font-size: 1.5rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px #FFD70044;
        }
        .vip-trade-type-premium.buy {
          background: #00ffae22;
          color: #00ffae;
          border: 1.5px solid #00ffae;
          border-radius: 12px;
          padding: 2px 18px;
          font-weight: 700;
          font-size: 1.08rem;
          box-shadow: 0 0 8px #00ffae33;
        }
        .vip-trade-type-premium.sell {
          background: #cf132222;
          color: #cf1322;
          border: 1.5px solid #cf1322;
          border-radius: 12px;
          padding: 2px 18px;
          font-weight: 700;
          font-size: 1.08rem;
          box-shadow: 0 0 8px #cf132233;
        }
        .vip-trade-meta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          z-index: 1;
        }
        .vip-trade-status-premium {
          font-size: 1.05rem;
          font-weight: 700;
          padding: 2px 14px;
          border-radius: 10px;
          background: #232b3e;
          border: 1.5px solid #FFD70055;
          color: #FFD700;
          letter-spacing: 1px;
        }
        .status-open { background: #232b3e; color: #FFD700; }
        .status-closed, .status-平仓 { background: #00ffae22; color: #00ffae; border-color: #00ffae; }
        .status-cancelled, .status-已取消 { background: #cf132222; color: #cf1322; border-color: #cf1322; }
        .vip-trade-entrytime { color: #b0c4e6; font-size: 1.01rem; display: flex; align-items: center; gap: 4px; }
        .vip-trade-premium-body {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin-bottom: 18px;
          z-index: 1;
        }
        .vip-trade-premium-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vip-label {
          color: #b0c4e6;
          font-size: 0.98rem;
          margin-right: 8px;
          font-weight: 600;
        }
        .vip-value {
          color: #fff;
          font-size: 1.08rem;
          font-weight: 700;
        }
        .vip-trade-premium-footer {
          display: flex;
          flex-direction: row;
          gap: 32px;
          align-items: center;
          margin-top: 8px;
          z-index: 1;
        }
        .vip-pnl-group, .vip-roi-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .vip-pnl-label, .vip-roi-label {
          color: #b0c4e6;
          font-size: 0.98rem;
          font-weight: 600;
        }
        .vip-pnl-value.up, .vip-roi-value.up {
          color: #00ffae;
          font-weight: 900;
          font-size: 1.25rem;
          text-shadow: 0 0 8px #00ffae55;
        }
        .vip-pnl-value.down, .vip-roi-value.down {
          color: #cf1322;
          font-weight: 900;
          font-size: 1.25rem;
          text-shadow: 0 0 8px #cf132255;
        }
        .vip-trade-cards-wide {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          margin-bottom: 32px;
          justify-content: space-between;
        }
        .vip-trade-card-wide {
          background: linear-gradient(135deg, #232B3E 60%, #232e4a 100%);
          border-radius: 28px;
          box-shadow: 0 8px 32px #181F2A44, 0 0 0 2px #FFD70033;
          border: 2px solid rgba(255,215,0,0.10);
          color: #fff;
          padding: 38px 48px 28px 48px;
          flex: 1 1 calc(50% - 16px);
          min-width: 0;
          max-width: calc(50% - 16px);
          display: flex;
          flex-direction: column;
          margin-bottom: 0;
          transition: box-shadow 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
        }
        .vip-trade-card-wide:not(:last-child) {
          margin-right: 0;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-wide { padding: 18px 8px; }
          .vip-trade-cards-wide { gap: 18px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-wide { flex-direction: column; gap: 18px; }
          .vip-trade-card-wide { max-width: 100%; flex-basis: 100%; border-radius: 16px; padding: 12px 2vw; }
        }
        .vip-trade-cards-lux {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-bottom: 32px;
          justify-content: space-between;
        }
        .vip-trade-card-lux {
          background: linear-gradient(90deg, rgba(35,43,62,0.92) 60%, rgba(35,46,74,0.92) 100%);
          border-radius: 36px;
          box-shadow: 0 4px 32px 0 #FFD70033, 0 0 0 2px #FFD70022;
          border: 1.5px solid rgba(255,215,0,0.10);
          color: #fff;
          padding: 0 38px;
          min-height: 120px;
          max-height: 140px;
          height: 120px;
          flex: 1 1 calc(50% - 14px);
          min-width: 0;
          max-width: calc(50% - 14px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
          backdrop-filter: blur(6px) saturate(1.2);
        }
        .vip-trade-card-lux:before {
          content: '';
          position: absolute;
          left: -60px; top: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, #FFD70033 0%, rgba(255,215,0,0) 80%);
          z-index: 0;
        }
        .vip-trade-card-lux:hover {
          box-shadow: 0 8px 48px 0 #FFD70055, 0 0 0 3px #FFD700;
          border-color: #FFD700;
          transform: translateY(-3px) scale(1.01);
        }
        .vip-trade-lux-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          min-width: 180px;
          z-index: 1;
        }
        .vip-symbol-lux {
          font-size: 2.1rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px #FFD70044;
          margin-bottom: 2px;
        }
        .vip-type-lux {
          display: inline-block;
          margin-right: 12px;
          font-size: 1.08rem;
          font-weight: 700;
          padding: 2px 18px;
          border-radius: 12px;
          border: 1.5px solid #00ffae;
          color: #00ffae;
          background: #00ffae22;
          box-shadow: 0 0 8px #00ffae33;
        }
        .vip-type-lux.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #cf132222;
          box-shadow: 0 0 8px #cf132233;
        }
        .vip-status-lux {
          display: inline-block;
          font-size: 1.08rem;
          font-weight: 700;
          padding: 2px 14px;
          border-radius: 10px;
          background: #232b3e;
          border: 1.5px solid #FFD70055;
          color: #FFD700;
          margin-left: 8px;
        }
        .vip-trade-lux-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          align-items: flex-end;
          z-index: 1;
        }
        .vip-lux-row {
          display: flex;
          flex-direction: row;
          gap: 38px;
          align-items: center;
        }
        .vip-label-lux {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 600;
          margin-right: 4px;
        }
        .vip-value-lux {
          color: #fff;
          font-size: 1.18rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 12px;
        }
        .vip-pnl-lux, .vip-roi-lux {
          font-size: 1.7rem;
          font-weight: 900;
          margin-left: 12px;
          text-shadow: 0 0 8px #00ffae55;
        }
        .vip-pnl-lux.up, .vip-roi-lux.up { color: #00ffae; }
        .vip-pnl-lux.down, .vip-roi-lux.down { color: #cf1322; text-shadow: 0 0 8px #cf132255; }
        .vip-lux-meta {
          color: #b0c4e6;
          font-size: 1.01rem;
          font-weight: 500;
          margin-top: 2px;
          text-align: right;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-lux { padding: 0 8px; }
          .vip-trade-cards-lux { gap: 14px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-lux { flex-direction: column; gap: 14px; }
          .vip-trade-card-lux { max-width: 100%; flex-basis: 100%; border-radius: 18px; height: auto; min-height: 90px; }
          .vip-trade-lux-right { align-items: flex-start; }
        }
        .vip-trade-cards-prolux {
          display: flex;
          flex-wrap: wrap;
          gap: 36px;
          margin-bottom: 40px;
          justify-content: space-between;
        }
        .vip-trade-card-prolux {
          background: linear-gradient(120deg, rgba(35,43,62,0.92) 70%, rgba(35,46,74,0.96) 100%);
          border-radius: 0;
          box-shadow: 0 0 48px 0 #FFD70033, 0 0 0 2px #FFD70022;
          border: 2px solid rgba(255,215,0,0.18);
          color: #fff;
          padding: 0;
          min-height: 200px;
          max-height: 240px;
          flex: 1 1 calc(50% - 18px);
          min-width: 0;
          max-width: calc(50% - 18px);
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
          backdrop-filter: blur(10px) saturate(1.18);
          animation: card-glow-breath 2.8s infinite alternate;
        }
        @keyframes card-glow-breath {
          0% { box-shadow: 0 0 48px 0 #FFD70033, 0 0 0 2px #FFD70022; }
          100% { box-shadow: 0 0 80px 12px #FFD70077, 0 0 0 4px #FFD70044; }
        }
        .vip-trade-card-prolux:before { display: none; }
        .vip-trade-card-prolux:hover {
          box-shadow: 0 0 120px 24px #FFD70099, 0 0 0 4px #FFD700;
          border-color: #FFD700;
          transform: translateY(-4px) scale(1.01);
        }
        .vip-prolux-left {
          flex: 0 0 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #232B3E 60%, #FFD70022 100%);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          position: relative;
          z-index: 1;
          min-width: 160px;
          max-width: 200px;
          padding: 0 24px;
        }
        .vip-prolux-symbol {
          font-size: 2.6rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 2px;
          text-shadow: 0 2px 16px #FFD70077;
          margin-bottom: 12px;
          margin-top: 8px;
        }
        .vip-prolux-tags {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .vip-prolux-type {
          font-size: 1.15rem;
          font-weight: 700;
          padding: 4px 28px;
          border-radius: 16px;
          border: 2px solid #00ffae;
          color: #00ffae;
          background: #00ffae22;
          box-shadow: 0 0 12px #00ffae33;
          margin-bottom: 2px;
        }
        .vip-prolux-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #cf132222;
          box-shadow: 0 0 12px #cf132233;
        }
        .vip-prolux-status {
          font-size: 1.08rem;
          font-weight: 700;
          padding: 2px 18px;
          border-radius: 12px;
          background: #232b3e;
          border: 2px solid #FFD70055;
          color: #FFD700;
          margin-top: 2px;
        }
        .vip-prolux-glowdot { display: none; }
        .vip-prolux-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 28px 36px 28px 24px;
          z-index: 1;
          min-width: 0;
          overflow-x: auto;
        }
        .vip-prolux-row {
          display: flex;
          flex-direction: row;
          gap: 44px;
          align-items: center;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .vip-prolux-label {
          color: #b0c4e6;
          font-size: 1.08rem;
          font-weight: 600;
          margin-right: 4px;
        }
        .vip-prolux-value {
          color: #fff;
          font-size: 1.22rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 12px;
          word-break: break-all;
        }
        .vip-prolux-pnl, .vip-prolux-roi {
          font-size: 2.1rem;
          font-weight: 900;
          margin-left: 12px;
          text-shadow: 0 0 16px #00ffae55;
        }
        .vip-prolux-pnl.up, .vip-prolux-roi.up { color: #00ffae; }
        .vip-prolux-pnl.down, .vip-prolux-roi.down { color: #cf1322; text-shadow: 0 0 16px #cf132255; }
        .vip-prolux-meta {
          color: #b0c4e6;
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 6px;
          text-align: right;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-prolux { padding: 0; }
          .vip-trade-cards-prolux { gap: 14px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-prolux { flex-direction: column; gap: 14px; }
          .vip-trade-card-prolux { max-width: 100%; flex-basis: 100%; border-radius: 0; height: auto; min-height: 120px; }
          .vip-prolux-left { min-width: 100px; max-width: 120px; padding: 0 8px; }
          .vip-prolux-right { padding: 18px 8px 18px 8px; }
        }
        .vip-trade-cards-ultimate {
          display: flex;
          flex-wrap: wrap;
          gap: 36px;
          margin-bottom: 40px;
          justify-content: space-between;
        }
        .vip-trade-card-ultimate {
          background: linear-gradient(120deg, rgba(35,43,62,0.98) 70%, rgba(35,46,74,0.96) 100%);
          border-radius: 0;
          box-shadow: 0 0 64px 0 #FFD70044, 0 0 0 2px #FFD70022;
          border: 2px solid rgba(255,215,0,0.18);
          color: #fff;
          padding: 0;
          min-height: 180px;
          max-height: 220px;
          flex: 1 1 calc(50% - 18px);
          min-width: 0;
          max-width: calc(50% - 18px);
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
          backdrop-filter: blur(10px) saturate(1.18);
          animation: card-glow-breath 2.8s infinite alternate;
        }
        @keyframes card-glow-breath {
          0% { box-shadow: 0 0 64px 0 #FFD70044, 0 0 0 2px #FFD70022; }
          100% { box-shadow: 0 0 120px 24px #FFD70099, 0 0 0 4px #FFD70044; }
        }
        .vip-trade-card-ultimate:hover {
          box-shadow: 0 0 120px 32px #FFD700cc, 0 0 0 4px #FFD700;
          border-color: #FFD700;
          transform: translateY(-4px) scale(1.01);
        }
        .vip-ultimate-left {
          flex: 0 0 200px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          background: linear-gradient(135deg, #232B3E 60%, #FFD70022 100%);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          position: relative;
          z-index: 1;
          min-width: 160px;
          max-width: 220px;
          padding: 0 32px;
          gap: 18px;
        }
        .vip-ultimate-symbol {
          font-size: 2.7rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 2px;
          text-shadow: 0 2px 18px #FFD70099;
          margin-bottom: 8px;
          margin-top: 8px;
        }
        .vip-ultimate-tags {
          display: flex;
          flex-direction: row;
          gap: 12px;
          align-items: center;
        }
        .vip-ultimate-type {
          font-size: 1.18rem;
          font-weight: 700;
          padding: 4px 28px;
          border-radius: 16px;
          border: 2px solid #00ffae;
          color: #00ffae;
          background: #00ffae22;
          box-shadow: 0 0 12px #00ffae33;
        }
        .vip-ultimate-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #cf132222;
          box-shadow: 0 0 12px #cf132233;
        }
        .vip-ultimate-status {
          font-size: 1.12rem;
          font-weight: 700;
          padding: 2px 18px;
          border-radius: 12px;
          background: #232b3e;
          border: 2px solid #FFD70055;
          color: #FFD700;
        }
        .vip-ultimate-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 32px 36px 32px 24px;
          z-index: 1;
          min-width: 0;
        }
        .vip-ultimate-row {
          display: flex;
          flex-direction: row;
          gap: 44px;
          align-items: center;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .vip-ultimate-label {
          color: #b0c4e6;
          font-size: 1.08rem;
          font-weight: 600;
          margin-right: 4px;
        }
        .vip-ultimate-value {
          color: #fff;
          font-size: 1.22rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 12px;
          word-break: break-all;
        }
        .vip-ultimate-pnl, .vip-ultimate-roi {
          font-size: 2.1rem;
          font-weight: 900;
          margin-left: 12px;
          text-shadow: 0 0 16px #00ffae55;
        }
        .vip-ultimate-pnl.up, .vip-ultimate-roi.up { color: #00ffae; }
        .vip-ultimate-pnl.down, .vip-ultimate-roi.down { color: #cf1322; text-shadow: 0 0 16px #cf132255; }
        .vip-ultimate-meta {
          color: #b0c4e6;
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 6px;
          text-align: right;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-ultimate { padding: 0; }
          .vip-trade-cards-ultimate { gap: 14px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-ultimate { flex-direction: column; gap: 14px; }
          .vip-trade-card-ultimate { max-width: 100%; flex-basis: 100%; border-radius: 0; height: auto; min-height: 120px; }
          .vip-ultimate-left { min-width: 100px; max-width: 120px; padding: 0 8px; }
          .vip-ultimate-right { padding: 18px 8px 18px 8px; }
        }
        .vip-trade-card-ultimate {
          max-height: 220px;
          height: 200px;
          overflow: visible;
          display: flex;
        }
        .vip-ultimate-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          min-width: 140px;
          max-width: 180px;
          padding: 0 18px;
        }
        .vip-ultimate-symbol {
          font-size: 2.5rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 2px;
          text-shadow: 0 2px 18px #FFD70099;
          margin: 0 0 8px 0;
        }
        .vip-ultimate-tags {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          align-items: center;
        }
        .vip-ultimate-type, .vip-ultimate-status {
          width: 80px;
          min-height: 32px;
          line-height: 32px;
          text-align: center;
          display: block;
          font-size: 1.08rem;
        }
        .vip-ultimate-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
          padding: 22px 18px 22px 8px;
          min-width: 0;
          height: 100%;
        }
        .vip-ultimate-meta {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 500;
          margin-bottom: 0;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vip-ultimate-row {
          display: flex;
          flex-direction: row;
          gap: 18px;
          align-items: center;
          margin-bottom: 0;
          width: 100%;
          justify-content: flex-start;
        }
        .vip-ultimate-label {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 600;
          min-width: 44px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-ultimate-value, .vip-ultimate-pnl, .vip-ultimate-roi {
          color: #fff;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 10px;
          min-width: 0;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: clamp(1rem, 2vw, 1.18rem);
        }
        .vip-ultimate-pnl, .vip-ultimate-roi {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
        }
        .vip-ultimate-pnl.up, .vip-ultimate-roi.up { color: #00ffae; }
        .vip-ultimate-pnl.down, .vip-ultimate-roi.down { color: #cf1322; text-shadow: 0 0 16px #cf132255; }
        @media (max-width: 900px) {
          .vip-trade-card-ultimate { height: auto; min-height: 120px; }
          .vip-ultimate-left { padding: 0 6px; }
          .vip-ultimate-right { padding: 10px 4px 10px 4px; }
          .vip-ultimate-row { gap: 8px; }
        }
        .vip-trade-cards-ultimate {
          overflow: visible !important;
        }
        .vip-trade-card-ultimate {
          max-height: none;
          height: 200px;
          overflow: visible !important;
          display: flex;
        }
        .vip-ultimate-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
          padding: 22px 18px 22px 8px;
          min-width: 0;
          height: 100%;
        }
        .vip-ultimate-row {
          display: flex;
          flex-direction: row;
          gap: 18px;
          align-items: center;
          margin-bottom: 0;
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .vip-ultimate-label {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 600;
          min-width: 44px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-ultimate-value, .vip-ultimate-pnl, .vip-ultimate-roi {
          color: #fff;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 10px;
          min-width: 0;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: clamp(1rem, 2vw, 1.18rem);
        }
        .vip-ultimate-pnl, .vip-ultimate-roi {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
        }
        @media (max-width: 900px) {
          .vip-trade-card-ultimate { height: auto; min-height: 120px; }
          .vip-ultimate-left { padding: 0 6px; }
          .vip-ultimate-right { padding: 10px 4px 10px 4px; }
          .vip-ultimate-row { gap: 8px; }
        }
        .vip-trade-cards-finance {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          margin-bottom: 40px;
          justify-content: space-between;
        }
        .vip-trade-card-finance {
          background: linear-gradient(120deg, rgba(30,34,48,0.98) 70%, rgba(35,38,58,0.96) 100%);
          border-radius: 0;
          box-shadow: 0 0 32px 0 #FFD70044, 0 0 0 2px #FFD70044;
          border: 2px solid #FFD70055;
          color: #fff;
          min-height: 180px;
          max-height: 220px;
          flex: 1 1 calc(50% - 16px);
          min-width: 0;
          max-width: calc(50% - 16px);
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
          backdrop-filter: blur(10px) saturate(1.12);
        }
        .vip-trade-card-finance:hover {
          box-shadow: 0 0 64px 8px #FFD700cc, 0 0 0 4px #FFD700;
          border-color: #FFD700;
          transform: translateY(-2px) scale(1.01);
        }
        .vip-finance-left {
          flex: 0 0 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #232B3E 60%, #FFD70022 100%);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          min-width: 120px;
          max-width: 180px;
          padding: 0 18px;
          gap: 18px;
        }
        .vip-finance-symbol {
          font-size: 2.5rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 2px;
          text-shadow: 0 2px 18px #FFD70099;
          margin-bottom: 8px;
          margin-top: 8px;
        }
        .vip-finance-tags {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .vip-finance-type {
          font-size: 1.08rem;
          font-weight: 700;
          padding: 4px 24px;
          border-radius: 16px;
          border: 2px solid #00ffae;
          color: #00ffae;
          background: #00ffae22;
          box-shadow: 0 0 8px #00ffae33;
        }
        .vip-finance-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #cf132222;
          box-shadow: 0 0 8px #cf132233;
        }
        .vip-finance-status {
          font-size: 1.02rem;
          font-weight: 700;
          padding: 2px 16px;
          border-radius: 12px;
          background: #232b3e;
          border: 2px solid #FFD70055;
          color: #FFD700;
        }
        .vip-finance-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          padding: 24px 32px 24px 18px;
          min-width: 0;
        }
        .vip-finance-row {
          display: flex;
          flex-direction: row;
          gap: 36px;
          align-items: center;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .vip-finance-label {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 600;
          min-width: 48px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-finance-value {
          color: #fff;
          font-size: 1.12rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 12px;
          word-break: break-all;
        }
        .vip-finance-pnl, .vip-finance-roi {
          font-size: 1.7rem;
          font-weight: 900;
          margin-left: 12px;
          text-shadow: 0 0 12px #00ffae55;
        }
        .vip-finance-pnl.up, .vip-finance-roi.up { color: #00ffae; }
        .vip-finance-pnl.down, .vip-finance-roi.down { color: #cf1322; text-shadow: 0 0 12px #cf132255; }
        .vip-finance-meta {
          color: #b0c4e6;
          font-size: 1.01rem;
          font-weight: 500;
          margin-bottom: 6px;
          text-align: right;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-finance { padding: 0; }
          .vip-trade-cards-finance { gap: 12px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-finance { flex-direction: column; gap: 12px; }
          .vip-trade-card-finance { max-width: 100%; flex-basis: 100%; border-radius: 0; height: auto; min-height: 120px; }
          .vip-finance-left { min-width: 80px; max-width: 100px; padding: 0 6px; }
          .vip-finance-right { padding: 12px 6px 12px 6px; }
          .vip-finance-row { gap: 10px; }
        }
        .vip-trade-cards-luxury {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          margin-bottom: 48px;
          justify-content: flex-start;
        }
        .vip-trade-card-luxury {
          background: rgba(28,32,48,0.82);
          border-radius: 28px;
          box-shadow: 0 8px 48px 0 #0e0e1a99, 0 0 0 2.5px #ffd70055;
          border: 2.5px solid;
          border-image: linear-gradient(120deg, #ffd700 10%, #00ffe7 90%) 1;
          color: #fff;
          min-height: 240px;
          max-width: 420px;
          flex: 1 1 380px;
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s, border-image 0.5s;
          backdrop-filter: blur(18px) saturate(1.18);
          margin-bottom: 0;
        }
        .vip-trade-card-luxury:hover {
          box-shadow: 0 16px 64px 0 #ffd70066, 0 0 0 4px #ffd700cc;
          border-image: linear-gradient(90deg, #ffd700 10%, #00ffe7 90%) 1;
          transform: translateY(-6px) scale(1.025);
        }
        .vip-luxury-left {
          flex: 0 0 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #232B3E 60%, #ffd70022 100%);
          border-top-left-radius: 28px;
          border-bottom-left-radius: 28px;
          min-width: 100px;
          max-width: 140px;
          padding: 0 18px;
          gap: 18px;
        }
        .vip-luxury-symbol {
          font-size: 2.7rem;
          font-weight: 900;
          color: #ffd700;
          letter-spacing: 2px;
          text-shadow: 0 2px 18px #ffd70099;
          margin-bottom: 8px;
          margin-top: 8px;
        }
        .vip-luxury-tags {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .vip-luxury-type {
          font-size: 1.08rem;
          font-weight: 700;
          padding: 4px 24px;
          border-radius: 16px;
          border: 2px solid #00ffe7;
          color: #00ffe7;
          background: #00ffe722;
          box-shadow: 0 0 8px #00ffe733;
        }
        .vip-luxury-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #cf132222;
          box-shadow: 0 0 8px #cf132233;
        }
        .vip-luxury-status {
          font-size: 1.02rem;
          font-weight: 700;
          padding: 2px 16px;
          border-radius: 12px;
          background: #232b3e;
          border: 2px solid #ffd70055;
          color: #ffd700;
        }
        .vip-luxury-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 32px 36px 32px 24px;
          min-width: 0;
        }
        .vip-luxury-row {
          display: flex;
          flex-direction: row;
          gap: 36px;
          align-items: center;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .vip-luxury-pnl {
          font-size: 2.2rem;
          font-weight: 900;
          background: linear-gradient(90deg, #00ffe7 0%, #ffd700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          margin-right: 18px;
        }
        .vip-luxury-pnl.down {
          background: linear-gradient(90deg, #cf1322 0%, #ffd700 100%);
        }
        .vip-luxury-roi {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(90deg, #ffd700 0%, #00ffe7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        .vip-luxury-meta {
          color: #b0c4e6;
          font-size: 1.01rem;
          font-weight: 500;
          margin-bottom: 6px;
          text-align: right;
        }
        .vip-luxury-label {
          color: #b0c4e6;
          font-size: 1.02rem;
          font-weight: 600;
          min-width: 48px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-luxury-value {
          color: #fff;
          font-size: 1.12rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-right: 12px;
          word-break: break-all;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-luxury { max-width: 48%; flex-basis: 48%; }
          .vip-trade-cards-luxury { gap: 18px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-luxury { flex-direction: column; gap: 12px; }
          .vip-trade-card-luxury { max-width: 100%; flex-basis: 100%; border-radius: 18px; min-height: 120px; }
          .vip-luxury-left { min-width: 70px; max-width: 90px; padding: 0 6px; }
          .vip-luxury-right { padding: 12px 6px 12px 6px; }
          .vip-luxury-row { gap: 10px; }
        }
        .vip-trade-cards-global {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          margin-bottom: 40px;
          justify-content: flex-start;
        }
        .vip-trade-card-global {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 #e6e6e6, 0 0 0 1.5px #f0f0f0;
          color: #222;
          min-height: 220px;
          max-width: calc(33% - 22px);
          flex: 1 1 calc(33% - 22px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 32px 28px 18px 28px;
          position: relative;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .vip-trade-card-global:hover {
          box-shadow: 0 12px 48px 0 #b7e3ff44, 0 0 0 2px #1890ff33;
          transform: translateY(-2px) scale(1.01);
        }
        .vip-global-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }
        .vip-global-symbol {
          font-size: 2.1rem;
          font-weight: 900;
          color: #222;
          letter-spacing: 2px;
        }
        .vip-global-type {
          font-size: 1.01rem;
          font-weight: 700;
          padding: 2px 14px;
          border-radius: 10px;
          border: 1.5px solid #1890ff;
          color: #1890ff;
          background: #e6f7ff;
        }
        .vip-global-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #fff1f0;
        }
        .vip-global-status {
          font-size: 0.98rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 8px;
          background: #f6f6f6;
          border: 1.5px solid #e6e6e6;
          color: #bfa700;
        }
        .vip-global-main {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 18px;
          width: 100%;
        }
        .vip-global-pnl {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 6px;
          color: #52c41a;
        }
        .vip-global-pnl.down { color: #cf1322; }
        .vip-global-roi {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1890ff;
          margin-bottom: 8px;
        }
        .vip-global-meta {
          color: #888;
          font-size: 0.98rem;
          font-weight: 400;
          margin-top: 10px;
          text-align: left;
          width: 100%;
        }
        .vip-global-row {
          display: flex;
          flex-direction: row;
          gap: 24px;
          align-items: center;
          margin-bottom: 2px;
          width: 100%;
        }
        .vip-global-label {
          color: #888;
          font-size: 1.01rem;
          font-weight: 500;
          min-width: 48px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-global-value {
          color: #222;
          font-size: 1.08rem;
          font-weight: 700;
          margin-right: 12px;
          word-break: break-all;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-global { max-width: calc(50% - 18px); flex-basis: calc(50% - 18px); }
          .vip-trade-cards-global { gap: 18px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-global { flex-direction: column; gap: 12px; }
          .vip-trade-card-global { max-width: 100%; flex-basis: 100%; border-radius: 12px; min-height: 120px; }
        }
        .vip-trade-cards-blackgold {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          width: 100%;
          margin: 0;
          padding: 0;
          justify-content: flex-start;
          box-sizing: border-box;
        }
        .vip-trade-cards-blackgold.single-card {
          justify-content: center;
        }
        .vip-trade-cards-blackgold.single-card .vip-trade-card-blackgold {
          max-width: 700px;
          flex-basis: 700px;
          width: 100%;
        }
        .vip-trade-card-blackgold {
          max-width: calc(50% - 14px);
          flex: 1 1 calc(50% - 14px);
          min-width: 0;
          background: linear-gradient(120deg, #181818 80%, #232323 100%);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 #000a, 0 0 0 2px #FFD70055;
          border: 2.5px solid #FFD70088;
          color: #fff;
          min-height: 220px;
          max-width: none;
          flex: 1 1 0;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
          font-family: 'DIN Alternate', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
        }
        .vip-trade-card-blackgold:hover {
          box-shadow: 0 12px 48px 0 #FFD70044, 0 0 0 4px #FFD700cc;
          border-color: #FFD700;
          transform: translateY(-2px) scale(1.01);
        }
        .vip-blackgold-left {
          flex: 0 0 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #232323 60%, #FFD70022 100%);
          border-top-left-radius: 18px;
          border-bottom-left-radius: 18px;
          min-width: 100px;
          max-width: 140px;
          padding: 24px 18px;
          gap: 18px;
        }
        .vip-blackgold-symbol {
          font-size: 2.2rem;
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .vip-blackgold-tags {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        .vip-blackgold-type {
          font-size: 1.01rem;
          font-weight: 700;
          padding: 2px 14px;
          border-radius: 10px;
          border: 1.5px solid #FFD700;
          color: #FFD700;
          background: #232323;
        }
        .vip-blackgold-type.sell {
          border-color: #cf1322;
          color: #cf1322;
          background: #232323;
        }
        .vip-blackgold-status {
          font-size: 0.98rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 8px;
          background: #232323;
          border: 1.5px solid #FFD70055;
          color: #FFD700;
        }
        .vip-blackgold-right {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          padding: 32px 36px 32px 24px;
          min-width: 0;
        }
        .vip-blackgold-main {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 10px;
        }
        .vip-blackgold-pnl {
          font-size: 1.5rem;
          font-weight: 900;
          margin-right: 0;
          color: #cf1322;
        }
        .vip-blackgold-pnl.up {
          color: #00c97b;
        }
        .vip-blackgold-pnl.down {
          color: #cf1322;
        }
        .vip-blackgold-roi {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFD700;
        }
        .vip-blackgold-roi-value.up {
          color: #00c97b;
          font-weight: 900;
        }
        .vip-blackgold-roi-value.down {
          color: #cf1322;
          font-weight: 900;
        }
        .vip-blackgold-roi.up {
          color: #00c97b;
        }
        .vip-blackgold-roi.down {
          color: #cf1322;
        }
        .vip-blackgold-row {
          display: flex;
          flex-direction: row;
          gap: 24px;
          align-items: center;
          margin-bottom: 2px;
          width: 100%;
        }
        .vip-blackgold-label {
          color: #b0b0b0;
          font-size: 1.01rem;
          font-weight: 500;
          min-width: 48px;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vip-blackgold-value {
          color: #fff;
          font-size: 1.08rem;
          font-weight: 700;
          margin-right: 12px;
          word-break: break-all;
        }
        .vip-blackgold-meta {
          color: #888;
          font-size: 0.98rem;
          font-weight: 400;
          margin-top: 10px;
          text-align: left;
          width: 100%;
        }
        @media (max-width: 1200px) {
          .vip-trade-card-blackgold { max-width: 100%; flex-basis: 100%; }
          .vip-trade-cards-blackgold { gap: 18px; }
        }
        @media (max-width: 900px) {
          .vip-trade-cards-blackgold { flex-direction: column; gap: 12px; }
          .vip-trade-card-blackgold { max-width: 100%; flex-basis: 100%; border-radius: 12px; min-height: 120px; }
          .vip-blackgold-left { min-width: 70px; max-width: 90px; padding: 18px 6px; }
          .vip-blackgold-right { padding: 12px 6px 12px 6px; }
          .vip-blackgold-main { gap: 12px; }
        }
        .vip-blackgold-main-row1 {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          gap: 24px;
          justify-content: center;
          width: 100%;
          margin-bottom: 2px;
        }
        .vip-blackgold-pnl {
          font-size: 1.5rem;
          font-weight: 900;
          margin-right: 0;
        }
        .vip-blackgold-roi {
          font-size: 1.1rem;
          font-weight: 800;
        }
        .vip-blackgold-main-row2 {
          display: flex;
          flex-direction: row;
          justify-content: center;
          width: 100%;
          margin-bottom: 2px;
        }
        .vip-blackgold-entry-time {
          color: #b0b0b0;
          font-size: 0.98rem;
          font-weight: 400;
          margin-top: -2px;
          margin-bottom: 2px;
          text-align: center;
          width: 100%;
        }
        .vip-blackgold-main-row3, .vip-blackgold-main-row4 {
          display: flex;
          flex-direction: row;
          gap: 18px;
          justify-content: center;
          width: 100%;
          margin-bottom: 2px;
        }
        .vip-blackgold-field {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
          max-width: 120px;
        }
        .vip-blackgold-label {
          color: #888;
          font-size: 0.95rem;
          font-weight: 400;
          margin-bottom: 1px;
        }
        .vip-blackgold-value {
          color: #fff;
          font-size: 1.02rem;
          font-weight: 700;
          word-break: break-all;
          text-align: center;
        }
        @media (max-width: 600px) {
          .vip-trade-card-blackgold {
            flex-direction: column !important;
            min-width: 0 !important;
            max-width: 100% !important;
            padding: 14px 8px !important;
            border-radius: 12px !important;
            margin-bottom: 16px;
          }
          .vip-blackgold-symbol-row, .vip-blackgold-pnl-row, .vip-blackgold-meta-row, .vip-blackgold-btn-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
          }
          .vip-blackgold-symbol {
            font-size: 1.2rem;
            font-weight: 900;
            color: #FFD700;
          }
          .vip-blackgold-pnl, .vip-blackgold-roi {
            font-size: 1.1rem;
            font-weight: 700;
          }
          .vip-blackgold-meta-row span {
            font-size: 0.98rem;
            color: #b0c4e6;
          }
          .vip-blackgold-btn-row button {
            flex: 1 1 48%;
            margin: 0 2px;
            font-size: 1rem;
            padding: 8px 0;
            border-radius: 8px;
          }
        }
        @media (max-width: 600px) {
          .vip-trade-cards-blackgold { display: block !important; }
          .vip-trade-card-blackgold { display: none !important; }
          .vip-mobile-card {
            width: 100vw;
            margin: 0;
            padding: 18px 0 12px 0;
            background: #232B3E;
            border-bottom: 1.5px solid #222a3a;
            box-sizing: border-box;
          }
          .vip-mobile-header {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.15rem;
            font-weight: 900;
            color: #FFD700;
            margin-bottom: 8px;
            padding: 0 16px;
          }
          .vip-mobile-main {
            display: flex;
            justify-content: space-between;
            padding: 0 16px;
            margin-bottom: 6px;
          }
          .vip-mobile-pnl, .vip-mobile-roi {
            font-size: 1.18rem;
            font-weight: 900;
          }
          .vip-mobile-pnl.up span, .vip-mobile-roi.up span { color: #00ffae; }
          .vip-mobile-pnl.down span, .vip-mobile-roi.down span { color: #cf1322; }
          .vip-mobile-meta {
            font-size: 0.98rem;
            color: #b0c4e6;
            padding: 0 16px;
            margin-bottom: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px 16px;
          }
          .vip-mobile-btns {
            display: flex;
            gap: 8px;
            padding: 0 16px;
          }
          .vip-mobile-btns button {
            flex: 1 1 0;
            font-size: 1.08rem;
            padding: 10px 0;
            border-radius: 8px;
            font-weight: 700;
          }
        }
     
        /* 移动端表格样式 */
        .trade-card-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .trade-card {
          background: #232B3E;
          border-radius: 16px;
          box-shadow: 0 2px 12px #FFD70022;
          border: 1.5px solid #FFD70033;
          padding: 16px 14px 10px 14px;
          color: #fff;
          font-size: 1.08rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .trade-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .trade-symbol {
          font-weight: 700;
          color: #FFD700;
        }
        .trade-type {
          padding: 2px 10px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .trade-type.buy {
          background: #00ffae22;
          color: #00ffae;
          border: 1px solid #00ffae;
        }
        .trade-type.sell {
          background: #cf132222;
          color: #cf1322;
          border: 1px solid #cf1322;
        }
        .trade-date {
          font-size: 0.95rem;
          color: #b0c4e6;
          margin-left: auto;
        }
        .trade-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .trade-info-group {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 0;
        }
        .trade-info-group div {
          flex: 1 1 28%;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .trade-info-group .label {
          color: #b0c4e6;
          font-size: 0.95rem;
          min-width: 60px;
        }
        .trade-info-group b {
          color: #fff;
          font-weight: 700;
        }
        .trade-profit-table.profit-positive {
          color: #00ffae;
          font-weight: 900;
        }
        .trade-profit-table.profit-negative {
          color: #cf1322;
          font-weight: 900;
        }
        .trade-profit-table.profit-neutral {
          color: #ffffff;
          font-weight: 600;
        }

        .vip-trade-card-new {
          display: flex;
          align-items: stretch;
          background: linear-gradient(120deg, #232B3E 60%, #181c2a 100%);
          border-radius: 22px;
          box-shadow: 0 8px 32px #FFD70033, 0 0 0 2px #FFD70055;
          border: 2px solid #FFD70088;
          color: #fff;
          margin-bottom: 32px;
          overflow: hidden;
        }
        .vip-trade-card-left {
          background: #FFD700;
          color: #232B3E;
          min-width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.5rem;
          padding: 24px 12px;
        }
        .vip-symbol { font-size: 2rem; font-weight: 900; margin-bottom: 8px; }
        .vip-type { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .vip-status { font-size: 1.05rem; font-weight: 700; }
        .vip-trade-card-main {
          flex: 1;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }
        .vip-pnl-row {
          font-size: 1.3rem;
          font-weight: 900;
          color: #00ffae;
          margin-bottom: 8px;
        }
        .vip-pnl.up { color: #00ffae; }
        .vip-pnl.down { color: #cf1322; }
        .vip-roi { color: #FFD700; margin-left: 24px; }
        .vip-roi.up { color: #FFD700; }
        .vip-roi.down { color: #cf1322; }
        .vip-meta-row { color: #b0c4e6; font-size: 1.05rem; margin-bottom: 2px; display: flex; gap: 32px; flex-wrap: wrap; }
        .vip-trade-card-btns {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 8px;
          padding: 24px 12px;
        }
        .vip-trade-card-btns button {
          font-size: 1.08rem;
          font-weight: 700;
          border-radius: 8px;
          margin-bottom: 4px;
        }
        @media (max-width: 900px) {
          .vip-trade-card-new { flex-direction: column; }
          .vip-trade-card-left, .vip-trade-card-btns { flex-direction: row; justify-content: space-between; padding: 12px 8px; }
          .vip-trade-card-main { padding: 12px 8px; }
          .vip-meta-row { gap: 12px; }
        }
        
        /* 会员收益排名表格样式 */
        .rank-row:hover {
          background: linear-gradient(90deg,rgba(255,215,0,0.13) 0%,rgba(255,251,230,0.08) 100%) !important;
          box-shadow: 0 2px 12px rgba(255,215,0,0.2);
          transition: all 0.2s;
        }

        /* 响应式媒体查询，确保PC端只显示表格，移动端只显示卡片 */
        @media (max-width: 700px) {
          .member-rank-table-pc {
            display: none !important;
          }
          .member-rank-mobile-list {
            display: block !important;
          }
        }

        @media (min-width: 701px) {
          .member-rank-table-pc {
            display: block !important;
          }
          .member-rank-mobile-list {
            display: none !important;
          }
        }

        /* 会员协议部分样式 */
        .vip-agreement-section {
          margin: 40px 0;
          padding: 0 20px;
        }
        
        .agreement-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .agreement-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 12px;
          background: linear-gradient(120deg, #FFD700 0%, #FFED4E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .agreement-desc {
          font-size: 1.1rem;
          color: #b0c4e6;
          line-height: 1.6;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .agreement-table-section {
          margin-bottom: 32px;
        }
        
        .table-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .table-wrapper {
          overflow-x: auto;
          border-radius: 16px;
          background: rgba(35, 43, 62, 0.8);
          border: 1.5px solid #FFD70033;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.15);
        }
        
        .vip-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        
        .vip-table th {
          background: linear-gradient(90deg, #2A3450 0%, #1E263D 100%);
          color: #FFD700;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 14px 12px;
          text-align: center;
          border-bottom: 2px solid #FFD70033;
        }
        
        .vip-table td {
          padding: 12px;
          color: #fff;
          font-size: 1.05rem;
          text-align: center;
          border-bottom: 1px solid #FFD70022;
        }
        
        .vip-table tr:last-child td {
          border-bottom: none;
        }
        
        .highlight {
          color: #00ffae;
          font-weight: 700;
        }
        
        .member-level {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 0.95rem;
        }
        
        /* 移动端样式 */
        .agreement-mobile-cards {
          display: none;
        }
        
        .mobile-section {
          margin-bottom: 32px;
        }
        
        .mobile-section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 16px;
          padding: 0 16px;
        }
        
        .mobile-card-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 16px;
        }
        
        .mobile-card {
          background: linear-gradient(135deg, #232B3E 0%, #1A2235 100%);
          border-radius: 16px;
          border: 1.5px solid #FFD70033;
          padding: 16px;
          color: #fff;
        }
        
        .mobile-badge-row {
          margin-bottom: 12px;
        }
        
        .mobile-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
        }
        
        .mobile-badge.vip {
          background: #00ffae22;
          color: #00ffae;
          border: 1px solid #00ffae;
        }
        
        .mobile-badge.gold {
          background: #FFD70022;
          color: #FFD700;
          border: 1px solid #FFD700;
        }
        
        .mobile-badge.diamond {
          background: #98D8C822;
          color: #98D8C8;
          border: 1px solid #98D8C8;
        }
        
        .mobile-badge.blackgold {
          background: #CFB53B22;
          color: #CFB53B;
          border: 1px solid #CFB53B;
        }
        
        .mobile-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 1rem;
        }
        
        .mobile-info-row:last-child {
          margin-bottom: 0;
        }
        
        .mobile-info-label {
          color: #b0c4e6;
        }
        
        .mobile-info-value {
          color: #fff;
          font-weight: 700;
        }
        
        .agreement-footer {
          text-align: center;
          margin-top: 32px;
        }
        
        .view-agreement-btn {
          background: linear-gradient(120deg, #FFD700 0%, #FFED4E 100%);
          color: #232B3E;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 12px 32px;
          border-radius: 24px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          margin: 0 auto;
          display: inline-block;
        }
        
        .view-agreement-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(255, 215, 0, 0.4);
        }
        
        /* 响应式设计 */
        @media (max-width: 700px) {
          .agreement-table-pc {
            display: none !important;
          }
          
          .agreement-mobile-cards {
            display: block !important;
          }
          
          .agreement-title {
            font-size: 1.5rem;
          }
          
          .agreement-desc {
            font-size: 1rem;
          }
        }
        
        @media (min-width: 701px) {
          .agreement-table-pc {
            display: block !important;
          }
          
          .agreement-mobile-cards {
            display: none !important;
          }
        }

        /* 排行榜弹窗样式 */
        .rankings-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .rankings-modal {
          background: linear-gradient(135deg, #232B3E 0%, #1A2235 100%);
          border-radius: 18px;
          border: 3px solid #FFD700;
          width: 95vw;
          height: 75vh;
          max-width: 1400px;
          max-height: 700px;
          overflow: hidden;
          box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .rankings-modal-header {
          padding: 24px 20px 20px 20px;
          border-bottom: 1.5px solid rgba(255, 215, 0, 0.13);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          background: linear-gradient(90deg, #232e4a 0%, #232B3E 100%);
        }

        .rankings-modal-title {
          color: #FFD700;
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0;
          text-shadow: 0 2px 8px rgba(24, 31, 42, 0.53);
        }

        .rankings-modal-close {
          background: none;
          border: none;
          color: #FFD700;
          font-size: 1.8rem;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: all 0.3s;
          line-height: 1;
          font-weight: 900;
        }

        .rankings-modal-close:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: scale(1.1);
        }

        .rankings-modal-content {
          padding: 24px 20px 20px 20px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }

        .rankings-modal-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 18px;
          overflow: hidden;
          background: #181F2A;
          box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
        }

        .rankings-modal-table th {
          background: #232e4a;
          color: #FFD700;
          padding: 12px 10px;
          text-align: center;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
          font-weight: 900;
          font-size: 1.1rem;
          letter-spacing: 1px;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .rankings-modal-table td {
          padding: 10px 10px;
          text-align: center;
          border-bottom: 1.5px solid rgba(255, 215, 0, 0.13);
          color: #fff;
          font-size: 1rem;
          background: linear-gradient(90deg, #232B3E 80%, #232e4a 100%);
        }

        .rankings-modal-table tr:hover {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.13) 0%, rgba(255, 251, 230, 0.08) 100%) !important;
          box-shadow: 0 2px 12px rgba(255, 215, 0, 0.2);
          transition: all 0.2s;
        }

        .rankings-modal-table th:first-child,
        .rankings-modal-table td:first-child {
          text-align: left !important;
          padding-left: 24px !important;
          width: 80px;
        }

        .rankings-modal-table th:nth-child(2),
        .rankings-modal-table td:nth-child(2) {
          text-align: left !important;
          width: 80px;
        }

        .rankings-modal-table th:nth-child(3),
        .rankings-modal-table td:nth-child(3) {
          text-align: left !important;
        }

        .rankings-modal-table th:nth-child(4),
        .rankings-modal-table td:nth-child(4) {
          text-align: left !important;
        }

        .rankings-modal-table th:nth-child(5),
        .rankings-modal-table td:nth-child(5) {
          text-align: right !important;
          padding-right: 24px !important;
        }

        .rankings-modal-table th:nth-child(6),
        .rankings-modal-table td:nth-child(6) {
          text-align: right !important;
          padding-right: 24px !important;
        }

        @media (max-width: 700px) {
          .rankings-modal {
            width: 98vw;
            height: 65vh;
            max-width: none;
            max-height: 600px;
            border-radius: 14px;
          }
          
          .rankings-modal-header {
            padding: 24px 20px 20px 20px;
          }
          
          .rankings-modal-title {
            font-size: 1.8rem;
          }
          
          .rankings-modal-close {
            font-size: 2rem;
          }
          
          .rankings-modal-content {
            padding: 24px 20px 20px 20px;
          }
          
          .rankings-modal-table th {
            font-size: 1rem;
            padding: 12px 8px;
          }
          
          .rankings-modal-table td {
            font-size: 0.95rem;
            padding: 10px 8px;
          }
          
          .rankings-modal-table th:first-child,
          .rankings-modal-table td:first-child {
            width: 60px;
            padding-left: 16px !important;
          }

          .rankings-modal-table th:nth-child(2),
          .rankings-modal-table td:nth-child(2) {
            width: 60px;
          }

          .rankings-modal-table th:nth-child(5),
          .rankings-modal-table td:nth-child(5),
          .rankings-modal-table th:nth-child(6),
          .rankings-modal-table td:nth-child(6) {
            padding-right: 16px !important;
          }
        }

        /* 排名颜色样式 */
        .rank-gold {
          color: #FFD700;
          font-weight: 700;
        }
        
        .rank-silver {
          color: #C0C0C0;
          font-weight: 700;
        }
        
        .rank-bronze {
          color: #CD7F32;
          font-weight: 700;
        }

        /* 会员等级徽章样式 */
        .member-level-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .member-level-badge.level-VIP {
          background: #00ffae22;
          color: #00ffae;
          border: 1px solid #00ffae;
        }
        
        .member-level-badge.level-Gold {
          background: #FFD70022;
          color: #FFD700;
          border: 1px solid #FFD700;
        }
        
        .member-level-badge.level-Diamond {
          background: #98D8C822;
          color: #98D8C8;
          border: 1px solid #98D8C8;
        }
        
        .member-level-badge.level-BlackGold {
          background: #CFB53B22;
          color: #CFB53B;
          border: 1px solid #CFB53B;
        }
</style>