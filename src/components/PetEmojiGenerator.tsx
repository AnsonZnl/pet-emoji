'use client';

import { useState, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";

interface GeneratedEmoji {
  id: string;
  url: string;
  style: string;
}

export default function PetEmojiGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('cute');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmojis, setGeneratedEmojis] = useState<GeneratedEmoji[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // 检查是否为测试模式
  const isTestMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('test') === 'true';

  const styles = [
    { id: 'cute', name: 'Cute', emoji: '😊', description: '萌萌哒' },
    { id: 'funny', name: 'Funny', emoji: '😂', description: '搞笑风' },
    { id: 'angry', name: 'Angry', emoji: '😠', description: '生气脸' },
    { id: 'happy', name: 'Happy', emoji: '😍', description: '开心果' },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size cannot exceed 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateEmojis = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    try {
      // 检查URL是否包含test参数
      const urlParams = new URLSearchParams(window.location.search);
      const isTestMode = urlParams.get('test') === 'true';
      
      // 构建API URL，测试模式下添加test参数
      const apiUrl = isTestMode ? '/api/generate-emoji?test=true' : '/api/generate-emoji';
      
      if (isTestMode) {
        console.log('🧪 Test mode: Using mock data instead of calling AI model');
      }

      // 调用API生成表情包
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          style: selectedStyle,
          petType: 'auto-detect' // 让AI自动识别宠物类型
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const result = await response.json();
      
      if (result.success && result.emojis) {
        setGeneratedEmojis(result.emojis);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Generation failed, please try again';
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadEmoji = async (emojiId: string) => {
    try {
      const emoji = generatedEmojis.find(e => e.id === emojiId);
      if (!emoji) return;

      // 如果是base64图片，直接下载
      if (emoji.url.startsWith('data:image/')) {
        const link = document.createElement('a');
        link.href = emoji.url;
        link.download = `pet-emoji-pack-${emoji.style}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 如果是URL，先获取图片数据
      const response = await fetch(emoji.url);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pet-emoji-pack-${emoji.style}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed, please try again');
    }
  };

  return (
    <>
      {/* 测试模式提示 */}
      {isTestMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">🧪</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                 <strong>测试模式已启用</strong> - 将使用模拟数据，不会调用AI模型，节省费用。
                 <Link href="/" className="ml-2 underline hover:text-yellow-800">
                   退出测试模式
                 </Link>
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <section id="upload-section" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upload Your Pet Photo</h2>
            <p className="mt-4 text-gray-600">
              Drag and drop or click to upload. JPG, PNG, WebP (Max 5MB)
            </p>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-purple-400 bg-purple-50'
                : uploadedImage
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {uploadedImage ? (
              <div className="space-y-4">
                <Image
                  src={uploadedImage}
                  alt="Uploaded pet"
                  width={200}
                  height={200}
                  className="mx-auto rounded-lg object-cover"
                />
                <p className="text-green-600 font-medium">✅ Photo uploaded successfully!</p>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Upload different photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your pet photo here
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                </div>
              </div>
            )}
          </div>

          {/* Style Selection */}
          {uploadedImage && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                Choose Emoji Style
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <div className="font-medium text-gray-900">{style.name}</div>
                    <div className="text-sm text-gray-500">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          {uploadedImage && (
            <div className="mt-12 text-center">
              <button
                onClick={generateEmojis}
                disabled={isGenerating}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating... (10-30 seconds)
                  </>
                ) : (
                  <>
                    ✨ Generate Pet Emojis
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results Section - 单张9宫格图片 */}
      {generatedEmojis.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Your Pet Emoji Pack is Ready! 🎉</h2>
              <p className="mt-4 text-gray-600">
                9 adorable expressions in one image - perfect for stickers!
              </p>
            </div>
            
            {/* 显示9宫格图片 */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-4">
                  <Image
                    src={generatedEmojis[0].url}
                    alt={`${selectedStyle} pet emoji pack`}
                    width={600}
                    height={600}
                    className="rounded-lg w-full max-w-[600px] h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* 下载和操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => downloadEmoji(generatedEmojis[0].id)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Emoji Pack
              </button>
              
              <button
                onClick={() => {
                  // 分享功能
                  if (navigator.share) {
                    navigator.share({
                      title: 'Check out my pet emoji pack!',
                      text: 'I just created an awesome pet emoji pack!',
                      url: window.location.href
                    });
                  } else {
                    alert('Share link copied to clipboard!');
                  }
                }}
                className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 010-7.684m-9.032 4.026A9.001 9.001 0 015.648 5.648m0 14.704a9.001 9.001 0 010-14.704" />
                </svg>
                Share
              </button>
            </div>
            
            {/* 生成新的选项 */}
            <div className="mt-12 border-t pt-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Want to try different styles?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setGeneratedEmojis([]);
                      setSelectedStyle(selectedStyle === 'cute' ? 'funny' : 'cute');
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Try Different Style
                  </button>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <button
                    onClick={() => {
                      setGeneratedEmojis([]);
                      setUploadedImage(null);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Upload New Photo
                  </button>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <button
                    onClick={generateEmojis}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
