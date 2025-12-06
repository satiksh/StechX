"use client";

export default function AboutPage() {
  return (
    <div className="stechx-main">
      <section className="stechx-hero" style={{ minHeight: "auto" }}>
        <div className="stechx-hero-left">
          <div className="stechx-hero-pill">
            <span className="stechx-hero-pill-dot" />
            <span>About StechX</span>
          </div>

          <h1 className="stechx-hero-title">
            Meet <span className="stechx-hero-highlight">Satiksh Patel</span>,
            Founder & CEO.
          </h1>

          <p className="stechx-hero-sub">
            Building StechX to help early-stage founders and small teams launch
            their ideas faster with Web, App, Video, and AI solutions.
          </p>

          <div style={{ marginTop: "30px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <a
              href="https://www.instagram.com/satiksh_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                background: "#E4405F",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/satikshpatel/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                background: "#0A66C2",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/satiksh"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                background: "#333",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              GitHub
            </a>
            <a
              href="mailto:satikshpatel8@gmail.com"
              style={{
                padding: "10px 20px",
                background: "#EA4335",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Email
            </a>
          </div>
        </div>

        <aside className="stechx-hero-card" style={{ textAlign: "center" }}>
          <img
            src="/images/satiksh.jpeg"
            alt="Satiksh Patel - Founder & CEO"
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />
          <h3 style={{ margin: "0 0 5px 0" }}>Satiksh Patel</h3>
          <p style={{ margin: "0 0 15px 0", color: "#7bc9ff" }}>Founder & CEO</p>

          <div style={{ fontSize: "0.85rem", lineHeight: "1.6", textAlign: "left" }}>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:satikshpatel8@gmail.com"
                style={{ color: "#7bc9ff", textDecoration: "none" }}
              >
                satikshpatel8@gmail.com
              </a>
            </p>
            <p>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://www.instagram.com/satiksh_/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7bc9ff", textDecoration: "none" }}
              >
                @satiksh_
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://www.linkedin.com/in/satikshpatel/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7bc9ff", textDecoration: "none" }}
              >
                satikshpatel
              </a>
            </p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href="https://github.com/satiksh"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7bc9ff", textDecoration: "none" }}
              >
                @satiksh
              </a>
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}