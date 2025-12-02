"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function ApplyTalentPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    const payload: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("experience"), // main text -> message
    };

    const experienceText = formData.get("experience");
    if (experienceText) {
      payload.experience = experienceText;
    }

    try {
      const res = await fetch(`${API_URL}/apply/talent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Talent apply failed");
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch (err) {
      console.error("Network error", err);
      setStatus("idle");
    }
  }

  return (
    <div className="stechx-main">
      <section className="stechx-hero" style={{ minHeight: "auto" }}>
        <div className="stechx-hero-left">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>Apply as talent · Join the pool</span>
          </div>

          <h1 className="stechx-hero-title">
            Work with{" "}
            <span className="stechx-hero-highlight">startup founders</span>.
          </h1>

          <p className="stechx-hero-sub">
            Join the StechX talent pool for Web, App, Video, and AI projects.
            You focus on great work—we handle clients and project management.
          </p>

          <p className="stechx-hero-note">
            Remote‑first, project‑based work. Great for builders who like clean,
            Apple‑like products.
          </p>
        </div>

        <aside className="stechx-hero-card">
          <form onSubmit={handleSubmit} className="stechx-contact-form">
            <div className="stechx-contact-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="">
                <option value="" disabled>
                  Choose your main role
                </option>
                <option>Web developer</option>
                <option>App / React Native developer</option>
                <option>Video editor / motion</option>
                <option>AI / automation engineer</option>
                <option>Multidisciplinary</option>
              </select>
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="portfolio">Portfolio links</label>
              <input
                id="portfolio"
                name="portfolio"
                placeholder="Website, GitHub, Behance, Dribbble, etc."
                required
              />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="experience">Experience / skills</label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                placeholder="Share your core skills, tools you use, and any notable projects."
                required
              />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="note">Short note</label>
              <textarea
                id="note"
                name="note"
                rows={3}
                placeholder="Tell us how you like to work and what kind of projects excite you."
              />
            </div>

            <button
              type="submit"
              className="stechx-hero-cta-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                display: "inline-flex",
                alignItems: "center",
                textAlign: "center",
              }}
              disabled={status === "submitting"}
            >
              {status === "submitting"
                ? "Submitting…"
                : "Submit talent application"}
            </button>

            {status === "sent" && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  color: "#7bc9ff",
                }}
              >
                Thanks for applying as talent. StechX will reach out if there’s
                a good match for upcoming projects.
              </p>
            )}
          </form>

          <div style={{ fontSize: "0.8rem", color: "#8a8aa0" }}>
            <div style={{ marginBottom: "4px" }}>How StechX works with talent</div>
            <div>
              We match you with projects that fit your skills and bandwidth.
              Clear scopes, async‑friendly communication, and on‑time payouts.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
