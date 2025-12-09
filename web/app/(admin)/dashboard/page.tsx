"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

interface Application {
  id: string;
  type: string;
  name: string;
  email: string;
  message: string;
  budget?: number;
  experience?: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "CLIENT_PROJECT" | "TALENT">("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = applications.filter(
    (app) => filter === "all" || app.type === filter
  );

  if (loading) return <main style={{ padding: "40px", color: "#000" }}>Loading applications...</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto", background: "#fff" }}>
      <h1 style={{ color: "#000" }}>Admin Dashboard - Applications</h1>

      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: filter === "all" ? "#0070f3" : "#eee",
            color: filter === "all" ? "white" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter("CLIENT_PROJECT")}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: filter === "CLIENT_PROJECT" ? "#0070f3" : "#eee",
            color: filter === "CLIENT_PROJECT" ? "white" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Clients ({applications.filter(a => a.type === "CLIENT_PROJECT").length})
        </button>
        <button
          onClick={() => setFilter("TALENT")}
          style={{
            padding: "8px 16px",
            background: filter === "TALENT" ? "#0070f3" : "#eee",
            color: filter === "TALENT" ? "white" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Talent ({applications.filter(a => a.type === "TALENT").length})
        </button>
      </div>

      {filteredApps.length === 0 ? (
        <p style={{ color: "#000" }}>No applications yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", border: "1px solid #ddd" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #333", background: "#f5f5f5" }}>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Type</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Message</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Budget</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Experience</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Date</th>
                <th style={{ textAlign: "left", padding: "12px", color: "#000", fontWeight: "bold" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app, idx) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #eee", background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ padding: "12px", color: "#000" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: app.type === "CLIENT_PROJECT" ? "#cce5ff" : "#e6ccff",
                      color: "#000",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}>
                      {app.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#000" }}>{app.name}</td>
                  <td style={{ padding: "12px", color: "#000" }}>{app.email}</td>
                  <td style={{ padding: "12px", maxWidth: "300px", color: "#000" }}>
                    {app.message?.substring(0, 80)}...
                  </td>
                  <td style={{ padding: "12px", color: "#000" }}>
                    {app.budget ? `$${app.budget}` : "-"}
                  </td>
                  <td style={{ padding: "12px", maxWidth: "200px", color: "#000" }}>
                    {app.experience ? app.experience.substring(0, 50) + "..." : "-"}
                  </td>
                  <td style={{ padding: "12px", color: "#000" }}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", color: "#000" }}>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}