"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export default function SignupPage() {
  const { register, googleLogin } = useAuth();
  const [role, setRole] = useState<"CLIENT" | "FREELANCER">("CLIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await register(name, email, password, role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleLogin(response.access_token);
      } catch (err: any) {
        setError(err.message);
      }
    },
    onError: () => setError("Google signup failed"),
  });

  return (
    <div className="stechx-main" style={{ padding: "4rem 1rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: "450px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>Create Account</h1>
        <p style={{ marginBottom: "2rem", color: "#8a8aa0" }}>
          Join StechX as a client or freelancer
        </p>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button
            type="button"
            onClick={() => setRole("CLIENT")}
            style={{
              flex: 1,
              padding: "1rem",
              border: role === "CLIENT" ? "2px solid #7bc9ff" : "1px solid #2a2a3e",
              background: role === "CLIENT" ? "#1a1a2e" : "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Client</div>
            <div style={{ fontSize: "0.85rem", color: "#8a8aa0" }}>Get services</div>
          </button>
          <button
            type="button"
            onClick={() => setRole("FREELANCER")}
            style={{
              flex: 1,
              padding: "1rem",
              border: role === "FREELANCER" ? "2px solid #7bc9ff" : "1px solid #2a2a3e",
              background: role === "FREELANCER" ? "#1a1a2e" : "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Freelancer</div>
            <div style={{ fontSize: "0.85rem", color: "#8a8aa0" }}>Provide services</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          <div className="stechx-contact-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" required />
          </div>

          <div className="stechx-contact-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="stechx-contact-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={6} />
          </div>

          {error && <p style={{ color: "#ff6b6b", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="stechx-hero-cta-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div style={{ margin: "1.5rem 0", textAlign: "center", color: "#8a8aa0", fontSize: "0.9rem" }}>or</div>

        <button
          onClick={() => handleGoogleSignup()}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #2a2a3e",
            background: "white",
            color: "black",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "0.95rem",
          }}
        >
          Continue with Google
        </button>

        <p style={{ marginTop: "2rem", textAlign: "center", color: "#8a8aa0", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#7bc9ff", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
