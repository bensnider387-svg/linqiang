import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "@layui/unplugin-vue-components/vite";
import { LayuiVueResolver } from '@layui/unplugin-vue-components/resolvers'
import { resolve } from "path";
import { unlinkSync, existsSync } from "fs";

const excludeComponents = ['LightIcon','DarkIcon']

// 插件：在构建后删除 _redirects 和 _headers 文件（Cloudflare Workers 不需要）
const removeCloudflareFiles = () => {
  return {
    name: 'remove-cloudflare-files',
    writeBundle() {
      // 使用 writeBundle 钩子，在文件写入后立即删除
      const distDir = resolve(__dirname, './dist');
      const filesToRemove = ['_redirects', '_headers'];
      filesToRemove.forEach(file => {
        const filePath = resolve(distDir, file);
        if (existsSync(filePath)) {
          try {
            unlinkSync(filePath);
            console.log(`✅ Removed ${file} from dist directory`);
          } catch (error) {
            console.error(`❌ Failed to remove ${file}:`, error);
          }
        }
      });
    },
    closeBundle() {
      // 双重保险：在 closeBundle 时再次检查
      const distDir = resolve(__dirname, './dist');
      const filesToRemove = ['_redirects', '_headers'];
      filesToRemove.forEach(file => {
        const filePath = resolve(distDir, file);
        if (existsSync(filePath)) {
          try {
            unlinkSync(filePath);
            console.log(`✅ Removed ${file} from dist directory (closeBundle)`);
          } catch (error) {
            console.error(`❌ Failed to remove ${file}:`, error);
          }
        }
      });
    }
  };
};

const defaultApiUrl = "https://houduan-api.onrender.com";
const defaultTraderUuid = "c5e01236-d681-4343-8386-f9e17748f81f";
const defaultGoogleClientId =
  '810723432233-mpgi15h8fvupa2ifqtlmpv5eiih7bvgq.apps.googleusercontent.com';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || defaultApiUrl;
  const traderUuid = env.VITE_Web_Trader_UUID || defaultTraderUuid;
  const googleClientId = env.VITE_GOOGLE_CLIENT_ID || defaultGoogleClientId;

  return {
  publicDir: 'public',
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
    "import.meta.env.VITE_Web_Trader_UUID": JSON.stringify(traderUuid),
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(googleClientId),
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      }
    ]
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@layui/layui-vue', 'bootstrap'],
          charts: ['echarts', 'chart.js']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    AutoImport({
      resolvers: [
        LayuiVueResolver(),
      ],
    }),
    Components({
      resolvers: [
        LayuiVueResolver({
          resolveIcons: true,
          exclude: excludeComponents
        }),
      ],
    }),
    vue(),
    removeCloudflareFiles(), // 添加插件以删除 Cloudflare 不需要的文件
  ],
};
});