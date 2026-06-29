import { menu, permission, getCurrentUser } from "../api/module/user";
import { defineStore } from 'pinia';

// 定义用户信息接口
export interface UserInfo {
  id?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// 定义权限接口
export interface Permission {
  id?: string;
  name?: string;
  code?: string;
  type?: string;
  [key: string]: any;
}

// 定义菜单接口
export interface Menu {
  id?: string;
  name?: string;
  path?: string;
  component?: string;
  icon?: string;
  children?: Menu[];
  [key: string]: any;
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: '',
    userInfo: {} as UserInfo,
    permissions: [] as Permission[],
    menus: [] as Menu[],
    indexData:{} as any,
    VipData:{} as any,
    vipList:[] as any,
  }),
  getters: {
    // 判断是否有某权限
    hasPermission: (state) => (permissionCode: string) => {
      return state.permissions.some(perm => perm.code === permissionCode);
    },
    // 获取用户ID
    userId: (state) => state.userInfo.id || '',
    // 获取用户名
    username: (state) => state.userInfo.username || '',
    // 获取用户昵称
    nickname: (state) => state.userInfo.nickname || state.userInfo.username || '',
    // 获取用户头像
    avatar: (state) => state.userInfo.avatar || '',
  },
  actions: {
    // 加载用户菜单
    async loadMenus(){
 
          this.menus = [
  
        {
          id: '/system',
          icon: "layui-icon-set",
          title: '系统管理',
          children: [
            {       
              id: '/system/user',       
              icon: "layui-icon-user",       
              title: '会员管理',     
            },
            {
              id: '/system/traderProfiles',
              icon: "layui-icon-user",
              title: '交易者档案管理',
            },
            {
              id: '/system/video',
              icon: "layui-icon-video",
              title: '视频管理',
            },
            {
              id: '/system/documents',
              icon: "layui-icon-file",
              title: '文档管理',
            },
            {
              id: '/system/aiStockPicker',
              icon: "layui-icon-android",
              title: 'AI股票推荐记录',
            },
            {
              id: '/system/announcement',
              icon: "layui-icon-notice",
              title: '首页弹窗管理',
            },
            {
              id: '/system/membershipLevel',
              icon: "layui-icon-diamond",
              title: '会员等级管理',
            },
            {
              id: '/system/trade',
              icon: "layui-icon-rmb",
              title: '会员交易记录',
            },
            {
              id: '/system/paymentRecords',
              icon: "layui-icon-dollar",
              title: '支付记录管理',
            },     
            {
              id: '/system/membershipPointsRules',
              icon: "layui-icon-diamond",
              title: '积分规则管理',
            },     
            {
              id: '/system/trades1',
              icon: "layui-icon-chart",
              title: '交易员交易记录',
            },      
            {
              id: '/system/tradeMarket',
              icon: "layui-icon-dollar",
              title: '交易市场管理',
            },      
            {
              id: '/system/tradingStrategies',
              icon: "layui-icon-star",
              title: '交易策略管理',
            },  
                {
              id: '/system/vipAnnouncement',
              icon: "layui-icon-notice",
              title: 'VIP交易策略',
            },  
            {
              id: '/system/vipTrade',
              icon: "layui-icon-notice",
              title: 'VIP交易管理',
            },
            {       
              id: '/system/leaderboardTraders',       
              icon: "layui-icon-cols",       
              title: '交易员排行榜管理',     
            },     
            {       
              id: '/system/invitationCode',       
              icon: "layui-icon-code-circle",       
              title: '邀请码管理',     
            },     
            {       
              id: '/system/whatsappAgent',       
              icon: "layui-icon-code-circle",       
              title: 'WhatsApp代理管理',     
            },     
            {       
              id: '/system/questionBank',       
              icon: "layui-icon-list",       
              title: '题库管理',     
            },
            {       
              id: '/system/partnerOrganizations',       
              icon: "layui-icon-link",       
              title: '合作单位管理',     
            }             
          ] 
          },{
          id: '/system',
          icon: "layui-icon-chart",
          title: '数据统计',
          children: [  
            {       
              id: '/system/userStatistics',       
              icon: "layui-icon-username",       
              title: '用户数据统计',     
            },
            {       
              id: '/system/usersView',       
              icon: "layui-icon-username",       
              title: '用户获利统计',     
            },
            {       
              id: '/system/visitMap',       
              icon: "layui-icon-location",       
              title: '访问地图',     
            }
          ]}

      ];
       
    },
    
    // 加载用户权限
    async loadPermissions(){
    
          this.permissions = ['sys:user:add', 'sys:user:edit', 'sys:user:delete', 'sys:user:import', 'sys:user:export'];
       
    },
    
    // 加载用户信息
    async loadUserInfo() {
      try {
        const { data, code } = await getCurrentUser();
        if(code == 200) {
          this.userInfo = data;
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      }
    },
    
    // 设置用户token
    setToken(token: string) {
      this.token = token;
    },
    
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
     // 设置用户信息
    setindexData(indexData:any) {
      this.indexData = indexData;
    },
     // 设置用户信息
    setVipData(indexData:any) {
      this.VipData = indexData;
    },
    
    // 清空用户状态
    clearUserState() {
      this.token = '';
      this.userInfo = {};
      this.permissions = [];
      this.menus = [];
    },
    
    // 初始化用户信息
    async initUserInfo() {
      await Promise.all([
       
        this.loadMenus(),
        this.loadPermissions()
      ]);
    }
  },
  
  // 持久化配置
  persist: {
    strategies: [
      {
        storage: localStorage,
        paths: ['indexData','VipData'],
      },
      {
        storage: sessionStorage,
        paths: ['token', 'userInfo', 'permissions', 'menus']
      }
    ],
    
  }
})