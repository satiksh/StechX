"use client";

import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ApplyTalentPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    // Must match talentApplicationSchema exactly
    const payload: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("brief"),
    };

    const experience = formData.get("experience");
    if (experience && String(experience).trim().length > 0) {
      payload.experience = experience;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/apply/talent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Talent apply failed", await res.text());
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
            <span>Apply as talent · Join StechX network</span>
          </div>

          <h1 className="stechx-hero-title">
            Join the{" "}
            <span className="stechx-hero-highlight">StechX builder network</span>.
          </h1>

          <p className="stechx-hero-sub">
            Tell us who you are, what you build, and the kind of projects you
            want. We'll match you with the right StechX clients.
          </p>

          <p className="stechx-hero-note">
            Ideal for developers, designers, and video/AI creators who like
            fast, focused projects.
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
              <label htmlFor="experience">Experience / Stack</label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                placeholder="Share your core skills, years of experience, and recent projects."
              />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="brief">Why StechX / Ideal projects</label>
              <textarea
                id="brief"
                name="brief"
                rows={4}
                placeholder="Tell us what kind of work you enjoy, and what kind of clients you like working with."
                required
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
                Thanks for applying as talent. StechX will get in touch if
                there's a good fit.
              </p>
            )}
          </form>

          <div style={{ fontSize: "0.8rem", color: "#8a8aa0" }}>
            <div style={{ marginBottom: "4px" }}>What happens next?</div>
            <div>
              We'll review your skills and reach out for a short intro call
              if there's a match with upcoming projects.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}