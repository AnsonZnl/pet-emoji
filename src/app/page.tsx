import Link from "next/link";
import PetEmojiGenerator from "@/components/PetEmojiGenerator";
import ScrollButton from "@/components/ScrollButton";
import EmojiGallery from "@/components/EmojiGallery";
import { getEmojiGenerations } from "@/lib/supabase";

// 结构化数据用于SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pet Emoji Generator",
  description: "AI-powered pet emoji generator that transforms your pet photos into adorable emojis",
  url: "https://www.petemojimaker.com",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Pet Emoji Generator",
  },
};

export default async function Home() {
  // 获取初始的表情包数据用于首页展示
  let initialEmojis = [];
  let initialPagination = undefined;

  try {
    const result = await getEmojiGenerations({ page: 1, limit: 8 });
    initialEmojis = result.data;
    initialPagination = {
      page: result.page,
      limit: result.limit,
      total: result.count,
      totalPages: result.totalPages,
      hasNext: result.page < result.totalPages,
      hasPrev: result.page > 1,
    };
  } catch (error) {
    console.error("Error fetching initial emojis:", error);
    // 如果获取失败，使用空数组，组件会在客户端重新获取
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
      {/* 结构化数据 */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Global background decoration */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl'></div>
          <div className='absolute top-40 right-20 w-48 h-48 bg-pink-200/20 rounded-full blur-2xl'></div>
          <div className='absolute bottom-40 left-1/3 w-56 h-56 bg-blue-200/20 rounded-full blur-3xl'></div>
          <div className='absolute bottom-20 right-1/4 w-40 h-40 bg-purple-300/15 rounded-full blur-2xl'></div>
          <div className='absolute top-1/2 left-1/4 w-32 h-32 bg-pink-300/15 rounded-full blur-xl'></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className='relative px-4 py-20 sm:px-6 lg:px-8 z-10'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Transform Your Pet Into Amazing <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Emojis</span>
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto'>Upload a photo, get AI-generated pet emojis in seconds. Free, fast, and fun! Create cute emoji versions of your beloved pets instantly.</p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <ScrollButton targetId='upload-section' className='rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-500 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all'>
              Get Started
            </ScrollButton>
          </div>
          <div className='mt-8 flex justify-center items-center space-x-2 text-2xl text-gray-900 '>
            <span>✨ Free</span>
            <span>•</span>
            <span>⚡ Fast</span>
            <span>•</span>
            <span>🎨 Fun</span>
          </div>

      {/* Pet Emoji Generator - 客户端交互组件 */}
      <div className='relative z-10 '>
        <PetEmojiGenerator />
      </div> 
        </div>
      </section>


      {/* Emoji Gallery - Showcase generated emoji packs */}
      <section className='px-4 py-16 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm relative z-10'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Amazing Emoji Pack Showcase</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Discover incredible emoji packs created by other users, get inspired, or share your own creations!</p>
          </div>

          <EmojiGallery initialData={initialEmojis} initialPagination={initialPagination} />
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-16 sm:px-6 lg:px-8 bg-white/60 relative z-10'>
        <div className='mx-auto max-w-4xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>How It Works</h2>
            <p className='mt-4 text-gray-600'>Create amazing pet emojis in just three simple steps</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <article className='text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📱</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Upload Your Pet Photo</h3>
              <p className='text-gray-600'>Simply drag and drop or click to upload a clear photo of your beloved pet. Supports JPG, PNG, and WebP formats up to 5MB.</p>
            </article>

            <article className='text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🎨</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Choose Emoji Style</h3>
              <p className='text-gray-600'>Select from cute, funny, angry, or happy styles to match your pet&apos;s personality. Our AI will generate multiple variations.</p>
            </article>

            <article className='text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>⬇️</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Download & Share</h3>
              <p className='text-gray-600'>Get your AI-generated pet emojis instantly and share them with friends and family. Perfect for social media and messaging apps.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Pet Types Section */}
      <section className='px-4 py-16 sm:px-6 lg:px-8 bg-white/40 relative z-10'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Works With All Pet Types</h2>
            <p className='text-gray-600'>Our AI recognizes and generates emojis for various pets</p>
          </div>
          <div className='grid grid-cols-4 md:grid-cols-8 gap-4 text-center'>
            {['🐕', '🐱', '🐦', '🐰', '🐹', '🐠', '🦎', '🐾'].map((emoji, i) => (
              <div key={i} className='bg-white rounded-xl p-4 shadow-sm'>{emoji}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id='faq' className='px-4 py-16 sm:px-6 lg:px-8 bg-white/60 relative z-10'>
        <div className='mx-auto max-w-3xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>Frequently Asked Questions</h2>
          </div>

          <div className='space-y-6'>
            <article className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>What image formats are supported?</h3>
              <p className='text-gray-600'>We support JPG, PNG, and WebP formats. Maximum file size is 5MB. For best results, use clear photos with your pet facing the camera.</p>
            </article>

            <article className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>How long does it take to generate pet emojis?</h3>
              <p className='text-gray-600'>It typically takes 10-30 seconds to generate your pet emojis using our advanced AI technology. You will receive a 9-panel emoji pack.</p>
            </article>

            <article className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Can I use the generated emojis commercially?</h3>
              <p className='text-gray-600'>Yes, you retain full rights to use the generated emojis for both personal and commercial purposes since they are created from your own pet photos.</p>
            </article>

            <article className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Is there a limit on how many emojis I can generate?</h3>
              <p className='text-gray-600'>To ensure fair access for all users, we limit each user to one emoji generation per hour. This helps us keep the service free while maintaining quality.</p>
            </article>

            <article className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>What types of pets can I create emojis for?</h3>
              <p className='text-gray-600'>Our AI works with dogs, cats, birds, rabbits, hamsters, fish, reptiles, and more. Clear front-facing photos produce the best results.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white px-4 py-12'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid md:grid-cols-3 gap-8 mb-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>Pet Emoji Generator</h3>
              <p className='text-gray-400 text-sm'>
                Transform your pet photos into amazing emojis with AI. Free, fast, and fun for all pet lovers.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li><Link href='/#upload-section' className='hover:text-white'>Create Emojis</Link></li>
                <li><Link href='/#gallery' className='hover:text-white'>Gallery</Link></li>
                <li><Link href='/about' className='hover:text-white'>About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li><Link href='/privacy' className='hover:text-white'>Privacy Policy</Link></li>
                <li><Link href='/terms' className='hover:text-white'>Terms of Service</Link></li>
                <li><Link href='/contact' className='hover:text-white'>Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className='pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} Pet Emoji Generator. All rights reserved.
            </p>
            <p className='text-gray-400 text-sm'>
              Contact: <a href='mailto:zhangningle2017@gmail.com' className='text-blue-400 hover:text-blue-300'>zhangningle2017@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
