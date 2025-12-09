"use client";

import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://stechx.onrender.com";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim() || undefined,
      need: String(formData.get("need") || "").trim() || undefined,
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        setError("Could not send. Please try again.");
        return;
      }

      setStatus("sent");
      e.currentTarget.reset();
    } catch (err) {
      console.error("Network error", err);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="stechx-main">
      <section className="stechx-hero" style={{ minHeight: "auto" }}>
        <div className="stechx-hero-left">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>Contact · Simple, friendly form</span>
          </div>

          <h1 className="stechx-hero-title">
            Tell us about{" "}
            <span className="stechx-hero-highlight">your startup</span>.
          </h1>

          <p className="stechx-hero-sub">
            Share a few details about what you’re building. StechX will reply
            with clear next steps—no spam, no pressure.
          </p>

          <p className="stechx-hero-note">
            Typical response time: within 24–48 hours on weekdays.
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
              <label htmlFor="company">Startup / Company</label>
              <input id="company" name="company" />
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="need">What do you need?</label>
              <select id="need" name="need" defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option>Website / Landing page</option>
                <option>Web or mobile app</option>
                <option>Video / Launch creative</option>
                <option>AI automation / chatbot</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Share a short overview of your product, timeline, and budget."
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
              {status === "submitting" ? "Sending…" : "Send message to StechX"}
            </button>

            {status === "sent" && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  color: "#7bc9ff",
                }}
              >
                Thanks for reaching out. We’ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  color: "#ff6b6b",
                }}
              >
                {error || "Could not send. Please try again."}
              </p>
            )}
          </form>

          <div style={{ fontSize: "0.8rem", color: "#8a8aa0" }}>
            <div style={{ marginBottom: "4px" }}>Prefer a quick call?</div>
            <div>Share your details here and we’ll suggest a time slot.</div>
          </div>
        </aside>
      </section>
    </div>
  );
}