"use client";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black text-white"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400">
        Contact Us
      </h1>

      <form className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          className="px-4 py-3 rounded-md bg-gray-900 text-white focus:outline-cyan-400"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="px-4 py-3 rounded-md bg-gray-900 text-white focus:outline-cyan-400"
        />
        <textarea
          rows="5"
          placeholder="Your Message"
          className="px-4 py-3 rounded-md bg-gray-900 text-white focus:outline-cyan-400"
        ></textarea>
        <button
          type="submit"
          className="bg-cyan-400 text-black px-6 py-3 rounded-md transition hover:brightness-90"
        >
          Send Message
        </button>
      </form>
    </motion.main>
  );
}