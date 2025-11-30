"use client";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black text-white"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400">
        Our Freelance Services
      </h1>
      <p className="max-w-2xl text-gray-400 mb-10">
        Web Design • App Development • Video Editing • AI Automation Solutions
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Web Development</h2>
          <p className="text-gray-400">
            Responsive Next.js sites optimized for speed and SEO.
          </p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Video Editing & Branding</h2>
          <p className="text-gray-400">
            Cinematic graphics and motion design for businesses and startups.
          </p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">
            AI Automation
          </h2>
          <p className="text-gray-400">
            Workflow bots and AI assistants to automate daily tasks.
          </p>
        </div>
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Startup Consultancy</h2>
          <p className="text-gray-400">
            Tech strategy and brand growth solutions for founders.
          </p>
        </div>
      </div>
    </motion.main>
  );
}