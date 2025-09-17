# Pet Emoji Generator

AI驱动的宠物表情包生成器，使用火山引擎豆包大模型将您的宠物照片转换为可爱的表情包。

## ✨ 功能特性

- 🐕 **智能宠物识别**: 自动识别宠物类型和特征
- 🎨 **多种风格**: 支持萌系、搞笑、生气、开心四种风格
- ⚡ **快速生成**: 10-30秒即可生成多个表情包
- 📱 **响应式设计**: 完美适配桌面和移动端
- 🔍 **SEO优化**: 服务端渲染，搜索引擎友好
- 💰 **成本控制**: 充分利用免费API额度

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd pet-emoji
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置API密钥

创建 `.env.local` 文件：

```env
# 豆包大模型API密钥 (必需)
DOUBAO_API_KEY=your_doubao_api_key_here

# 可选：Hugging Face Token (用于图像生成)
HUGGINGFACE_API_TOKEN=your_huggingface_token_here

# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 📚 API文档

### 豆包大模型集成

根据[火山引擎豆包大模型文档](https://www.volcengine.com/docs/82379/1541523)实现：

- **模型**: doubao-pro-32k
- **功能**: 宠物图片分析和表情包描述生成
- **提示词工程**: 针对不同风格优化的提示词模板

### API端点

#### `POST /api/generate-emoji`
生成宠物表情包

**请求参数:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "style": "cute|funny|angry|happy",
  "petType": "auto-detect"
}
```

**响应格式:**
```json
{
  "success": true,
  "emojis": [
    {
      "id": "emoji_123_1",
      "url": "data:image/png;base64,...",
      "style": "cute",
      "description": "..."
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 50,
    "total_tokens": 200
  }
}
```

## 🏗️ 技术架构

### 前端
- **Next.js 14**: 应用框架，支持SSR
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **React Hooks**: 状态管理

### 后端
- **Next.js API Routes**: 轻量级后端
- **火山引擎豆包**: 大模型API
- **Hugging Face**: 备用图像生成API

### 部署
- **Vercel**: 主要部署平台
- **Cloudflare**: CDN和存储
- **环境变量**: 敏感信息管理

## 📁 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate-emoji/     # 豆包API集成
│   │   ├── generate-image/     # 图像生成API
│   │   └── placeholder/        # 占位符API
│   ├── layout.tsx              # 根布局和SEO
│   └── page.tsx               # 主页（SSR）
├── components/
│   ├── PetEmojiGenerator.tsx  # 客户端交互组件
│   └── ScrollButton.tsx       # 滚动按钮组件
└── docs/
    ├── 需求文档.md
    ├── 技术文档.md
    └── API配置说明.md
```

## 🔧 开发指南

### 本地开发

1. **无API密钥**: 使用占位符图片进行开发
2. **有API密钥**: 配置后可测试真实生成功能
3. **调试**: 查看浏览器控制台和服务器日志

### 添加新功能

1. **新的表情风格**: 在提示词模板中添加
2. **新的API提供商**: 在 `generate-image/route.ts` 中添加
3. **新的UI组件**: 在 `components/` 目录中创建

## 📊 成本监控

- **Token使用**: 每次API调用记录token消耗
- **请求统计**: 监控API调用频率
- **错误追踪**: 记录失败请求和原因

## 🚀 部署

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 环境变量配置

在Vercel控制台配置：
- `DOUBAO_API_KEY`
- `HUGGINGFACE_API_TOKEN` (可选)
- `NEXT_PUBLIC_SITE_URL`

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如需帮助，请查看：
- [API配置说明](docs/API配置说明.md)
- [技术文档](docs/技术文档.md)
- [需求文档](docs/需求文档.md)
