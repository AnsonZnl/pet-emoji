import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 豆包大模型API配置
const DOUBAO_API_BASE = 'https://ark.cn-beijing.volces.com/api/v3';
const DOUBAO_MODEL = 'doubao-seedream-4-0-250828'; // 使用豆包Pro模型

// Cloudflare R2配置
const R2_BUCKET_NAME = 'pet-emoji';
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || `https://pub-${R2_ACCOUNT_ID}.r2.dev`;

interface GenerateEmojiRequest {
  image: string; // base64编码的图片
  style: string; // 表情风格
  petType?: string; // 宠物类型（可选）
}

// 豆包图像生成响应接口
interface DoubaoImageResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  data: Array<{
    url?: string;
    b64_json?: string;
    size: string;
  }>;
  usage: {
    generated_images: number;
    output_tokens: number;
    total_tokens: number;
  };
}

// 流式响应事件接口
interface DoubaoStreamEvent {
  type: 'image_generation.partial_succeeded' | 'image_generation.partial_failed' | 'image_generation.completed';
  model: string;
  created: number;
  image_index?: number;
  url?: string;
  b64_json?: string;
  size?: string;
  error?: {
    code: string;
    message: string;
  };
  usage?: {
    generated_images: number;
    output_tokens: number;
    total_tokens: number;
  };
}

// 提示词模板
const PROMPT_TEMPLATES = {
  cute: "Create ONE single image containing a 3x3 grid of 9 emoji expressions of this pet. The image should show the SAME pet with 9 different cute expressions arranged in a grid: Row 1: Happy tongue out, Winking, Thinking with paw. Row 2: Surprised wide eyes, Sleeping peacefully, Laughing joyfully. Row 3: Shy/blushing, Acting cool, Blowing kiss. CRITICAL: Generate ONE image file with all 9 expressions in a grid layout, pure white/light background, consistent pet appearance, professional quality like popular pet emoji packs.",
  funny: "Create ONE single image containing a 3x3 grid of 9 meme expressions of this pet. The image should show the SAME pet with 9 different funny expressions arranged in a grid: Row 1: Tongue sideways, Cross-eyed silly, Big yawn. Row 2: Shocked face, Smirking, Confused head tilt. Row 3: Laughing hard, Duck face, Side-eye judging. CRITICAL: Generate ONE image file with all 9 expressions in a grid layout, pure white/light background, consistent pet appearance, meme-worthy quality.",
  angry: "Create ONE single image containing a 3x3 grid of 9 grumpy expressions of this pet. The image should show the SAME pet with 9 different angry expressions arranged in a grid: Row 1: Deep frown, Showing teeth, Suspicious squint. Row 2: Pouting, Eye roll, Puffed cheeks. Row 3: Intense glare, Looking away annoyed, Defensive posture. CRITICAL: Generate ONE image file with all 9 expressions in a grid layout, pure white/light background, consistent pet appearance, dramatic but safe.",
  happy: "Create ONE single image containing a 3x3 grid of 9 joyful expressions of this pet. The image should show the SAME pet with 9 different happy expressions arranged in a grid: Row 1: Big smile, Laughing eyes closed, Heart eyes. Row 2: Happy panting, Excited sparkly eyes, Content smile. Row 3: Playful head tilt, Waving paw, Jumping for joy. CRITICAL: Generate ONE image file with all 9 expressions in a grid layout, pure white/light background, consistent pet appearance, bright positive energy."
};

export async function POST(request: NextRequest) {
  try {
    const { image, style, petType } = await request.json() as GenerateEmojiRequest;

    // 验证必要参数
    if (!image || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters: image and style' },
        { status: 400 }
      );
    }

    // 验证API密钥
    const apiKey = process.env.DOUBAO_API_KEY;
    if (!apiKey) {
      console.error('DOUBAO_API_KEY not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // 构建提示词
    const basePrompt = PROMPT_TEMPLATES[style as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.cute;
    const petTypePrompt = petType ? `This is a ${petType}. ` : '';
    const fullPrompt = `${petTypePrompt}${basePrompt}

Additional critical requirements:
- Output must be ONE SINGLE IMAGE containing all 9 expressions
- Arrange as a 3x3 grid with clear separation between each expression
- Each cell shows the SAME pet with consistent fur color/pattern
- Background must be PURE WHITE or very light solid color
- Show only head and partial upper body in each cell
- Professional photography quality, natural pet expressions
- Consistent lighting and angle across all cells
- High resolution (at least 1024x1024) suitable for emoji/sticker use
- Similar to popular pet emoji packs but as one unified image`;

    // 准备图像生成API请求数据
    const requestData = {
      model: DOUBAO_MODEL,
      prompt: fullPrompt,
      image: image, // 添加输入图片参数
      size: "2048x2048", // 图片尺寸
      response_format: "url", // 返回URL格式
      stream: false // 暂时不使用流式响应
    };

    // 调用豆包图像生成API
    const response = await fetch(`${DOUBAO_API_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Doubao API error:', response.status, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json() as DoubaoImageResponse;
    
    // 检查响应格式
    if (!result.data || result.data.length === 0) {
      console.error('Invalid API response:', result);
      return NextResponse.json(
        { error: 'Invalid response from AI model' },
        { status: 500 }
      );
    }

    // 提取生成的图片
    const generatedImage = result.data[0];
    
    // 转存图片到本地
    const timestamp = Date.now();
    const filename = `emoji_pack_${style}_${timestamp}.jpeg`;
    let emojis: Array<{
      id: string;
      description: string;
      style: string;
      type: string;
      url: string;
      size: string;
      timestamp: string;
    }> = [];
    
    // 直接上传图片到Cloudflare R2，而不是本地存储
    try {
      // 配置Cloudflare R2客户端
      if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        console.error('Cloudflare R2 credentials not configured');
        throw new Error('Cloudflare R2 credentials not configured');
      }

      console.log('Starting R2 upload process...');
      console.log('Original image URL:', generatedImage.url);

      // 下载图片
      const imageResponse = await fetch(generatedImage.url || '');
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log('Image downloaded, size:', buffer.length, 'bytes');

      const r2Client = new S3Client({
        region: 'auto',
        endpoint: R2_ENDPOINT,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      });

      // 上传到R2
      const key = `emoji-packs/${filename}`;
      const uploadCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline',
      });

      console.log('Uploading to R2 bucket:', R2_BUCKET_NAME, 'key:', key);
      await r2Client.send(uploadCommand);

      // 构建公共访问URL
      const publicUrl = `${R2_PUBLIC_URL}/${key}`;
      console.log('R2 upload successful, public URL:', publicUrl);

      // 返回生成的表情包网格 - 只返回R2 URL
      const emojiGrid = {
        id: `emoji_grid_${timestamp}`,
        description: `${style} style emoji grid`,
        style: style,
        type: 'grid',
        url: publicUrl, // 确保返回R2 URL
        size: generatedImage.size,
        timestamp: new Date().toISOString()
      };
      
      emojis = [emojiGrid];
    } catch (saveError) {
      console.error('Error uploading image to R2:', saveError);
      // 如果R2上传失败，抛出错误而不是回退到原始URL
      throw new Error(`R2 upload failed: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`);
    }

    // 记录使用情况（用于成本监控）
    console.log('Doubao API usage:', {
      model: result.model,
      usage: result.usage,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      emojis: emojis,
      usage: result.usage,
      model: result.model
    });

  } catch (error) {
    console.error('Generate emoji error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    model: DOUBAO_MODEL
  });
}
