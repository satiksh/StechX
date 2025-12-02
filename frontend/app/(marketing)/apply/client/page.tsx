"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function mapBudgetToNumber(label: FormDataEntryValue | null): number | undefined {
  if (!label) return undefined;
  const value = String(label);
  if (value.startsWith("Below")) return 500; // < $1k
  if (value.startsWith("$1k – $3k")) return 2000;
  if (value.startsWith("$3k – $7k")) return 5000;
  if (value.startsWith("$7k – $15k")) return 10000;
  if (value.startsWith("$15k+")) return 20000;
  return undefined;
}

export default function ApplyClientPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    const payload: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("brief"), // map brief -> message
      // serviceId is optional and we skip it for now
    };

    const budgetNumber = mapBudgetToNumber(formData.get("budget"));
    if (budgetNumber !== undefined) {
      payload.budget = budgetNumber;
    }

    try {
      const res = await fetch(`${API_URL}/apply/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Client apply failed");
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
            <span>Apply as client · Start a project</span>
          </div>

          <h1 className="stechx-hero-title">
            Start a{" "}
            <span className="stechx-hero-highlight">StechX project</span>.
          </h1>

          <p className="stechx-hero-sub">
            Tell StechX what you are building, your rough budget, and timing.
            You’ll get a clear, simple plan—not a 20‑page proposal.
          </p>

          <p className="stechx-hero-note">
            Ideal for early‑stage founders and small teams who want a single
            partner for Web, App, Video, and AI.
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
              <label htmlFor="service">Service interest</label>
              <select id="service" name="service" defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option>Website / Landing page</option>
                <option>Web or mobile app</option>
                <option>Video / Launch creative</option>
                <option>AI automation / chatbot</option>
                <option>Multiple services</option>
              </select>
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="budget">Budget range (USD)</label>
              <select id="budget" name="budget" defaultValue="">
                <option value="" disabled>
                  Choose range
                </option>
                <option>Below $1k (very early)</option>
                <option>$1k – $3k</option>
                <option>$3k – $7k</option>
                <option>$7k – $15k</option>
                <option>$15k+</option>
              </select>
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="timeline">Timeline</label>
              <select id="timeline" name="timeline" defaultValue="">
                <option value="" disabled>
                  Choose timeline
                </option>
                <option>As soon as possible</option>
                <option>Within 1 month</option>
                <option>1–3 months</option>
                <option>3+ months / just exploring</option>
              </select>
            </div>

            <div className="stechx-contact-field">
              <label htmlFor="brief">Project brief</label>
              <textarea
                id="brief"
                name="brief"
                rows={4}
                placeholder="Share a quick overview of your product, target users, and what success looks like."
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
                : "Submit client application"}
            </button>

            {status === "sent" && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  color: "#7bc9ff",
                }}
              >
                Thanks for applying as a client. StechX will reply with next
                steps soon.
              </p>
            )}
          </form>

          <div style={{ fontSize: "0.8rem", color: "#8a8aa0" }}>
            <div style={{ marginBottom: "4px" }}>What happens next?</div>
            <div>
              You’ll get an email with a simple breakdown of scope, timelines,
              and an optional call slot.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
