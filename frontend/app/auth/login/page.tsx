"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleLogin(response.access_token);
      } catch (err: any) {
        setError(err.message);
      }
    },
    onError: () => setError("Google login failed"),
  });

  return (
    <div className="stechx-main" style={{ padding: "4rem 1rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: "450px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>Welcome Back</h1>
        <p style={{ marginBottom: "2rem", color: "#8a8aa0" }}>
          Login to your StechX account
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          <div className="stechx-contact-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="stechx-contact-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          {error && <p style={{ color: "#ff6b6b", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="stechx-hero-cta-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ margin: "1.5rem 0", textAlign: "center", color: "#8a8aa0", fontSize: "0.9rem" }}>or</div>

        <button
          onClick={() => handleGoogleLogin()}
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
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#7bc9ff", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
