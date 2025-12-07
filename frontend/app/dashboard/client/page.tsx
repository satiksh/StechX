'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { jobApi } from '@/app/services/api';

interface StatBoxProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down'; percentage: number };
}

function StatBox({ icon, label, value, trend }: StatBoxProps) {
  return (
    <div
      style={{
        background: 'rgba(122, 201, 255, 0.1)',
        border: '1px solid #7bc9ff',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div style={{ fontSize: '0.875rem', color: '#8a8aa0', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>{value}</div>
        {trend && (
          <div style={{ fontSize: '0.75rem', color: trend.direction === 'up' ? '#4ade80' : '#ff6b6b', marginTop: '0.5rem' }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last month
          </div>
        )}
      </div>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'CLIENT') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch user stats
        const statsResponse = await jobApi.getMyProjects();
        if (statsResponse && statsResponse.data) {
          const myProjects = statsResponse.data;
          setProjects(myProjects);
          
          // Calculate stats
          const activeJobs = myProjects.filter((p: any) => p.status === 'OPEN' || p.status === 'IN_PROGRESS').length;
          const totalSpent = myProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
          
          setStats({
            activeProjects: activeJobs,
            totalSpent: `$${totalSpent.toLocaleString()}`,
            applications: myProjects.length,
            activeFreelancers: myProjects.length, // Approximate
          });
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#8a8aa0' }}>
        Loading your projects...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#8a8aa0' }}>Here's what's happening with your projects</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatBox icon="💼" label="Active Projects" value={stats?.activeProjects || 0} trend={{ direction: 'up', percentage: 12 }} />
        <StatBox icon="💰" label="Total Spent" value={stats?.totalSpent || '$0'} trend={{ direction: 'down', percentage: 8 }} />
        <StatBox icon="📝" label="Applications" value={stats?.applications || 0} trend={{ direction: 'up', percentage: 23 }} />
        <StatBox icon="👥" label="Active Freelancers" value={stats?.activeFreelancers || 0} />
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(122, 201, 255, 0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(122, 201, 255, 0.1)', paddingBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', margin: 0 }}>Your Projects</h3>
          <button
            onClick={() => router.push('/jobs/create')}
            style={{ background: '#7bc9ff', color: '#0f0f1e', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Post New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p style={{ color: '#8a8aa0', textAlign: 'center', padding: '2rem' }}>No projects yet. Post one to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(122, 201, 255, 0.2)', backgroundColor: 'rgba(122, 201, 255, 0.05)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Project Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Budget</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Skills Required</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Progress</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(122, 201, 255, 0.1)' }}>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{p.title}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: p.status === 'IN_PROGRESS' ? 'rgba(251, 191, 36, 0.2)' : p.status === 'OPEN' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: p.status === 'IN_PROGRESS' ? '#fbbf24' : p.status === 'OPEN' ? '#4ade80' : '#9ca3af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>${p.budget?.toLocaleString() || '0'}</td>
                    <td style={{ padding: '1rem', color: '#ccc', fontSize: '0.9rem' }}>{p.requiredSkills?.slice(0, 2).join(', ') || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '80px', height: '6px', background: 'rgba(122, 201, 255, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.progress || 0}%`, height: '100%', background: '#7bc9ff' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#8a8aa0' }}>{p.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => router.push(`/jobs/${p.id}`)}
                        style={{background: 'transparent', color: '#7bc9ff', border: '1px solid #7bc9ff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
