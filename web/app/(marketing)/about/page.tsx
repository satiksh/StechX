"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="stechx-main">
      {/* Hero Section */}
      <section className="stechx-about-hero">
        <div className="stechx-about-hero-content">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>About STech-X • Mission • Vision • Values</span>
          </div>
          
          <h1 className="stechx-about-title">
            Empowering startups with{" "}
            <span className="stechx-hero-highlight">world-class</span>{" "}
            tech talent.
          </h1>
          
          <p className="stechx-about-subtitle">
            STech-X bridges the gap between innovative startups and top-tier freelancers, 
            creating a transparent marketplace where quality meets efficiency.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="stechx-about-founder">
        <div className="stechx-about-founder-card">
          <div className="stechx-about-founder-image">
            <Image
              src="/images/satiksh.jpeg"
              alt="Satiksh Patel"
              fill
              className="stechx-founder-img"
              priority
            />
          </div>

          <div className="stechx-about-founder-info">
            <div className="stechx-founder-badge">Founder & CEO</div>
            
            <h2 className="stechx-founder-name">Satiksh Patel</h2>
            
            <p className="stechx-founder-bio">
              Visionary entrepreneur and tech enthusiast dedicated to bridging the gap between 
              innovative startups and world-class technology solutions. With a passion for 
              building scalable platforms, Satiksh founded STech-X to create a transparent 
              marketplace connecting clients with top-tier freelancers and agencies.
            </p>

            {/* Social Links */}
            <div className="stechx-founder-socials">
              <Link
                href="https://www.instagram.com/satiksh_?igsh=emRqNDFuMG1sNW1h"
                target="_blank"
                rel="noopener noreferrer"
                className="stechx-social-btn stechx-social-instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </Link>

              <Link
                href="https://www.linkedin.com/in/satikshpatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="stechx-social-btn stechx-social-linkedin"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </Link>

              <Link
                href="https://github.com/satiksh"
                target="_blank"
                rel="noopener noreferrer"
                className="stechx-social-btn stechx-social-github"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Link>

              <Link
                href="mailto:satikshpatel8@gmail.com"
                className="stechx-social-btn stechx-social-email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="stechx-about-values">
        <div className="stechx-values-grid">
          <div className="stechx-value-card">
            <div className="stechx-value-icon stechx-value-icon-blue">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="stechx-value-title">Our Mission</h3>
            <p className="stechx-value-text">
              To revolutionize how startups and agencies collaborate by creating a transparent, 
              secure, and efficient marketplace for technology services.
            </p>
          </div>

          <div className="stechx-value-card">
            <div className="stechx-value-icon stechx-value-icon-green">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="stechx-value-title">Our Vision</h3>
            <p className="stechx-value-text">
              To become the most trusted platform where innovation meets execution, 
              empowering both clients and service providers to achieve their goals.
            </p>
          </div>

          <div className="stechx-value-card">
            <div className="stechx-value-icon stechx-value-icon-purple">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="stechx-value-title">Our Values</h3>
            <p className="stechx-value-text">
              Transparency, quality, and trust are at the core of everything we do. 
              We believe in fair practices and mutual success.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="stechx-about-cta">
        <div className="stechx-cta-card">
          <h2 className="stechx-cta-title">
            Ready to Start Your Journey?
          </h2>
          <p className="stechx-cta-subtitle">
            Join STech-X today and experience the future of tech collaboration
          </p>
          <div className="stechx-cta-buttons">
            <Link href="/auth/register?role=CLIENT" className="stechx-cta-btn-primary">
              Get Started
            </Link>
            <Link href="/auth/register?role=FREELANCER" className="stechx-cta-btn-secondary">
              Join as Freelancer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}