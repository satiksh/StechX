export default function PortfolioPage() {
  const filters = ["All", "Web", "App", "Video", "AI"];

  // Static demo data – later you’ll replace with real projects from the backend
  const projects = [
    {
      title: "LaunchPad Site",
      service: "Web",
      tag: "Web",
      summary: "High-converting launch website for an early-stage SaaS.",
    },
    {
      title: "Founder HQ",
      service: "App",
      tag: "App",
      summary: "Dashboard for tracking MRR, runway, and product metrics.",
    },
    {
      title: "Product Reveal",
      service: "Video",
      tag: "Video",
      summary: "Launch film mixing UI shots and motion graphics.",
    },
    {
      title: "Inbox Copilot",
      service: "AI",
      tag: "AI",
      summary: "AI assistant that triages and drafts replies for support.",
    },
  ];

  return (
    <div className="stechx-main">
      {/* Hero / Intro */}
      <section className="stechx-hero" style={{ minHeight: "auto" }}>
        <div className="stechx-hero-left">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>Portfolio · Selected work</span>
          </div>

          <h1 className="stechx-hero-title">
            Proof that{" "}
            <span className="stechx-hero-highlight">clean builds</span> ship.
          </h1>

          <p className="stechx-hero-sub">
            A few examples of how StechX helps founders move from idea to live
            product across Web, App, Video, and AI.
          </p>

          <p className="stechx-hero-note">
            More detailed case studies will live at{" "}
            <span style={{ color: "#7bc9ff" }}>stechx.in/portfolio/[slug]</span>.
          </p>
        </div>

        <aside className="stechx-hero-card">
          <div>
            <div className="stechx-hero-card-label">What to look for</div>
            <div className="stechx-hero-card-text">
              We focus on clarity, speed, and polish. Each project shows how a
              small team can still ship an Apple-like experience.
            </div>
          </div>

          <div className="stechx-hero-card-grid">
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Services</div>
              <div>Web · App · Video · AI</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Stage</div>
              <div>Mostly zero‑to‑one and early‑growth startups</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Focus</div>
              <div>Fast shipping with clean, minimal visuals</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Location</div>
              <div>India‑based, remote‑first</div>
            </div>
          </div>
        </aside>
      </section>

      {/* Filters + Grid */}
      <section style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Selected projects
          </h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                style={{
                  borderRadius: 999,
                  border: f === "All" ? "1px solid #4f8cff" : "1px solid #262632",
                  padding: "5px 12px",
                  fontSize: "0.8rem",
                  background:
                    f === "All"
                      ? "linear-gradient(135deg, #4f8cff, #7bc9ff)"
                      : "transparent",
                  color: f === "All" ? "#050509" : "#d7d7e0",
                  cursor: "default",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {projects.map((project) => (
            <a
              key={project.title}
              href={`/portfolio/${encodeURIComponent(
                project.title.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="stechx-hero-card-item"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "grid",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#8a8aa0",
                }}
              >
                {project.tag}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {project.title}
              </div>
              <div
                style={{
                  fontSize: "0.86rem",
                  color: "#c1c1cf",
                }}
              >
                {project.summary}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#7bc9ff",
                  marginTop: "2px",
                }}
              >
                View case study →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "48px" }}>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "12px",
          }}
        >
          Want your launch here next?
        </h2>
        <p
          style={{
            fontSize: "0.94rem",
            color: "#c1c1cf",
            maxWidth: "32rem",
            marginBottom: "18px",
          }}
        >
          If you’re planning a new product, rebrand, or MVP, StechX can help you
          ship something you’re proud to show on this page.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/apply/client" className="stechx-hero-cta-primary">
            Start a project
          </a>
          <a href="/contact" className="stechx-hero-cta-secondary">
            Talk to StechX
          </a>
        </div>
      </section>
    </div>
  );
}
