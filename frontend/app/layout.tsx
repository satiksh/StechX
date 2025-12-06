import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StechX – Full-Stack Growth Partner",
  description: "Web, app, video, and AI services for startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} stechx-body`}
      >
        <header className="stechx-nav">
          <div className="stechx-nav-inner">
            <Link href="/" className="stechx-brand">
              <div className="stechx-logo-box">
                <Image
                  src="/stxlogo.png"
                  alt="StechX logo"
                  fill
                  className="stechx-logo-img"
                />
              </div>
              <span className="stechx-brand-text">StechX</span>
            </Link>

            <input
              id="stechx-nav-toggle"
              type="checkbox"
              className="stechx-nav-toggle"
            />
            <label htmlFor="stechx-nav-toggle" className="stechx-burger">
              <span />
              <span />
              <span />
            </label>

            <nav className="stechx-nav-links">
              <Link href="/services">Services</Link>
              <Link href="/portfolio">Portfolio</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/about">About</Link>
              <div className="stechx-nav-divider" />
              <Link href="/apply/client" className="stechx-nav-primary">
                Get a Service
              </Link>
              <Link href="/apply/talent" className="stechx-nav-secondary">
                Get Hired
              </Link>
            </nav>
          </div>
        </header>

        <main className="stechx-main">{children}</main>
      </body>
    </html>
  );
}