import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 只有在环境变量存在时才创建客户端
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 数据库表类型定义
export interface EmojiGeneration {
  id: string
  created_at: string
  updated_at: string
  style: 'cute' | 'funny' | 'angry' | 'happy'
  pet_type?: string
  image_url: string
  image_size?: string
  doubao_model?: string
  doubao_request_id?: string
  generated_images?: number
  tokens_used?: number
  status: 'completed' | 'failed' | 'processing'
  error_message?: string
  is_public: boolean
  featured: boolean
}

// 插入新的生成记录
export async function insertEmojiGeneration(data: Omit<EmojiGeneration, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping database insert');
    return null;
  }

  const { data: result, error } = await supabase
    .from('emoji_generations')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error inserting emoji generation:', error)
    throw error
  }

  return result
}

// 获取生成记录（分页）
export async function getEmojiGenerations({
  page = 1,
  limit = 12,
  style,
  featured
}: {
  page?: number
  limit?: number
  style?: string
  featured?: boolean
} = {}) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty data');
    return {
      data: [],
      count: 0,
      page,
      limit,
      totalPages: 0
    };
  }

  let query = supabase
    .from('emoji_generations')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  // 添加筛选条件
  if (style) {
    query = query.eq('style', style)
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured)
  }

  // 分页
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .range(from, to)
    .limit(limit)

  if (error) {
    console.error('Error fetching emoji generations:', error)
    throw error
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

// 获取单个生成记录
export async function getEmojiGeneration(id: string) {
  if (!supabase) {
    console.warn('Supabase not configured, returning null');
    return null;
  }

  const { data, error } = await supabase
    .from('emoji_generations')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error) {
    console.error('Error fetching emoji generation:', error)
    throw error
  }

  return data
}

// 获取统计信息
export async function getEmojiStats() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty stats');
    return {
      total: 0,
      byStyle: {
        cute: 0,
        funny: 0,
        angry: 0,
        happy: 0
      },
      completed: 0,
      failed: 0
    };
  }

  const { data, error } = await supabase
    .from('emoji_generations')
    .select('style, status')
    .eq('is_public', true)

  if (error) {
    console.error('Error fetching emoji stats:', error)
    throw error
  }

  // 统计各种风格的数量
  const stats = {
    total: data?.length || 0,
    byStyle: {
      cute: 0,
      funny: 0,
      angry: 0,
      happy: 0
    },
    completed: 0,
    failed: 0
  }

  data?.forEach(item => {
    if (item.style in stats.byStyle) {
      stats.byStyle[item.style as keyof typeof stats.byStyle]++
    }
    if (item.status === 'completed') {
      stats.completed++
    } else if (item.status === 'failed') {
      stats.failed++
    }
  })

  return stats
}

// 获取最新的生成记录（用于服务器频率限制）
export async function getLatestGenerationRecord() {
  if (!supabase) {
    console.warn('Supabase not configured, skipping database query');
    return null;
  }

  const { data, error } = await supabase
    .from('emoji_generations')
    .select('created_at')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error getting latest generation record:', error)
    throw error
  }

  return data
}