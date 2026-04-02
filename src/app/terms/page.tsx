import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Pet Emoji Generator",
  description: "Terms of Service for Pet Emoji Generator. Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p>By using Pet Emoji Generator, you agree to these terms. If you do not agree, please do not use our service.</p>

          <h2 className="text-xl font-semibold text-gray-900">2. Service Description</h2>
          <p>Pet Emoji Generator provides an AI-powered tool that transforms uploaded pet photos into emoji-style images. You may generate one emoji pack per hour per user.</p>

          <h2 className="text-xl font-semibold text-gray-900">3. User Responsibilities</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-6">
            <li>Upload photos of humans, celebrities, or non-owned pets</li>
            <li>Upload content containing nudity, violence, or illegal material</li>
            <li>Use automated bots or scripts to abuse the service</li>
            <li>Attempt to reverse engineer our AI technology</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">4. Intellectual Property</h2>
          <p><strong>Your photos:</strong> You retain ownership of photos you upload and represent that you have rights to use them.</p>
          <p><strong>Generated emojis:</strong> You may use generated emojis for personal and commercial purposes. Our AI technology and brand remain our property.</p>

          <h2 className="text-xl font-semibold text-gray-900">5. Disclaimer</h2>
          <p>The service is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted access or specific results.</p>

          <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p>We are not liable for any indirect, incidental, or consequential damages arising from use of the service.</p>

          <h2 className="text-xl font-semibold text-gray-900">7. Changes to Terms</h2>
          <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

          <h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
          <p>Questions? Contact us at <a href="mailto:zhangningle2017@gmail.com" className="text-purple-600 hover:underline">zhangningle2017@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
