'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EmojiGeneration } from '@/lib/supabase';

interface EmojiGalleryProps {
  initialData?: EmojiGeneration[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiResponse {
  success: boolean;
  data: EmojiGeneration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function EmojiGallery({ initialData = [], initialPagination }: EmojiGalleryProps) {
  const [emojis, setEmojis] = useState<EmojiGeneration[]>(initialData);
  const [pagination, setPagination] = useState(initialPagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [error, setError] = useState<string>('');

  const styles = [
    { value: '', label: '全部风格' },
    { value: 'cute', label: '可爱风格', emoji: '😊' },
    { value: 'funny', label: '搞笑风格', emoji: '😂' },
    { value: 'angry', label: '愤怒风格', emoji: '😠' },
    { value: 'happy', label: '开心风格', emoji: '😍' }
  ];

  const fetchEmojis = async (page: number = 1, style: string = '') => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (style) {
        params.append('style', style);
      }

      const response = await fetch(`/api/emoji-generations?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch emojis');
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setEmojis(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      console.error('Error fetching emojis:', err);
      setError('加载表情包失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    fetchEmojis(1, style);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEmojis(newPage, selectedStyle);
    }
  };

  // 如果没有初始数据，则在组件挂载时获取数据
  useEffect(() => {
    if (initialData.length === 0) {
      fetchEmojis();
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStyleLabel = (style: string) => {
    const styleObj = styles.find(s => s.value === style);
    return styleObj ? `${styleObj.emoji} ${styleObj.label}` : style;
  };

  return (
    <div className="w-full">
      {/* 风格筛选器 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">筛选风格</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => handleStyleChange(style.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStyle === style.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => fetchEmojis(pagination.page, selectedStyle)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            重试
          </button>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      )}

      {/* 表情包网格 */}
      {!loading && emojis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {emojis.map((emoji) => (
            <div
              key={emoji.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={emoji.image_url}
                  alt={`${emoji.style} style emoji pack`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    console.error('Image load error:', emoji.image_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600">
                    {getStyleLabel(emoji.style)}
                  </span>
                  {emoji.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      精选
                    </span>
                  )}
                </div>
                {emoji.pet_type && (
                  <p className="text-sm text-gray-600 mb-2">
                    宠物类型: {emoji.pet_type}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {formatDate(emoji.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && emojis.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedStyle ? '该风格暂无表情包' : '暂无表情包'}
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedStyle ? '试试其他风格，或者' : ''}成为第一个创建表情包的用户吧！
          </p>
          <button
            onClick={() => {
              const generator = document.getElementById('emoji-generator');
              generator?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            开始创建
          </button>
        </div>
      )}

      {/* 分页控件 */}
      {!loading && emojis.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i;
              if (pageNum > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === pagination.page
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {/* 统计信息 */}
      {!loading && emojis.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          共 {pagination.total} 个表情包，第 {pagination.page} / {pagination.totalPages} 页
        </div>
      )}
    </div>
  );
}