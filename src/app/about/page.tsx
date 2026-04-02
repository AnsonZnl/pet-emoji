import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Pet Emoji Generator",
  description: "Learn about Pet Emoji Generator, our mission, and how we help pet lovers create adorable emojis.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero */}
      <section className="px-4 py-16 bg-white/60">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pet Emoji Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We believe every pet deserves to be celebrated. Our AI-powered tool transforms your beloved companions into adorable emojis.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-600 mb-4">
              Pet Emoji Generator was created to solve a simple problem: generic emojis do not capture the unique personality of your pet.
            </p>
            <p className="text-gray-600 mb-4">
              Our team built an AI specifically trained on pet images to generate recognizable, adorable emoji packs from any pet photo. Upload a photo, choose a style, and get your emoji pack in seconds.
            </p>
            <p className="text-gray-600">
              We launched with a simple promise: make it free, make it easy, and make the results actually look good. Join thousands of pet owners creating emojis they love.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Technology</h3>
              <p className="text-gray-600 text-sm">Our AI understands pet features to create recognizable emoji versions.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">4 Unique Styles</h3>
              <p className="text-gray-600 text-sm">Choose from Cute, Funny, Angry, and Happy styles to match your pet&apos;s personality.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Results</h3>
              <p className="text-gray-600 text-sm">Get your emoji pack in 10-30 seconds. No complicated processes.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">Your photos are processed temporarily and never stored permanently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">Have questions, feedback, or suggestions? We would love to hear from you.</p>
          <a href="mailto:zhangningle2017@gmail.com" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
            zhangningle2017@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Pet Emoji Generator. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms</a>
            <a href="mailto:zhangningle2017@gmail.com" className="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
