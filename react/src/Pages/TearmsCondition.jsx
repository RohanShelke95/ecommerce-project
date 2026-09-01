import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the ZYRA Fashion website (zyrafashion.com), you agree to be bound by these Terms & Conditions. If you do not agree to any part of these terms, please do not use our website. We reserve the right to update these terms at any time without prior notice.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to register and shop on ZYRA Fashion. By creating an account, you confirm that:
• You are 18 years or older, or using the site under adult supervision.
• The information you provide is accurate and current.
• You are responsible for maintaining the confidentiality of your login credentials.`,
  },
  {
    title: "3. Product Listings & Pricing",
    content: `• All product descriptions, images, and prices are provided in good faith but may contain errors.
• Prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.
• ZYRA Fashion reserves the right to modify prices without prior notice.
• In case of a pricing error, we will notify you before processing your order and offer a cancellation option.`,
  },
  {
    title: "4. Orders & Payments",
    content: `• Placing an item in your cart does not guarantee its availability.
• Orders are confirmed only after successful payment processing.
• We accept payments via UPI, Credit/Debit Cards, Net Banking through Razorpay, and Cash on Delivery (COD) for eligible pin codes.
• COD orders carry a convenience fee of ₹49 for orders under ₹500.
• ZYRA Fashion reserves the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud.`,
  },
  {
    title: "5. Shipping & Delivery",
    content: `• Free shipping on all orders above ₹1000. Orders below ₹1000 carry a flat shipping fee of ₹59.
• Standard delivery takes 5–7 business days. Express delivery (2–3 days) may be available for select pin codes.
• Delivery timelines are estimates and not guarantees. Delays due to natural disasters, strikes, or logistic disruptions are beyond our control.
• You are responsible for providing an accurate delivery address. ZYRA Fashion is not liable for failed deliveries due to incorrect address information.`,
  },
  {
    title: "6. Returns & Refunds",
    content: `• You may return most items within 30 days of delivery in original, unused condition with all tags intact.
• Items that are worn, washed, damaged, or missing tags are not eligible for return.
• Refunds are processed within 5–7 business days after we receive and inspect the returned item.
• Refunds are credited to the original payment method. COD refunds are issued as store credits or bank transfer.
• Certain items such as innerwear, swimwear, and sale items marked "Final Sale" are not eligible for return.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on ZYRA Fashion — including logos, images, product descriptions, and design — is the intellectual property of ZYRA Fashion and is protected by applicable copyright and trademark laws. You may not copy, reproduce, distribute, or use our content without written permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `ZYRA Fashion shall not be liable for:
• Any indirect, incidental, or consequential damages arising from use of our website or products.
• Loss of data, profits, or business interruption.
• Errors or inaccuracies in product descriptions or pricing.
Our maximum liability in any case shall not exceed the amount paid for the product in question.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra. If any provision of these terms is found to be invalid, the remaining provisions shall remain in full force and effect.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about these Terms & Conditions, please contact us:\n• Email: support@zyrafashion.com\n• Phone: +91 98765 43210\n• Hours: Monday – Saturday, 9 AM to 8 PM IST`,
  },
];

const TearmsCondition = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        className="py-16 px-4 text-center"
      >
        <p className="text-indigo-200 text-sm uppercase tracking-widest font-semibold mb-2">Legal</p>
        <h1 className="text-4xl font-extrabold text-white mb-3">Terms & Conditions</h1>
        <p className="text-indigo-100 text-sm">Last updated: September 1, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-10">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Please read carefully.</strong> By using ZYRA Fashion, you agree to these terms.
            These terms govern your use of our website, products, and services.
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
            Need help understanding our policies?
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

export default TearmsCondition;