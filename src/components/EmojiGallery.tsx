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

  const styleOptions = [
    { value: '', label: 'All Styles' },
    { value: 'cute', label: 'Cute Style', emoji: '😊' },
    { value: 'funny', label: 'Funny Style', emoji: '😂' },
    { value: 'angry', label: 'Angry Style', emoji: '😠' },
    { value: 'happy', label: 'Happy Style', emoji: '😍' }
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
      setError('Failed to load emoji packs, please try again later');
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

  useEffect(() => {
    fetchEmojis(1, selectedStyle);
  }, [selectedStyle]);

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
    const styleObj = styleOptions.find(s => s.value === style);
    return styleObj ? `${styleObj.emoji} ${styleObj.label}` : style;
  };

  return (
    <div className="w-full">
      {/* Style Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Style</h3>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <button
              key={style.value}
              onClick={() => handleStyleChange(style.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                selectedStyle === style.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 hover:shadow-md border border-gray-200/50 hover:border-purple-200/50 hover:text-purple-700'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => {
              setError('');
              fetchEmojis(pagination.page, selectedStyle);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Emoji Grid */}
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
                      Featured
                    </span>
                  )}
                </div>
                {emoji.pet_type && (
                  <p className="text-sm text-gray-600 mb-2">
                    Pet Type: {emoji.pet_type}
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

      {/* Empty State */}
      {!loading && emojis.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedStyle ? 'No emoji packs for this style yet' : 'No emoji packs yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedStyle ? 'Try other styles, or ' : ''}Be the first to create an emoji pack!
          </p>
          <button
            onClick={() => {
              const generator = document.getElementById('emoji-generator');
              generator?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Creating
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && emojis.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
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
            Next
          </button>
        </div>
      )}

      {/* Statistics */}
      {!loading && emojis.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Total {pagination.total} emoji packs, Page {pagination.page} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}