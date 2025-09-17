"use client";

import { useState } from "react";
import Image from "next/image";

interface TestResult {
  success: boolean;
  emojis: Array<{
    id: string;
    description: string;
    style: string;
    type: string;
    url: string;
    size: string;
    timestamp: string;
  }>;
  usage: {
    generated_images: number;
    output_tokens: number;
    total_tokens: number;
  };
  model: string;
}

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const testR2Upload = async () => {
    if (!selectedFile) {
      setError("请先选择一个图片文件");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      // 将文件转换为base64
      const reader = new FileReader();
      reader.onload = async e => {
        const base64 = e.target?.result as string;

        try {
          // 调用生成API测试R2上传
          const response = await fetch("/api/generate-emoji", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64,
              style: "cute",
              petType: "test",
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const data = await response.json();
          setResult(data);
          console.log("R2上传测试结果:", data);
        } catch (err) {
          console.error("测试失败:", err);
          setError(err instanceof Error ? err.message : "测试失败");
        } finally {
          setUploading(false);
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error("文件读取失败:", err);
      setError("文件读取失败");
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>Cloudflare R2 上传功能测试</h1>

          {/* 文件选择 */}
          <div className='mb-8'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>选择测试图片</label>
            <input type='file' accept='image/*' onChange={handleFileSelect} className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100' />
            {selectedFile && (
              <p className='mt-2 text-sm text-gray-600'>
                已选择: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* 测试按钮 */}
          <div className='mb-8'>
            <button onClick={testR2Upload} disabled={!selectedFile || uploading} className='w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'>
              {uploading ? (
                <div className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  测试中...
                </div>
              ) : (
                "开始测试 R2 上传"
              )}
            </button>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <h3 className='text-lg font-semibold text-red-800 mb-2'>测试失败</h3>
              <p className='text-red-700'>{error}</p>
            </div>
          )}

          {/* 测试结果 */}
          {result && (
            <div className='space-y-6'>
              <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                <h3 className='text-lg font-semibold text-green-800 mb-2'>✅ 测试成功!</h3>
                <p className='text-green-700'>图片已成功上传到 Cloudflare R2</p>
              </div>

              {/* 结果详情 */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-semibold text-gray-800 mb-2'>上传结果详情:</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='font-medium'>成功状态:</span> {result.success ? "✅ 成功" : "❌ 失败"}
                  </div>
                  <div>
                    <span className='font-medium'>模型:</span> {result.model}
                  </div>
                  <div>
                    <span className='font-medium'>生成图片数量:</span> {result.usage?.generated_images}
                  </div>
                  <div>
                    <span className='font-medium'>消耗Token:</span> {result.usage?.total_tokens}
                  </div>
                </div>
              </div>

              {/* 显示上传的图片 */}
              {result.emojis && result.emojis.length > 0 && (
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-800'>生成的表情包:</h4>
                  {result.emojis.map((emoji, index: number) => (
                    <div key={index} className='border rounded-lg p-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h5 className='font-medium text-gray-800 mb-2'>图片信息</h5>
                          <div className='space-y-1 text-sm text-gray-600'>
                            <div>
                              <span className='font-medium'>ID:</span> {emoji.id}
                            </div>
                            <div>
                              <span className='font-medium'>风格:</span> {emoji.style}
                            </div>
                            <div>
                              <span className='font-medium'>尺寸:</span> {emoji.size}
                            </div>
                            <div>
                              <span className='font-medium'>类型:</span> {emoji.type}
                            </div>
                            <div>
                              <span className='font-medium'>时间:</span> {new Date(emoji.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className='mt-3'>
                            <span className='font-medium text-sm'>R2 URL:</span>
                            <a href={emoji.url} target='_blank' rel='noopener noreferrer' className='block text-xs text-blue-600 hover:text-blue-800 break-all mt-1'>
                              {emoji.url}
                            </a>
                          </div>
                        </div>
                        <div>
                          <h5 className='font-medium text-gray-800 mb-2'>预览图片</h5>
                          <div className='relative'>
                            <Image
                              src={emoji.url}
                              alt={`${emoji.style} emoji pack`}
                              width={300}
                              height={300}
                              className='rounded-lg border shadow-sm'
                              onError={e => {
                                console.error("图片加载失败:", emoji.url);
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 原始响应数据 */}
              <details className='bg-gray-100 p-4 rounded-lg'>
                <summary className='font-medium text-gray-800 cursor-pointer'>查看完整响应数据 (JSON)</summary>
                <pre className='mt-2 text-xs text-gray-600 overflow-auto'>{JSON.stringify(result, null, 2)}</pre>
              </details>
            </div>
          )}

          {/* 说明信息 */}
          <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <h4 className='font-semibold text-blue-800 mb-2'>测试说明</h4>
            <ul className='text-sm text-blue-700 space-y-1'>
              <li>• 此测试会调用豆包API生成表情包，然后上传到Cloudflare R2</li>
              <li>• 请确保已正确配置环境变量 (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)</li>
              <li>• 测试成功后会显示R2的公共访问URL</li>
              <li>• 如果测试失败，请检查控制台错误信息和环境变量配置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
