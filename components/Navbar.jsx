"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="S‑TECHX" className="w-8" />
        <span className="font-semibold text-white">S‑TECHX</span>
      </Link>

      <div className="flex gap-6 text-sm md:text-base">
        <Link href="/services" className="hover:text-cyan-400">Services</Link>
        <Link href="/ai" className="hover:text-cyan-400">AI</Link>
        <Link href="/contact" className="hover:text-cyan-400">Contact</Link>
      </div>
    </nav>
  );
}