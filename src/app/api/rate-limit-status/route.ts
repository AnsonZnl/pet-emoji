import { NextRequest, NextResponse } from 'next/server';
import { getLatestGenerationRecord } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const latestRecord = await getLatestGenerationRecord();

    if (!latestRecord) {
      // 没有生成记录，允许生成
      return NextResponse.json({
        success: true,
        data: {
          isLimited: false,
          remainingMinutes: 0,
          canGenerate: true
        }
      });
    }

    const lastGenerationTime = new Date(latestRecord.created_at);
    const currentTime = new Date();
    const timeDiffMs = currentTime.getTime() - lastGenerationTime.getTime();
    const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));
    const oneHourInMinutes = 60;

    if (timeDiffMinutes < oneHourInMinutes) {
      // 距离上次生成不足一小时
      const remainingMinutes = oneHourInMinutes - timeDiffMinutes;
      return NextResponse.json({
        success: true,
        data: {
          isLimited: true,
          remainingMinutes: remainingMinutes,
          canGenerate: false,
          lastGenerationTime: latestRecord.created_at
        }
      });
    } else {
      // 距离上次生成超过一小时，允许生成
      return NextResponse.json({
        success: true,
        data: {
          isLimited: false,
          remainingMinutes: 0,
          canGenerate: true,
          lastGenerationTime: latestRecord.created_at
        }
      });
    }
  } catch (error) {
    console.error('Error checking rate limit status:', error);
    // 出错时允许生成，避免阻塞用户
    return NextResponse.json({
      success: true,
      data: {
        isLimited: false,
        remainingMinutes: 0,
        canGenerate: true,
        error: 'Failed to check rate limit status'
      }
    });
  }
}
