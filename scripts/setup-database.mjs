#!/usr/bin/env node

/**
 * 数据库初始化脚本 (ES模块版本)
 * 用于创建表结构并插入模拟数据
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// 从环境变量读取配置
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 错误: 请在 .env.local 文件中配置 Supabase 环境变量');
  console.error('需要配置:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 插入模拟数据
    console.log('📝 插入模拟数据...');
    
    const mockData = [
      {
        style: 'cute',
        pet_type: 'cat',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208991',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: true
      },
      {
        style: 'funny',
        pet_type: 'dog',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208992',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: false
      },
      {
        style: 'angry',
        pet_type: 'cat',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208993',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: false
      },
      {
        style: 'happy',
        pet_type: 'dog',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208994',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: true
      },
      {
        style: 'cute',
        pet_type: 'rabbit',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208995',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: false
      },
      {
        style: 'funny',
        pet_type: 'hamster',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'emoji_grid_1758046208996',
        generated_images: 1,
        tokens_used: 16384,
        status: 'completed',
        is_public: true,
        featured: false
      },
      // 测试数据
      {
        style: 'cute',
        pet_type: 'test-pet',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'test_1758046208997',
        generated_images: 1,
        tokens_used: 0, // 测试模式不消耗token
        status: 'completed',
        is_public: true,
        featured: false
      },
      {
        style: 'happy',
        pet_type: 'test-cat',
        image_url: 'https://5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com/emoji-packs/emoji_pack_cute_1758082762296.jpeg',
        image_size: '2048x2048',
        doubao_model: 'doubao-seedream-4-0-250828',
        doubao_request_id: 'test_1758046208998',
        generated_images: 1,
        tokens_used: 0,
        status: 'completed',
        is_public: true,
        featured: false
      }
    ];

    const { data, error: insertError } = await supabase
      .from('emoji_generations')
      .insert(mockData)
      .select();

    if (insertError) {
      console.error('❌ 插入数据失败:', insertError);
      throw insertError;
    }

    console.log(`✅ 成功插入 ${data.length} 条记录`);

    // 验证数据
    console.log('🔍 验证数据...');
    
    const { data: stats, error: statsError } = await supabase
      .from('emoji_generations')
      .select('style, featured, tokens_used')
      .eq('is_public', true);

    if (statsError) {
      console.error('❌ 查询统计失败:', statsError);
    } else {
      const totalRecords = stats.length;
      const featuredCount = stats.filter(item => item.featured).length;
      const testRecords = stats.filter(item => item.tokens_used === 0).length;
      
      console.log('📊 数据统计:');
      console.log(`   总记录数: ${totalRecords}`);
      console.log(`   精选记录: ${featuredCount}`);
      console.log(`   测试记录: ${testRecords}`);
      
      // 按风格统计
      const styleStats = stats.reduce((acc, item) => {
        acc[item.style] = (acc[item.style] || 0) + 1;
        return acc;
      }, {});
      
      console.log('   风格分布:');
      Object.entries(styleStats).forEach(([style, count]) => {
        console.log(`     ${style}: ${count}`);
      });
    }

    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行脚本
setupDatabase();