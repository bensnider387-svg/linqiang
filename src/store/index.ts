import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 创建pinia实例
const store = createPinia();
store.use(piniaPluginPersistedstate);

// 导出store实例和各个模块
export default store;

export * from './user';
export * from './app';