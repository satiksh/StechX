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
    <div style={{ background: 'rgba(122, 201, 255, 0.1)', border: '1px solid #7bc9ff', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '0.875rem', color: '#8a8aa0', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>{value}</div>
        {trend && <div style={{ fontSize: '0.75rem', color: trend.direction === 'up' ? '#4ade80' : '#ff6b6b', marginTop: '0.5rem' }}>{trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last month</div>}
      </div>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
    </div>
  );
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'TALENT') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch available jobs for freelancer
        const jobsResponse = await jobApi.browseJobs({ limit: 10 });
        if (jobsResponse && jobsResponse.data) {
          setAvailableJobs(jobsResponse.data.slice(0, 6)); // Show top 6
          
          // Set stats based on user data
          setStats({
            activeProjects: user.totalEarnings ? 1 : 0,
            totalEarned: `$${(user.totalEarnings || 0).toLocaleString()}`,
            rating: user.rating || 4.8,
            pendingProposals: 0,
          });
        }
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#8a8aa0' }}>Loading job opportunities...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Welcome back, {user?.name}! 👋</h1>
        <p style={{ color: '#8a8aa0' }}>Here's your freelance activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatBox icon="💼" label="Active Projects" value={stats?.activeProjects || 0} trend={{ direction: 'up', percentage: 15 }} />
        <StatBox icon="💰" label="Total Earned" value={stats?.totalEarned || '$0'} trend={{ direction: 'up', percentage: 25 }} />
        <StatBox icon="⭐" label="Average Rating" value={stats?.rating || 4.8} />
        <StatBox icon="📋" label="Pending Proposals" value={stats?.pendingProposals || 0} trend={{ direction: 'up', percentage: 33 }} />
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(122, 201, 255, 0.2)', borderRadius: '16px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(122, 201, 255, 0.1)', paddingBottom: '1.5rem', margin: 0 }}>🔥 Job Opportunities</h3>
        {availableJobs.length === 0 ? (
          <p style={{ color: '#8a8aa0', textAlign: 'center', padding: '2rem' }}>No jobs available right now. Check back soon!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(122, 201, 255, 0.2)', backgroundColor: 'rgba(122, 201, 255, 0.05)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Project</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Budget</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Skills</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableJobs.map((job: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(122, 201, 255, 0.1)' }}>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{job.title}</td>
                    <td style={{ padding: '1rem', color: '#ccc', fontSize: '0.9rem' }}>{job.category}</td>
                    <td style={{ padding: '1rem', color: '#4ade80', fontWeight: '600' }}>${job.budget?.toLocaleString() || '0'}</td>
                    <td style={{ padding: '1rem', color: '#ccc', fontSize: '0.9rem' }}>{job.requiredSkills?.slice(0, 2).join(', ') || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: job.status === 'OPEN' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(107, 114, 128, 0.2)', color: job.status === 'OPEN' ? '#4ade80' : '#9ca3af', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        style={{ background: '#7bc9ff', color: '#0f0f1e', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/jobs/${job.id}/proposal`)}
                        style={{ background: 'transparent', color: '#7bc9ff', border: '1px solid #7bc9ff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Propose
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
