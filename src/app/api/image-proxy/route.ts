import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Image proxy request:', request.url);
    
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    console.log('Requested image URL:', imageUrl);

    if (!imageUrl) {
      console.error('Missing url parameter');
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // 验证URL格式
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch (urlError) {
      console.error('Invalid URL format:', imageUrl, urlError);
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // 验证URL是否来自允许的域名
    const allowedDomains = [
      'pub-a51a2574d6e74ec8b4c2cc453bfecf10.r2.dev',
      'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com',
      '5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com'
    ];

    const isAllowed = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith('.r2.dev') || url.hostname.endsWith('.r2.cloudflarestorage.com')
    );

    console.log('Domain check:', url.hostname, 'allowed:', isAllowed);

    if (!isAllowed) {
      console.error('Domain not allowed:', url.hostname);
      return NextResponse.json({ error: `Domain not allowed: ${url.hostname}` }, { status: 403 });
    }

    // 获取图片
    console.log('Fetching image from:', imageUrl);
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Pet-Emoji-Generator/1.0',
        'Accept': 'image/*',
      },
    });

    console.log('Fetch response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return NextResponse.json({ 
        error: `Failed to fetch image: ${response.status} ${response.statusText}`,
        url: imageUrl 
      }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    console.log('Content type:', contentType);
    
    const imageBuffer = await response.arrayBuffer();
    console.log('Image buffer size:', imageBuffer.byteLength);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}