import React from "react";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const stats = [
  { label: "Happy Customers", value: "50,000+" },
  { label: "Products Listed", value: "10,000+" },
  { label: "Cities Delivered", value: "500+" },
  { label: "Years in Fashion", value: "5+" },
];

const values = [
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 36 }} className="text-indigo-600" />,
    title: "Quality First",
    desc: "Every product on ZYRA Fashion is hand-picked and quality-checked before listing, so you always get the best.",
  },
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 36 }} className="text-indigo-600" />,
    title: "Fast & Free Delivery",
    desc: "Orders above ₹1000 ship for free across 500+ cities in India, delivered right to your doorstep.",
  },
  {
    icon: <StarBorderIcon sx={{ fontSize: 36 }} className="text-indigo-600" />,
    title: "Trusted by Thousands",
    desc: "With over 50,000 happy shoppers and 4.8★ average rating, ZYRA Fashion is the brand you can trust.",
  },
  {
    icon: <PeopleOutlineIcon sx={{ fontSize: 36 }} className="text-indigo-600" />,
    title: "Community Driven",
    desc: "We listen to our customers. Your reviews and feedback shape the collections we curate every season.",
  },
];

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        className="py-20 px-4 text-center"
      >
        <p className="text-indigo-200 text-sm uppercase tracking-widest font-semibold mb-3">
          Our Story
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          About <span className="text-purple-200">ZYRA Fashion</span>
        </h1>
        <p className="text-indigo-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          We started ZYRA Fashion with one simple belief — everyone deserves to look and feel
          amazing without breaking the bank. Premium styles, honest prices, delivered with love.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-indigo-600">{s.value}</span>
              <span className="text-sm text-gray-500 mt-1 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">Our Mission</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-snug">
            Fashion that empowers every individual
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
            At ZYRA Fashion, we believe clothing is more than fabric — it's expression. We curate
            collections across Women's, Men's, and Kids' wear that balance traditional Indian aesthetics
            with modern trends.
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            From elegant sarees and kurtas to casual western wear, our catalogue is built to celebrate
            every style, every occasion, and every budget.
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-indigo-100">
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "3rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ZYRA
          </span>
          <span className="text-xs font-semibold tracking-widest text-purple-500 uppercase mt-1">fashion</span>
          <p className="text-gray-500 text-sm mt-4 italic">
            "Style is a way to say who you are without having to speak."
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">What We Stand For</p>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="mt-1 flex-shrink-0">{v.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Ready to explore?</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Discover thousands of curated styles across all categories. New arrivals every week!
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default About;