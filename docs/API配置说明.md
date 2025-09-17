# API 配置说明

## 豆包大模型API配置

### 1. 获取API密钥
1. 访问 [豆包大模型控制台](https://console.volcengine.com/ark)
2. 创建应用并获取API Key
3. 在项目根目录的 `.env.local` 文件中配置：
```env
DOUBAO_API_KEY=your_doubao_api_key_here
```

## Cloudflare R2 对象存储配置

### 1. 获取Account ID
- 登录 Cloudflare 仪表板
- 在右侧边栏可以找到 Account ID

### 2. 创建R2 API令牌
- 进入 **Cloudflare仪表板 > R2 > 管理R2 API令牌**
- 点击 **"创建API令牌"**
- **重要：选择"R2令牌"** 而不是"自定义令牌"
- 权限设置：
  - ✅ 对象读取和写入
  - ✅ 存储桶列表
- 令牌名称：`pet-emoji-r2-token`
- 点击"创建API令牌"

### 3. 环境变量配置
```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id_32_chars
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_64_chars
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com
```

### 4. 创建存储桶
- 在 R2 控制台创建名为 `pet-emoji` 的存储桶
- 配置公共访问（可选）

### 5. 自定义域名（可选）
- 在 R2 存储桶设置中配置自定义域名
- 更新 `CLOUDFLARE_R2_PUBLIC_URL` 环境变量

## Supabase 数据库配置

### 1. 创建Supabase项目
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

### 2. 获取API凭据
- 进入项目设置 > API
- 复制以下信息：
  - Project URL
  - anon public key

### 3. 环境变量配置
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 创建数据库表
在 Supabase SQL 编辑器中执行以下 SQL：

```sql
-- 创建表情包生成记录表
CREATE TABLE emoji_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 生成参数
  style VARCHAR(20) NOT NULL, -- cute, funny, angry, happy
  pet_type VARCHAR(50), -- 宠物类型（可选）
  
  -- 生成结果
  image_url TEXT NOT NULL, -- R2存储的图片URL
  image_size VARCHAR(20), -- 图片尺寸，如 "1024x1024"
  
  -- 豆包API相关
  doubao_model VARCHAR(100), -- 使用的模型名称
  doubao_request_id VARCHAR(100), -- 豆包请求ID
  
  -- 统计信息
  generated_images INTEGER DEFAULT 1, -- 生成的图片数量
  tokens_used INTEGER, -- 消耗的token数量
  
  -- 状态
  status VARCHAR(20) DEFAULT 'completed', -- completed, failed, processing
  error_message TEXT, -- 错误信息（如果有）
  
  -- 索引字段
  is_public BOOLEAN DEFAULT true, -- 是否公开展示
  featured BOOLEAN DEFAULT false -- 是否为精选内容
);

-- 创建索引
CREATE INDEX idx_emoji_generations_created_at ON emoji_generations(created_at DESC);
CREATE INDEX idx_emoji_generations_style ON emoji_generations(style);
CREATE INDEX idx_emoji_generations_public ON emoji_generations(is_public) WHERE is_public = true;
CREATE INDEX idx_emoji_generations_featured ON emoji_generations(featured) WHERE featured = true;

-- 启用行级安全策略（RLS）
ALTER TABLE emoji_generations ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取公开记录
CREATE POLICY "Allow public read access" ON emoji_generations
  FOR SELECT USING (is_public = true);

-- 创建策略：允许所有人插入记录
CREATE POLICY "Allow public insert" ON emoji_generations
  FOR INSERT WITH CHECK (true);
```

## 完整环境变量示例

创建 `.env.local` 文件：

```env
# 豆包大模型API配置
DOUBAO_API_KEY=your_doubao_api_key_here

# Cloudflare R2对象存储配置
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id_32_chars
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_64_chars
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com

# Supabase数据库配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 网站URL（用于SEO）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 注意事项

1. **R2令牌长度**：
   - ACCESS_KEY_ID 应该是 32 个字符
   - SECRET_ACCESS_KEY 应该是 64 个字符
   - 如果是 40 个字符，说明创建的是错误的令牌类型

2. **Supabase安全**：
   - 使用 anon key 是安全的，因为启用了 RLS
   - 只有公开记录可以被读取
   - 所有人都可以插入记录（用于保存生成结果）

3. **环境变量**：
   - 以 `NEXT_PUBLIC_` 开头的变量会暴露给客户端
   - 其他变量只在服务端可用

4. **域名配置**：
   - 生产环境记得更新 `NEXT_PUBLIC_SITE_URL`
   - R2 自定义域名可以提升访问速度

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
