import BasicLayout from '../../layouts/BasicLayout.vue';
import Login from '../../views/login/index.vue';
import Home from '../../views/web/HomeView.vue';

export default [
  {
    path: '/',
    component: Home,
  },
   {
    path: '/index',
    component: Home,
  },
  {
    path: '/vip',
    component: () => import('../../views/web/VipView.vue'),
    meta: { title: 'Member Center', requireAuth: false },
  },
  {
    path: '/vipdashboard',
    component: () => import('../../views/web/VipDashboardView.vue'),
    meta: { title: 'Member Center', requireAuth: false },
  },
  {
    path: '/Register',
    component: () => import('../../views/web/RegisterView.vue'),
    meta: { title: 'Registration page', requireAuth: false },
  },
  {
    path: '/trade-upload',
    component: () => import('../../views/web/TradeUploadView.vue'),
    meta: { title: 'Upload Trade Record', requireAuth: false },
  },
  {
    path: '/settings',
    component: () => import('../../views/web/SettingsView.vue'),
    meta: { title: 'Manage your account preferences', requireAuth: false },
  },
  {
    path: '/Leaderboard',
    component: () => import('../../views/web/LeaderboardView.vue'),
    meta: { title: 'Trader Leaderboard', requireAuth: false },
  },
  {
    path: '/AITools',
    component: () => import('../../views/web/AIToolsView.vue'),
    meta: { title: 'Trading Quiz', requireAuth: false },
  },
  {
    path: '/ai-history',
    redirect: '/AITools',
  },
  {
    path: '/adminmain',
    redirect: '/system/user'
  },
  {
    path: '/userlogin',
    component: () => import('../../views/web/LoginView.vue'),
    meta: { title: 'Login Page', requireAuth: false },
  },
  {
    path: '/login',
    component: Login,
    meta: { title: 'Admin Login', requireAuth: false },
  },
  {
    path: '/webhome',
    component: Home,
    meta: { title: '网站首页', requireAuth: false },
  },
  {
    path: '/system',
    component: BasicLayout,
    meta: { title: '系统管理' },
    redirect: '/system/userStatistics',
    children: [
      {
        path: '/system/user',
        component: () => import('../../views/system/user/index.vue'),
        meta: { title: '用户管理', requireAuth: true },
      },
      {
        path: '/system/userStatistics',
        component: () => import('../../views/system/userStatistics/index.vue'),
        meta: { title: '用户数据统计', requireAuth: true , closable: false},
      },
      {
        path: '/system/aiStockPicker',
        component: () => import('../../views/system/aiStockPicker/index.vue'),
        meta: { title: 'AI股票选股', requireAuth: true },
      },
      {
        path: '/system/announcement',
        component: () => import('../../views/system/announcement/index.vue'),
        meta: { title: '公告管理', requireAuth: true },
      },
      {
        path: '/system/contactRecord',
        component: () => import('../../views/system/contactRecord/index.vue'),
        meta: { title: '联系记录管理', requireAuth: true },
      },
      {
        path: '/system/membershipLevel',
        component: () => import('../../views/system/membershipLevel/index.vue'),
        meta: { title: '会员等级管理', requireAuth: true },
      },
      {
        path: '/system/trade',
        component: () => import('../../views/system/trade/index.vue'),
        meta: { title: '交易管理', requireAuth: true },
      },
      {
        path: '/system/vipTrade',
        component: () => import('../../views/system/vipTrade/index.vue'),
        meta: { title: 'VIP交易管理', requireAuth: true },
      },
      {
        path: '/system/traderProfiles',
        component: () => import('../../views/system/traderProfiles/index.vue'),
        meta: { title: '交易者档案管理', requireAuth: true },
      },
      {
        path: '/system/trades1',
        component: () => import('../../views/system/trades1/index.vue'),
        meta: { title: '交易员交易记录', requireAuth: true },
      },
      {
        path: '/system/video',
        component: () => import('../../views/system/video/index.vue'),
        meta: { title: '视频管理', requireAuth: true },
      },
      {
        path: '/system/tradeMarket',
        component: () => import('../../views/system/tradeMarket/index.vue'),
        meta: { title: '交易市场管理', requireAuth: true },
      },
      {
        path: '/system/documents',
        component: () => import('../../views/system/documents/index.vue'),
        meta: { title: '文档管理', requireAuth: true },
      },
      {
        path: '/system/tradingStrategies',
        component: () => import('../../views/system/tradingStrategies/index.vue'),
        meta: { title: '交易策略管理', requireAuth: true },
      },
      {
        path: '/system/vipAnnouncement',
        component: () => import('../../views/system/vipAnnouncement/index.vue'),
        meta: { title: 'VIP公告管理', requireAuth: true },
      },
      {
        path: '/system/leaderboardTraders',
        component: () => import('../../views/system/leaderboardTraders/index.vue'),
        meta: { title: '交易员排行榜管理', requireAuth: true },
      },
      {
        path: '/system/invitationCode',
        component: () => import('../../views/system/invitationCode/index.vue'),
        meta: { title: '邀请码管理', requireAuth: true },
      },
      {
        path: '/system/whatsappAgent',
        component: () => import('../../views/system/whatsappAgent/index.vue'),
        meta: { title: 'WhatsApp代理管理', requireAuth: true },
      },
      {
        path: '/system/usersView',
        component: () => import('../../views/usersView/index.vue'),
        meta: { title: '用户获利统计', requireAuth: true },
      },
      {
        path: '/system/visitMap',
        component: () => import('../../views/system/visitMap/index.vue'),
        meta: { title: '访问地图', requireAuth: true },
      },
      {
        path: '/system/questionBank',
        component: () => import('../../views/system/questionBank/index.vue'),
        meta: { title: '题库管理', requireAuth: true }
      },
      {
        path: '/system/membershipPointsRules',
        component: () => import('../../views/system/membershipPointsRules/index.vue'),
        meta: { title: '积分规则管理', requireAuth: true }
      },
      {
        path: '/system/partnerOrganizations',
        component: () => import('../../views/system/partnerOrganizations/index.vue'),
        meta: { title: '合作单位管理', requireAuth: true }
      },
      {
        path: '/system/paymentRecords',
        component: () => import('../../views/system/paymentRecords/index.vue'),
        meta: { title: '支付记录管理', requireAuth: true }
      }
    ]
  },
  {
    path: '/videos',
    component: () => import('../../views/web/VideoView.vue'),
    meta: { title: 'Video Tutorials', requireAuth: false },
  },
  {
    path: '/documents',
    component: () => import('../../views/web/DocumentView.vue'),
    meta: { title: 'Documents', requireAuth: false },
  }
];
