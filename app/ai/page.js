"use client";
import { motion } from "framer-motion";

export default function AIPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black text-white"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400">
        S‑TECHX Synapse AI
      </h1>
      <p className="text-gray-400 max-w-2xl mb-8">
        The AI brain that Consults, Creates, and Automates. 
        Build ideas and workflows with a single command.
      </p>
      <button className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-md hover:bg-cyan-400 hover:text-black transition">
        Get Started with Synapse
      </button>
    </motion.main>
  );
}