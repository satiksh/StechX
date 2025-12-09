const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getServices() {
  try {
    const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="stechx-main">
      <section className="stechx-hero" style={{ minHeight: "auto" }}>
        <div className="stechx-hero-left">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>Services · Web · App · Video · AI</span>
          </div>

          <h1 className="stechx-hero-title">
            Services for{" "}
            <span className="stechx-hero-highlight">fast‑moving startups</span>.
          </h1>

          <p className="stechx-hero-sub">
            StechX gives you one team for website, product UI, launch videos,
            and AI automation—so you don't have to juggle four different
            agencies for a single launch.
          </p>

          <div className="stechx-hero-ctas">
            <a href="/apply/client" className="stechx-hero-cta-primary">
              Start a project
            </a>
            <a href="/contact" className="stechx-hero-cta-secondary">
              Talk to StechX
            </a>
          </div>

          <p className="stechx-hero-note">
            Simple, friendly onboarding. We focus on clear timelines, budget,
            and scope from day one.
          </p>
        </div>

        <aside className="stechx-hero-card">
          <div>
            <div className="stechx-hero-card-label">How we work</div>
            <div className="stechx-hero-card-text">
              We run short, focused sprints. You always know what's in this
              week's build and what's coming next.
            </div>
          </div>

          <div className="stechx-hero-card-grid">
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">01 · Discover</div>
              <div>Understand your product, audience, and launch goals.</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">02 · Design</div>
              <div>Wireframes, visual direction, and copy that fits your brand.</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">03 · Build</div>
              <div>Implement, test, and refine across Web, App, Video, and AI.</div>
            </div>
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">04 · Launch</div>
              <div>Ship, monitor, and iterate with a clear next‑steps plan.</div>
            </div>
          </div>
        </aside>
      </section>

      <section style={{ marginTop: "56px" }}>
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}
        >
          Four wings. One team.
        </h2>
        <p
          style={{
            fontSize: "0.96rem",
            color: "#c1c1cf",
            maxWidth: "38rem",
            marginBottom: "28px",
          }}
        >
          Each wing focuses on a different part of your launch—but the same
          StechX team stays with you from brief to live product.
        </p>

        {services.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {services.map((service: any) => (
              <div key={service.id} className="stechx-hero-card-item">
                <div className="stechx-hero-card-item-label">{service.title}</div>
                <div style={{ marginBottom: "8px" }}>
                  {service.shortDescription}
                </div>
                {service.highlights && service.highlights.length > 0 && (
                  <ul
                    style={{
                      paddingLeft: "18px",
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "#c1c1cf",
                    }}
                  >
                    {service.highlights.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {/* Fallback to hardcoded if backend returns empty */}
            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Web Studio</div>
              <div style={{ marginBottom: "8px" }}>
                Conversion‑focused websites and landing pages.
              </div>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#c1c1cf",
                }}
              >
                <li>Launch and marketing sites</li>
                <li>Product pages and feature drops</li>
                <li>SEO‑ready blog / resource layouts</li>
              </ul>
            </div>

            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">App Studio</div>
              <div style={{ marginBottom: "8px" }}>
                MVPs and dashboards built for real users.
              </div>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#c1c1cf",
                }}
              >
                <li>Founders' dashboards</li>
                <li>Admin panels and internal tools</li>
                <li>Prototype to production in clear steps</li>
              </ul>
            </div>

            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">Video Studio</div>
              <div style={{ marginBottom: "8px" }}>
                Story‑driven launch videos and explainers.
              </div>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#c1c1cf",
                }}
              >
                <li>Teaser and launch videos</li>
                <li>Product walkthroughs</li>
                <li>Short edits for social and ads</li>
              </ul>
            </div>

            <div className="stechx-hero-card-item">
              <div className="stechx-hero-card-item-label">AI Studio</div>
              <div style={{ marginBottom: "8px" }}>
                Automations and copilots that save real time.
              </div>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#c1c1cf",
                }}
              >
                <li>Website chatbots for leads</li>
                <li>Workflow and ops automations</li>
                <li>Custom tools powered by your data</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginTop: "56px" }}>
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          Ready to scope your project?
        </h2>
        <p
          style={{
            fontSize: "0.94rem",
            color: "#c1c1cf",
            maxWidth: "32rem",
            marginBottom: "20px",
          }}
        >
          Share a bit about what you're building. StechX will reply with a
          simple plan, not a complicated proposal.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/apply/client" className="stechx-hero-cta-primary">
            Start a project brief
          </a>
          <a href="/contact" className="stechx-hero-cta-secondary">
            Ask a question first
          </a>
        </div>
      </section>
    </div>
  );
}
