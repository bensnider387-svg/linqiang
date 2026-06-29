// 引入Bootstrap样式
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue';
import Router from './router';
import Store from './store';
import App from './App.vue';
import { permission } from './directives/permission';
// mockjs 会劫持 XHR，本地联调真实 API 时需关闭
if (import.meta.env.VITE_USE_MOCK === 'true') {
  import('./mockjs');
}
import { setupVisitIdentify } from './utils/visitIdentify';



// 创建Vue应用实例
const app = createApp(App);

// 使用插件和配置
app.use(Store);
app.use(Router);
app.directive('permission', permission);
setupVisitIdentify(Router);

// 监听页面卸载事件，确保在关闭浏览器标签页时清除sessionStorage中的用户数据
window.addEventListener('beforeunload', () => {
  // 清除用户相关的sessionStorage数据
  const sessionKeys = ['user-token', 'user-userInfo', 'user-permissions', 'user-menus'];
  sessionKeys.forEach(key => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
    }
  });
});

// 挂载应用
app.mount('#app');
