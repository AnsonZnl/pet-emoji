import PetEmojiGenerator from '@/components/PetEmojiGenerator';
import ScrollButton from '@/components/ScrollButton';

// 结构化数据用于SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pet Emoji Generator",
  "description": "AI-powered pet emoji generator that transforms your pet photos into adorable emojis",
  "url": "https://pet-emoji.com",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "Pet Emoji Generator"
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transform Your Pet Into Amazing{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Emojis
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Upload a photo, get AI-generated pet emojis in seconds. Free, fast, and fun! 
            Create cute emoji versions of your beloved pets instantly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <ScrollButton
              targetId="upload-section"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-500 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all"
            >
              Get Started
            </ScrollButton>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-2 text-sm text-gray-500">
            <span>✨ Free</span>
            <span>•</span>
            <span>⚡ Fast</span>
            <span>•</span>
            <span>🎨 Fun</span>
          </div>
        </div>
      </section>

      {/* Pet Emoji Generator - 客户端交互组件 */}
      <PetEmojiGenerator />

      {/* Features Section - 静态内容，SEO友好 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-600">
              Create amazing pet emojis in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="mobile phone">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Pet Photo</h3>
              <p className="text-gray-600">
                Simply drag and drop or click to upload a clear photo of your beloved pet. 
                Supports JPG, PNG, and WebP formats up to 5MB.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="art palette">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Emoji Style</h3>
              <p className="text-gray-600">
                Select from cute, funny, angry, or happy styles to match your pet&apos;s personality. 
                Our AI will generate multiple variations.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="download">⬇️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Share</h3>
              <p className="text-gray-600">
                Get your AI-generated pet emojis instantly and share them with friends and family. 
                Perfect for social media and messaging apps.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Section - 静态内容，SEO友好 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            <article>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What image formats are supported?
              </h3>
              <p className="text-gray-600">
                We support JPG, PNG, and WebP formats. Maximum file size is 5MB for optimal processing speed.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does it take to generate pet emojis?
              </h3>
              <p className="text-gray-600">
                It typically takes 10-30 seconds to generate your pet emojis using our advanced AI technology.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are my photos stored on your servers?
              </h3>
              <p className="text-gray-600">
                No, your photos are only temporarily processed and automatically deleted within 24 hours for your privacy and security.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use the generated emojis commercially?
              </h3>
              <p className="text-gray-600">
                Yes, you can use the generated emojis for personal and commercial purposes as they are created from your own pet photos.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What makes this pet emoji generator special?
              </h3>
              <p className="text-gray-600">
                Our AI is specifically trained for pet emoji generation, ensuring high-quality results that capture your pet&apos;s unique characteristics and personality.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer - 静态内容，SEO友好 */}
      <footer className="bg-gray-900 text-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Pet Emoji Generator</h3>
            <p className="text-gray-400 mb-8">
              Transform your pet photos into amazing emojis with AI technology. 
              Free, fast, and fun for all pet lovers worldwide.
            </p>
            
            <nav className="flex justify-center space-x-8 text-sm mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
              <p>© 2024 Pet Emoji Generator. All rights reserved.</p>
              <p className="mt-2">Made with ❤️ for pet lovers everywhere</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
