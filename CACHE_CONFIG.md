# Render部署缓存配置说明

## 配置目标
避免304状态码，优化缓存策略，提升网站性能

## 关键配置

### 1. render.yaml 配置
- **静态资源**：使用`immutable`和长期缓存（1年）
- **HTML文件**：使用短期缓存（1小时）和`must-revalidate`
- **API请求**：禁用缓存
- **禁用ETag/Last-Modified**：避免304响应

### 2. _headers 文件配置
- 为不同类型的文件设置不同的缓存策略
- 静态资源使用`immutable`
- HTML文件使用`must-revalidate`
- 清空ETag和Last-Modified头

### 3. Vite构建配置
- 确保文件名包含哈希值
- 启用代码分割
- 生成构建清单

## 缓存策略

### 长期缓存（1年）
- JS/CSS文件（带哈希）
- 图片资源（PNG/JPG/SVG等）
- 字体文件（WOFF/WOFF2/TTF等）

### 短期缓存（1小时）
- HTML文件
- 根路径（/）

### 不缓存
- API请求（/api/*）
- 动态内容

## 避免304的关键点

1. **禁用ETag**：通过设置空值避免条件请求
2. **禁用Last-Modified**：避免时间戳验证
3. **使用immutable**：告诉浏览器资源永不改变
4. **合理设置max-age**：平衡缓存和更新需求

## 部署验证

部署后可以通过以下方式验证：
1. 检查响应头中的Cache-Control
2. 确认没有ETag和Last-Modified头
3. 刷新页面时不应出现304状态码
4. 静态资源应直接从缓存加载