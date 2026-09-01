import React, { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        className="py-16 px-4 text-center"
      >
        <p className="text-indigo-200 text-sm uppercase tracking-widest font-semibold mb-2">Get In Touch</p>
        <h1 className="text-4xl font-extrabold text-white mb-3">Contact Support</h1>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          Have a question, complaint, or just want to say hello? Our team is here 24/7 and will get
          back to you within 2–4 hours.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900">We're here to help</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Whether you need help with your order, want to return an item, or simply have a question
            about a product — reach out and we'll resolve it fast.
          </p>

          <div className="space-y-4 mt-2">
            {[
              { icon: <EmailOutlinedIcon className="text-indigo-600" />, label: "Email Us", value: "support@zyrafashion.com" },
              { icon: <PhoneOutlinedIcon className="text-indigo-600" />, label: "Call Us", value: "+91 98765 43210" },
              { icon: <AccessTimeOutlinedIcon className="text-indigo-600" />, label: "Support Hours", value: "Mon – Sat, 9 AM to 8 PM IST" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-slate-50">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-gray-800 font-semibold text-sm mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Follow Us</p>
            <div className="flex gap-3">
              {[
                { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
                { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
                { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center transition-colors border border-indigo-100"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Thank you for reaching out. Our support team will contact you within 2–4 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-6 text-sm text-indigo-600 hover:underline font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>
              <p className="text-gray-400 text-xs mb-4">Fields marked * are required.</p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Order not received"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;