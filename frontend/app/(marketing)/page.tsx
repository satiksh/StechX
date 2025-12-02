export default function HomePage() {
  return (
    <div className="stechx-hero">
      <section className="stechx-hero-left">
        <div className="stechx-hero-pill">
          <span className="stechx-hero-pill-dot" />
          <span>Startup for Startups • Web · App · Video · AI</span>
        </div>

        <h1 className="stechx-hero-title">
          Your startup’s{" "}
          <span className="stechx-hero-highlight">full‑stack growth</span>{" "}
          partner.
        </h1>

        <p className="stechx-hero-sub">
          StechX builds high‑converting websites, MVP apps, launch videos, and
          AI automation so early‑stage founders can move from idea to launch
          faster.
        </p>

        <div className="stechx-hero-ctas">
          <a href="/apply/client" className="stechx-hero-cta-primary">
            Get a Service
          </a>
          <a href="/apply/talent" className="stechx-hero-cta-secondary">
            Get Hired
          </a>
        </div>

        <p className="stechx-hero-note">
          No spam, no pressure. Just clear next steps for your launch.
        </p>
      </section>

      <aside className="stechx-hero-card">
        <div>
          <div className="stechx-hero-card-label">StechX Focus</div>
          <div className="stechx-hero-card-text">
            Zero‑to‑one startups that need a{" "}
            <span className="stechx-hero-link">single team</span> for product,
            brand, and launch.
          </div>
        </div>

        <div className="stechx-hero-card-grid">
          <div className="stechx-hero-card-item">
            <div className="stechx-hero-card-item-label">Services</div>
            <div>Web · App · Video · AI</div>
          </div>
          <div className="stechx-hero-card-item">
            <div className="stechx-hero-card-item-label">For</div>
            <div>Early‑stage founders &amp; small teams</div>
          </div>
          <div className="stechx-hero-card-item">
            <div className="stechx-hero-card-item-label">Style</div>
            <div>Clean, Apple‑like, conversion‑focused</div>
          </div>
          <div className="stechx-hero-card-item">
            <div className="stechx-hero-card-item-label">Location</div>
            <div>India‑based, remote‑first</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
