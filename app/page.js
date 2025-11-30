"use client";                       // enable client‑side animation
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      /* --- animation settings --- */
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      /* --- layout styling --- */
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center text-center px-4"
    >
      {/* glowing logo */}
      <div className="mb-8">
        <img
          src="/logo.png"
          alt="S‑TECHX Logo"
          className="w-32 md:w-48 drop-shadow-[0_0_25px_#00ffff]"
        />
      </div>

      {/* headline */}
      <h1 className="text-4xl md:text-6xl font-semibold">
        Engineering <span className="text-cyan-400">Tomorrow</span>
      </h1>

      {/* subline */}
      <p className="text-gray-400 mt-4 max-w-xl">
        Web • App • Video Studio • AI Automation
      </p>

      {/* buttons */}
      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <a
          href="/services"
          className="bg-cyan-400 text-black font-medium px-6 py-3 rounded-md transition hover:brightness-90"
        >
          Explore Services
        </a>
        <a
          href="/ai"
          className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-md transition hover:bg-cyan-400 hover:text-black"
        >
          Get Started with AI
        </a>
      </div>

      {/* footer */}
      <footer className="absolute bottom-4 text-sm text-gray-600">
        © 2024 S‑TECHX | Built with Next.js & Tailwind CSS
      </footer>
    </motion.main>
  );
}