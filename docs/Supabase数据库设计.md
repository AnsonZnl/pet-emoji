# Supabase 数据库设计

## 表结构设计

### emoji_generations 表

用于记录每次表情包生成的信息。

```sql
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

## 字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 主键，自动生成 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| style | VARCHAR(20) | 表情风格：cute, funny, angry, happy |
| pet_type | VARCHAR(50) | 宠物类型（可选） |
| image_url | TEXT | R2存储的图片URL |
| image_size | VARCHAR(20) | 图片尺寸 |
| doubao_model | VARCHAR(100) | 豆包模型名称 |
| doubao_request_id | VARCHAR(100) | 豆包请求ID |
| generated_images | INTEGER | 生成的图片数量 |
| tokens_used | INTEGER | 消耗的token数量 |
| status | VARCHAR(20) | 状态：completed, failed, processing |
| error_message | TEXT | 错误信息 |
| is_public | BOOLEAN | 是否公开展示 |
| featured | BOOLEAN | 是否为精选内容 |

## API 设计

### 1. 保存生成记录
- **路径**: `/api/emoji-generations`
- **方法**: `POST`
- **用途**: 在生成表情包后保存记录

### 2. 获取生成记录（分页）
- **路径**: `/api/emoji-generations`
- **方法**: `GET`
- **参数**: 
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认12）
  - `style`: 风格筛选（可选）
  - `featured`: 是否只显示精选（可选）

### 3. 获取单个记录
- **路径**: `/api/emoji-generations/[id]`
- **方法**: `GET`
- **用途**: 获取单个生成记录的详细信息

## 使用场景

1. **首页展示**: 分页展示最新的生成记录
2. **风格筛选**: 按照不同风格筛选展示
3. **精选内容**: 展示管理员标记的精选内容
4. **统计分析**: 分析用户使用习惯和热门风格