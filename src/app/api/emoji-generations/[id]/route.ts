import { NextRequest, NextResponse } from 'next/server';
import { getEmojiGeneration } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证ID格式（UUID）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // 获取生成记录
    const data = await getEmojiGeneration(id);

    if (!data) {
      return NextResponse.json(
        { error: 'Generation record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching emoji generation:', error);
    
    // 如果是数据库错误且记录不存在
    if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Generation record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}