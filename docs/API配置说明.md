# API配置说明

## 环境变量配置

创建 `.env.local` 文件在项目根目录，添加以下配置：

```env
# 豆包大模型API配置 (必需)
# 获取API密钥：https://console.volcengine.com/ark
DOUBAO_API_KEY=your_doubao_api_key_here

# 可选：Hugging Face API Token (用于图像生成)
# 获取Token：https://huggingface.co/settings/tokens
HUGGINGFACE_API_TOKEN=your_huggingface_token_here

# 可选：火山引擎API密钥 (用于其他服务)
VOLC_ACCESS_KEY=your_volc_access_key_here
VOLC_SECRET_KEY=your_volc_secret_key_here

# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Cloudflare R2对象存储配置

本项目使用Cloudflare R2来存储生成的表情包图片。

### 1. 获取Account ID
- 登录Cloudflare仪表板
- 在右侧边栏可以找到你的Account ID

### 2. 创建R2 API令牌
- 进入 Cloudflare仪表板 > R2 > 管理R2 API令牌
- 点击"创建API令牌"
- **重要：选择"R2令牌"而不是"自定义令牌"**
- 权限设置：
  - 对象读取和写入
  - 存储桶列表
- 令牌名称：输入一个描述性名称（如：pet-emoji-r2-token）
- 点击"创建API令牌"

**注意：**
- R2 API令牌的Access Key ID长度应该是32个字符
- Secret Access Key长度应该是64个字符
- 如果你的Access Key ID是40个字符，说明你创建的是错误的令牌类型

### 3. 配置环境变量
在 `.env.local` 文件中添加：

```env
# Cloudflare R2配置
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com  # 可选
```

### 4. 存储桶配置
- 存储桶名称：`pet-emoji`
- 确保存储桶已创建并配置了公共访问权限

### 5. 自定义域名（可选）
如果你为R2存储桶配置了自定义域名，请设置 `CLOUDFLARE_R2_PUBLIC_URL` 环境变量。
否则系统会使用默认的 `https://pub-{account_id}.r2.dev` 格式。

## 完整的环境变量示例

```env
# 豆包大模型API配置
DOUBAO_API_KEY=your_doubao_api_key_here

# Cloudflare R2对象存储配置
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com
```

## 豆包大模型API接入步骤

### 1. 获取API密钥

1. 访问 [火山引擎控制台](https://console.volcengine.com/ark)
2. 注册/登录账号
3. 创建应用并获取API Key
4. 将API Key配置到环境变量 `DOUBAO_API_KEY`

### 2. API接口说明

根据 [火山引擎豆包大模型文档](https://www.volcengine.com/docs/82379/1541523)，我们实现了以下接口：

#### `/api/generate-emoji` - 表情包生成接口

**请求参数：**
```typescript
{
  image: string;      // base64编码的宠物图片
  style: string;      // 表情风格：cute/funny/angry/happy
  petType?: string;   // 宠物类型（可选，默认自动识别）
}
```

**响应格式：**
```typescript
{
  success: boolean;
  emojis: Array<{
    id: string;
    url: string;
    style: string;
    description?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

### 3. 提示词工程

我们为不同风格设计了专门的提示词模板，生成**单张包含9个表情的图片**：

- **Cute风格**: 9个萌系表情 - 吐舌头、眨眼、思考、惊讶、睡觉、大笑、害羞、装酷、飞吻
- **Funny风格**: 9个搞笑表情 - 斜吐舌、斗鸡眼、打哈欠、震惊、坏笑、疑惑、爆笑、嘟嘴、斜眼
- **Angry风格**: 9个生气表情 - 皱眉、呲牙、眯眼、撅嘴、翻白眼、鼓腮、怒视、不屑、防御
- **Happy风格**: 9个开心表情 - 大笑、闭眼笑、爱心眼、吐舌喘气、星星眼、满足、歪头、挥手、跳跃

**重要**: 系统会生成一张3x3网格布局的图片，包含同一只宠物的9种不同表情，纯白背景，专业摄影质感。

### 4. 成本控制

- **Token使用监控**: 记录每次API调用的token消耗
- **请求频率限制**: 防止恶意使用
- **错误重试机制**: 失败时自动重试，避免不必要的token消耗

### 5. 备用方案

如果豆包API不可用，系统会：
1. 尝试使用Hugging Face API
2. 最后使用占位符图片确保用户体验

## 使用说明

1. 配置环境变量后重启开发服务器
2. 上传宠物照片
3. 选择表情风格
4. 点击生成按钮
5. 下载生成的表情包

## 故障排除

### API密钥无效
- 检查 `.env.local` 文件是否正确配置
- 确认API密钥是否有效且有足够额度

### 生成失败
- 检查网络连接
- 确认图片格式和大小符合要求
- 查看控制台错误日志

### 下载失败
- 检查浏览器是否允许下载
- 确认生成的图片URL有效

## 开发模式

在开发模式下，如果没有配置API密钥，系统会使用占位符图片，方便开发和测试。
