import { createRouter, createWebHashHistory, type RouteLocationNormalized, type NavigationGuardNext, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './module/base-routes';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useUserStore } from '../store';
import store from '../store';

// 配置进度条
NProgress.configure({ showSpinner: false });

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Router 前置拦截
 * 
 * 1.验证 token 存在, 并且有效, 否则 -> login.vue
 * 2.验证 permission 存在, 否则 -> 403.vue
 * 3.验证 router 是否存在, 否则 -> 404.vue
 */
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start();

  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  const userStore = useUserStore(store);
  const token = userStore.token;

  // 如果需要认证
  if (to.meta.requireAuth) {
    // 检查是否有token
    if (!token) {
      // 没有token，重定向到登录页
      next({
        path: '/userlogin',
        query: { redirect: to.fullPath }, // 保存当前路由，以便登录后跳转回来
      });
      return;
    }

    try {
      // 检查用户信息是否已加载
      if (!userStore.userInfo.id) {
        // 未加载用户信息，尝试加载
        await userStore.initUserInfo();
      }

      // 检查路由权限（如果有设置）
      if (to.meta.permission) {
        const hasPermission = userStore.hasPermission(to.meta.permission as string);
        if (!hasPermission) {
          // 没有权限，重定向到403页面
          next('/error/403');
          return;
        }
      }

      // 验证通过，继续访问
      next();
    } catch (error) {
      console.error('路由拦截验证失败:', error);
      // 验证失败，清空用户状态并跳转到登录页
      userStore.clearUserState();
      next('/userlogin');
    }
  } else if (to.path === '/userlogin') {
    // 如果已经登录，直接跳转到VIP页面
    if (token) {
      next('/vip');
      return;
    }
    next();
  } else if (to.matched.length === 0) {
    // 路由不存在，重定向到404页面
    next('/error/404');
  } else {
    // 其他情况直接通过
    next();
  }
});

// 路由跳转后处理
router.afterEach(() => {
  NProgress.done();
});

export default router;