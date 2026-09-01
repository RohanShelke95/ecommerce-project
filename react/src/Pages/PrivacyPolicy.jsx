import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Information We Collect",
    content: `When you register or place an order on ZYRA Fashion, we collect the following information:
• Personal details: Name, email address, phone number, and date of birth.
• Delivery information: Shipping address, city, state, and PIN code.
• Payment information: We do not store card details. Payments are processed securely via Razorpay.
• Device & usage data: IP address, browser type, pages visited, and time spent on our site (collected automatically via cookies).`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Process and fulfill your orders and send order confirmations.
• Communicate about order status, shipping updates, and returns.
• Personalize your shopping experience and recommend products.
• Send promotional emails and offers (you may unsubscribe at any time).
• Improve our website and services based on usage patterns.
• Comply with legal obligations and resolve disputes.`,
  },
  {
    title: "3. Cookies & Tracking",
    content: `ZYRA Fashion uses cookies to:
• Keep you logged in across sessions.
• Remember your cart and wishlist items.
• Understand how you use our website to improve performance.
• Show relevant advertisements on third-party platforms.

You can disable cookies in your browser settings; however, some features of the site may not function correctly without them.`,
  },
  {
    title: "4. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your data only with:
• Logistics partners (e.g., Delhivery, Bluedart) to fulfill deliveries.
• Payment processors (Razorpay) for secure transaction handling.
• Analytics services (e.g., Google Analytics) in anonymized form.
• Legal authorities if required by law or court order.`,
  },
  {
    title: "5. Data Security",
    content: `We take reasonable measures to protect your personal information:
• All data transmission is encrypted via SSL/TLS.
• Sensitive payment data is handled entirely by Razorpay (PCI-DSS compliant).
• We regularly review our data collection and storage practices.
• Access to your data is restricted to authorized personnel only.

Despite our best efforts, no method of internet transmission is 100% secure. We encourage you to use strong passwords and log out after each session.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:
• Access the personal data we hold about you.
• Request correction of inaccurate information.
• Request deletion of your account and associated data.
• Opt out of marketing emails at any time via the unsubscribe link.
• Lodge a complaint with the relevant data protection authority.

To exercise any of these rights, contact us at support@zyrafashion.com.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services. Order records are retained for 7 years as required by Indian tax law. You may request account deletion at any time, after which your data will be anonymized or deleted within 30 days, except where retention is legally required.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page and notify registered users by email. We encourage you to review this policy periodically to stay informed about how we protect your information.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        className="py-16 px-4 text-center"
      >
        <p className="text-indigo-200 text-sm uppercase tracking-widest font-semibold mb-2">Legal</p>
        <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
        <p className="text-indigo-100 text-sm">Last updated: September 1, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-10">
          <p className="text-indigo-700 text-sm leading-relaxed">
            <strong>Your privacy matters to us.</strong> This policy explains how ZYRA Fashion
            collects, uses, and protects your personal information when you use our website and
            services. Please read it carefully.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-50 rounded-2xl p-6 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Have questions about our privacy practices?
          </p>
          <Link
            to="/contact"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;