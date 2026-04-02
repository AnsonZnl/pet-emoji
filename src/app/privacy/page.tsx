import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Pet Emoji Generator",
  description: "Privacy Policy for Pet Emoji Generator. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p><strong>Photos you upload:</strong> Your pet images are processed temporarily by our AI service. Original photos are not stored permanently after emoji generation.</p>
          <p><strong>Automatically collected:</strong> We may collect IP address, browser type, and usage data through cookies and analytics services.</p>

          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our emoji generation service</li>
            <li>To improve user experience and service quality</li>
            <li>To display shared emojis in our public gallery (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Cookies and Google Services</h2>
          <p>We use Google Analytics to understand how visitors use our site. We also use Google AdSense for advertising. Google may use cookies to serve ads based on your visits. You can opt out at <a href="https://www.google.com/settings/ads" className="text-purple-600 hover:underline">Google Ads Settings</a>.</p>

          <h2 className="text-xl font-semibold text-gray-900">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with service providers who assist in operating our site, or when required by law.</p>

          <h2 className="text-xl font-semibold text-gray-900">5. Data Security</h2>
          <p>We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>

          <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
          <p>You may request access to, correction, or deletion of your personal data. Contact us at <a href="mailto:zhangningle2017@gmail.com" className="text-purple-600 hover:underline">zhangningle2017@gmail.com</a>.</p>

          <h2 className="text-xl font-semibold text-gray-900">7. Contact</h2>
          <p>For privacy concerns, contact: <a href="mailto:zhangningle2017@gmail.com" className="text-purple-600 hover:underline">zhangningle2017@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
