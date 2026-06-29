# 前端 Cloudflare 部署指南

仓库：https://github.com/maximallenklle-bit/Allen-Klee

- 正式域名：`https://allenklee.com`
- 后端 API：`https://houduan-api.onrender.com`

## 命令行部署

```bash
cd web--wangye/stock-web-2025-12-29-new
npm install
npx wrangler login
npm run deploy
```

## Cloudflare Dashboard 部署（Git 自动构建）

1. 打开 https://dash.cloudflare.com → **Workers & Pages**
2. **Create** → **Worker** → **Connect to Git**
3. 选择 **maximallenklle-bit/Allen-Klee**
4. 构建设置：
   - Build command: `npm install && npm run build`
   - Deploy command: `npx wrangler deploy`
5. 环境变量已在 `wrangler.toml` 中配置，无需额外添加

## 域名 DNS

根域名 `allenklee.com` 能打开，但 **`www.allenklee.com` 提示找不到服务器**，说明 `www` 还没有 DNS 记录。

仅配置「路由」不够，必须在 **自定义域** 或 **DNS** 里单独添加 `www`。

### 方法一：控制台立即修复（推荐，最快）

1. Cloudflare → **Workers 和 Pages** → **qianduan**
2. 打开 **设置** → **域和路由**
3. 在 **自定义域** 区域点 **+ 添加**
4. 输入：`www.allenklee.com`
5. 保存后等 1–5 分钟

添加成功后，**自定义域** 应显示两条：
- `allenklee.com`
- `www.allenklee.com`

Cloudflare 会自动创建 `www` 的 DNS 和 SSL 证书。

### 方法二：重新部署（wrangler 已配置 custom_domain）

推送代码后重新部署 `qianduan`，也会自动注册 `www.allenklee.com` 自定义域。

### 验证 DNS 是否生效

终端执行：

```bash
dig @1.1.1.1 www.allenklee.com A +short
```

有 IP 输出（如 `104.21.x.x`）即表示 DNS 已生效。

### www 自动跳转

Worker 已配置：访问 `www.allenklee.com` 会 **301 跳转到** `https://allenklee.com`。

## 验证

- https://allenklee.com
- https://www.allenklee.com（应自动跳转到主域名）
