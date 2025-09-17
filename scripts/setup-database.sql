-- 创建表情包生成记录表
CREATE TABLE IF NOT EXISTS emoji_generations (
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
CREATE INDEX IF NOT EXISTS idx_emoji_generations_created_at ON emoji_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emoji_generations_style ON emoji_generations(style);
CREATE INDEX IF NOT EXISTS idx_emoji_generations_public ON emoji_generations(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_emoji_generations_featured ON emoji_generations(featured) WHERE featured = true;

-- 启用行级安全策略（RLS）
ALTER TABLE emoji_generations ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Allow public read access" ON emoji_generations;
DROP POLICY IF EXISTS "Allow public insert" ON emoji_generations;

-- 创建策略：允许所有人读取公开记录
CREATE POLICY "Allow public read access" ON emoji_generations
  FOR SELECT USING (is_public = true);

-- 创建策略：允许所有人插入记录
CREATE POLICY "Allow public insert" ON emoji_generations
  FOR INSERT WITH CHECK (true);

-- 插入模拟数据
INSERT INTO emoji_generations (
  style,
  pet_type,
  image_url,
  image_size,
  doubao_model,
  doubao_request_id,
  generated_images,
  tokens_used,
  status,
  is_public,
  featured
) VALUES 
-- 可爱风格的表情包
(
  'cute',
  'cat',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208991',
  1,
  16384,
  'completed',
  true,
  true
),
-- 搞笑风格的表情包
(
  'funny',
  'dog',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208992',
  1,
  16384,
  'completed',
  true,
  false
),
-- 愤怒风格的表情包
(
  'angry',
  'cat',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208993',
  1,
  16384,
  'completed',
  true,
  false
),
-- 开心风格的表情包
(
  'happy',
  'dog',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208994',
  1,
  16384,
  'completed',
  true,
  true
),
-- 更多可爱风格的表情包
(
  'cute',
  'rabbit',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208995',
  1,
  16384,
  'completed',
  true,
  false
),
-- 更多搞笑风格的表情包
(
  'funny',
  'hamster',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'emoji_grid_1758046208996',
  1,
  16384,
  'completed',
  true,
  false
),
-- 测试数据（用于测试模式）
(
  'cute',
  'test-pet',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'test_1758046208997',
  1,
  0, -- 测试模式不消耗token
  'completed',
  true,
  false
),
-- 更多测试数据
(
  'happy',
  'test-cat',
  'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
  '2048x2048',
  'doubao-seedream-4-0-250828',
  'test_1758046208998',
  1,
  0,
  'completed',
  true,
  false
);

-- 验证数据插入
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN tokens_used = 0 THEN 1 END) as test_records
FROM emoji_generations;

-- 按风格统计
SELECT 
  style,
  COUNT(*) as count
FROM emoji_generations 
GROUP BY style 
ORDER BY style;

COMMIT;