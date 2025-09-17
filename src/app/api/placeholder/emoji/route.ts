import { NextRequest, NextResponse } from 'next/server';

// 生成9宫格SVG占位符
function generateGridSVG(style: string): string {
  const expressions = {
    cute: ['😛', '😉', '🤔', '😲', '😴', '😄', '😊', '😎', '😘'],
    funny: ['🤪', '🤓', '🥱', '🤯', '😏', '🤨', '🤣', '🦆', '👀'],
    angry: ['😠', '😬', '🤨', '😤', '🙄', '😮‍💨', '😡', '😒', '💢'],
    happy: ['😃', '😆', '😍', '🐕', '✨', '😌', '🥰', '👋', '🎉']
  };

  const emojis = expressions[style as keyof typeof expressions] || expressions.cute;
  const gridSize = 3;
  const cellSize = 200;
  const totalSize = cellSize * gridSize;
  const padding = 5;
  
  return `
    <svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
      <!-- 白色背景 -->
      <rect width="${totalSize}" height="${totalSize}" fill="#ffffff"/>
      
      <!-- 9宫格 -->
      ${emojis.map((emoji, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize;
        const y = row * cellSize;
        
        return `
          <g>
            <!-- 单元格分隔线 -->
            ${col > 0 ? `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + cellSize}" stroke="#f0f0f0" stroke-width="2"/>` : ''}
            ${row > 0 ? `<line x1="${x}" y1="${y}" x2="${x + cellSize}" y2="${y}" stroke="#f0f0f0" stroke-width="2"/>` : ''}
            
            <!-- 表情 -->
            <text x="${x + cellSize/2}" y="${y + cellSize/2}" 
                  font-family="Arial" font-size="80" 
                  text-anchor="middle" dominant-baseline="middle">${emoji}</text>
          </g>
        `;
      }).join('')}
      
      <!-- DEMO水印 -->
      <text x="${totalSize/2}" y="${totalSize - 20}" 
            font-family="Arial" font-size="16" fill="#ccc"
            text-anchor="middle">DEMO - ${style} style</text>
    </svg>
  `;
}

// 生成单个SVG占位符表情包
function generatePlaceholderSVG(style: string, id: string, text?: string): string {
  const colors = {
    cute: { bg: '#FFB6C1', emoji: '😊', border: '#FF69B4' },
    funny: { bg: '#FFD700', emoji: '😂', border: '#FFA500' },
    angry: { bg: '#FF6B6B', emoji: '😠', border: '#FF0000' },
    happy: { bg: '#98FB98', emoji: '😍', border: '#32CD32' }
  };

  const config = colors[style as keyof typeof colors] || colors.cute;
  const displayText = text ? text.substring(0, 20) + '...' : `${style} pet emoji`;

  return `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${config.border};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      
      <!-- Background circle -->
      <circle cx="100" cy="100" r="90" fill="url(#gradient-${id})" stroke="${config.border}" stroke-width="4"/>
      
      <!-- Emoji -->
      <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="#333">
        ${config.emoji}
      </text>
      
      <!-- Style label -->
      <text x="100" y="40" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#333">
        ${style.toUpperCase()}
      </text>
      
      <!-- ID label -->
      <text x="100" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#666">
        #${id}
      </text>
      
      <!-- Demo watermark -->
      <text x="100" y="160" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#999">
        DEMO
      </text>
    </svg>
  `;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') || 'cute';
  const type = searchParams.get('type');
  const id = searchParams.get('id') || '1';
  const text = searchParams.get('text');
  const provider = searchParams.get('provider');

  // 根据类型生成不同的SVG
  let svg: string;
  if (type === 'grid') {
    svg = generateGridSVG(style);
  } else {
    svg = generatePlaceholderSVG(style, id, text || undefined);
  }

  // 返回SVG图片
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // 缓存1小时
      'X-Generated-By': 'Pet Emoji Generator',
      'X-Provider': provider || 'placeholder',
      'X-Style': style,
      'X-Type': type || 'single',
    },
  });
}

// 也支持POST请求用于批量生成
export async function POST(request: NextRequest) {
  try {
    const { styles, count = 1 } = await request.json();
    
    if (!styles || !Array.isArray(styles)) {
      return NextResponse.json(
        { error: 'Invalid styles parameter' },
        { status: 400 }
      );
    }

    const placeholders = styles.flatMap((style: string) => 
      Array.from({ length: count }, (_, i) => ({
        id: `placeholder_${style}_${Date.now()}_${i + 1}`,
        url: `/api/placeholder/emoji?style=${style}&id=${i + 1}`,
        style: style,
        type: 'placeholder'
      }))
    );

    return NextResponse.json({
      success: true,
      placeholders,
      count: placeholders.length
    });

  } catch (error) {
    console.error('Placeholder generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
