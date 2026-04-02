import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - Pet Emoji Generator",
  description: "Contact the Pet Emoji Generator team for questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero */}
      <section className="px-4 py-16 bg-white/60">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-gray-600">
            We would love to hear from you! Send us a message anytime.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="you@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="How can we help?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Your message..."></textarea>
              </div>
              
              <a href="mailto:zhangningle2017@gmail.com?subject=Pet%20Emoji%20Generator%20Inquiry" className="block w-full text-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                Send Email
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Or email us directly:</p>
            <a href="mailto:zhangningle2017@gmail.com" className="text-purple-600 hover:text-purple-700 font-medium">
              zhangningle2017@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How do I report a bug?</h3>
              <p className="text-gray-600 text-sm">Email us with details about the issue, including your browser and steps to reproduce.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I request a new feature?</h3>
              <p className="text-gray-600 text-sm">Absolutely! We are always looking to improve. Send us your ideas.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How long until you respond?</h3>
              <p className="text-gray-600 text-sm">We typically respond within 24-48 hours on business days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Pet Emoji Generator. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
            <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
