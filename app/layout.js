import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // import your Navbar component

// keep your fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// update meta info
export const metadata = {
  title: "S‑TECHX | Engineering Tomorrow",
  description: "Futuristic web, video, and AI automation by S‑TECHX.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >
        {/* global navigation bar */}
        <Navbar />

        {/* page content */}
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}