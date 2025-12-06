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

  if (loading) return <main style={{ padding: "40px" }}>Loading applications...</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Admin Dashboard - Applications</h1>

      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: filter === "all" ? "#0070f3" : "#eee",
            color: filter === "all" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
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
            color: filter === "CLIENT_PROJECT" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clients ({applications.filter(a => a.type === "CLIENT_PROJECT").length})
        </button>
        <button
          onClick={() => setFilter("TALENT")}
          style={{
            padding: "8px 16px",
            background: filter === "TALENT" ? "#0070f3" : "#eee",
            color: filter === "TALENT" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Talent ({applications.filter(a => a.type === "TALENT").length})
        </button>
      </div>

      {filteredApps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", background: "#f5f5f5" }}>
                <th style={{ textAlign: "left", padding: "12px" }}>Type</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Message</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Budget</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Experience</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Date</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: app.type === "CLIENT_PROJECT" ? "#e3f2fd" : "#f3e5f5",
                      fontSize: "0.85rem",
                    }}>
                      {app.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{app.name}</td>
                  <td style={{ padding: "12px" }}>{app.email}</td>
                  <td style={{ padding: "12px", maxWidth: "300px" }}>
                    {app.message?.substring(0, 80)}...
                  </td>
                  <td style={{ padding: "12px" }}>
                    {app.budget ? `$${app.budget}` : "-"}
                  </td>
                  <td style={{ padding: "12px", maxWidth: "200px" }}>
                    {app.experience ? app.experience.substring(0, 50) + "..." : "-"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}