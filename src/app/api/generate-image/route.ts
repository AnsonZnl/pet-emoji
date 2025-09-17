import { NextRequest, NextResponse } from 'next/server';

// 或者使用Stable Diffusion等其他服务
const HUGGINGFACE_API_BASE = 'https://api-inference.huggingface.co/models';

interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  style: string;
  width?: number;
  height?: number;
}

// 图像生成提示词模板
const IMAGE_PROMPT_TEMPLATES = {
  cute: (petDescription: string) => `${petDescription}, cute kawaii emoji style, adorable big eyes, soft pastel colors, chibi art style, sticker design, white background, high quality, 4k`,
  funny: (petDescription: string) => `${petDescription}, funny meme emoji style, exaggerated expression, comedic pose, bright vibrant colors, cartoon style, sticker design, white background, high quality, 4k`,
  angry: (petDescription: string) => `${petDescription}, angry grumpy emoji style, fierce expression, bold colors, dramatic lighting, sticker design, white background, high quality, 4k`,
  happy: (petDescription: string) => `${petDescription}, happy joyful emoji style, big smile, bright cheerful colors, energetic pose, sticker design, white background, high quality, 4k`
};

const NEGATIVE_PROMPT = "blurry, low quality, deformed, ugly, extra limbs, bad anatomy, text, watermark, signature, username, error, duplicate, duplicate heads, duplicate eyes, malformed, mutation, mutated, disfigured, bad proportions, cropped, jpeg artifacts, lowres, normal quality, worst quality";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, width = 512, height = 512 } = await request.json() as GenerateImageRequest;

    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters: prompt and style' },
        { status: 400 }
      );
    }

    // 选择使用的API服务
    const useHuggingFace = process.env.HUGGINGFACE_API_TOKEN;
    const useVolcEngine = process.env.VOLC_ACCESS_KEY;

    if (useHuggingFace) {
      return await generateWithHuggingFace(prompt, style, width, height);
    } else if (useVolcEngine) {
      return await generateWithVolcEngine(prompt, style);
    } else {
      // 如果没有配置API，返回占位符
      return NextResponse.json({
        success: true,
        images: [
          {
            id: `img_${Date.now()}_1`,
            url: `/api/placeholder/emoji?style=${style}&text=${encodeURIComponent(prompt.substring(0, 50))}`,
            style: style,
            prompt: prompt
          }
        ],
        message: 'Using placeholder images. Configure HUGGINGFACE_API_TOKEN or VOLC_ACCESS_KEY for real generation.'
      });
    }

  } catch (error) {
    console.error('Generate image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateWithHuggingFace(prompt: string, style: string, width: number, height: number) {
  const apiToken = process.env.HUGGINGFACE_API_TOKEN;
  
  // 使用Stable Diffusion XL模型
  const model = 'stabilityai/stable-diffusion-xl-base-1.0';
  const fullPrompt = IMAGE_PROMPT_TEMPLATES[style as keyof typeof IMAGE_PROMPT_TEMPLATES]?.(prompt) || prompt;

  const response = await fetch(`${HUGGINGFACE_API_BASE}/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        width: width,
        height: height,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Hugging Face API error:', response.status, errorText);
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  // Hugging Face返回图片二进制数据
  const imageBuffer = await response.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  
  return NextResponse.json({
    success: true,
    images: [
      {
        id: `hf_img_${Date.now()}`,
        url: `data:image/png;base64,${base64Image}`,
        style: style,
        prompt: fullPrompt,
        model: model
      }
    ],
    provider: 'huggingface'
  });
}

async function generateWithVolcEngine(prompt: string, style: string) {
  // 火山引擎文生图API实现
  // 需要根据火山引擎的具体API文档来实现
  
  // 这里需要实现火山引擎的签名认证和API调用
  // 由于火山引擎API需要复杂的签名机制，这里提供基本框架
  
  const fullPrompt = IMAGE_PROMPT_TEMPLATES[style as keyof typeof IMAGE_PROMPT_TEMPLATES]?.(prompt) || prompt;
  
  // 火山引擎API调用逻辑
  // const volcResponse = await callVolcEngineAPI(fullPrompt, style, width, height);
  
  // 暂时返回占位符，实际需要实现具体的火山引擎API调用
  return NextResponse.json({
    success: true,
    images: [
      {
        id: `volc_img_${Date.now()}`,
        url: `/api/placeholder/emoji?style=${style}&provider=volcengine`,
        style: style,
        prompt: fullPrompt,
        model: 'volcengine-text-to-image'
      }
    ],
    provider: 'volcengine',
    message: 'VolcEngine integration in development'
  });
}

// 健康检查
export async function GET() {
  const hasHuggingFace = !!process.env.HUGGINGFACE_API_TOKEN;
  const hasVolcEngine = !!process.env.VOLC_ACCESS_KEY;
  
  return NextResponse.json({
    status: 'healthy',
    providers: {
      huggingface: hasHuggingFace,
      volcengine: hasVolcEngine
    },
    timestamp: new Date().toISOString()
  });
}
