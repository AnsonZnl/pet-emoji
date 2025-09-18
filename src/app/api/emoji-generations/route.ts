import { NextRequest, NextResponse } from 'next/server';
import { getEmojiGenerations, getEmojiStats } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const style = searchParams.get('style') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const stats = searchParams.get('stats') === 'true';

    // 如果请求统计信息
    if (stats) {
      const statsData = await getEmojiStats();
      return NextResponse.json({
        success: true,
        stats: statsData
      });
    }

    // 验证参数
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid page or limit parameters' },
        { status: 400 }
      );
    }

    // 验证风格参数
    if (style && !['cute', 'funny', 'angry', 'happy'].includes(style)) {
      return NextResponse.json(
        { error: 'Invalid style parameter' },
        { status: 400 }
      );
    }

    // 获取生成记录
    const result = await getEmojiGenerations({
      page,
      limit,
      style,
      featured
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.count,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching emoji generations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 健康检查
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}