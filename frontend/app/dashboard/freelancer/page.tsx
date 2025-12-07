'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    setIsLoading(false);
    if (!user) {
      router.push('/auth/login');
    } else if (user.role !== 'FREELANCER') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#8a8aa0' }}>Loading...</div>;
  }

  const activeProjects = [
    { id: 1, name: 'E-Commerce Website', client: 'Tech Startup Inc', rate: '$50/hr', hoursTillDeadline: 24, earned: '$2,400' },
    { id: 2, name: 'Mobile App Design', client: 'Creative Agency', rate: '$45/hr', hoursTillDeadline: 72, earned: '$1,800' },
  ];

  const applications = [
    { id: 1, project: 'Logo Design', client: 'Brand Co', budget: '$1,500', deadline: '5 days' },
    { id: 2, project: 'UI Design', client: 'Startup Hub', budget: '$3,000', deadline: '10 days' },
    { id: 3, project: 'Web Development', client: 'E-Com Store', budget: '$5,000', deadline: '15 days' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Welcome back, {user?.name}! 👋</h1>
        <p style={{ color: '#8a8aa0' }}>Here's your freelance activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatBox icon="💼" label="Active Projects" value={2} trend={{ direction: 'up', percentage: 15 }} />
        <StatBox icon="💰" label="Total Earned" value="$4,200" trend={{ direction: 'up', percentage: 25 }} />
        <StatBox icon="⭐" label="Average Rating" value="4.8" />
        <StatBox icon="📋" label="Pending Proposals" value={3} trend={{ direction: 'up', percentage: 33 }} />
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(122, 201, 255, 0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(122, 201, 255, 0.1)', paddingBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', margin: 0 }}>Active Projects</h3>
          <button style={{ background: '#7bc9ff', color: '#0f0f1e', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Browse Jobs</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(122, 201, 255, 0.2)', backgroundColor: 'rgba(122, 201, 255, 0.05)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Project</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Client</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Rate</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Hours Left</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Earned</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeProjects.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(122, 201, 255, 0.1)' }}>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{p.name}</td>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{p.client}</td>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{p.rate}</td>
                  <td style={{ padding: '1rem', color: p.hoursTillDeadline < 48 ? '#ff6b6b' : '#4ade80' }}>{p.hoursTillDeadline}h {p.hoursTillDeadline < 48 && <span style={{ fontSize: '0.75rem' }}>⚠️ Urgent</span>}</td>
                  <td style={{ padding: '1rem', color: '#4ade80', fontWeight: '600' }}>{p.earned}</td>
                  <td style={{ padding: '1rem' }}><button style={{ background: 'transparent', color: '#7bc9ff', border: '1px solid #7bc9ff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(122, 201, 255, 0.2)', borderRadius: '16px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(122, 201, 255, 0.1)', paddingBottom: '1.5rem', margin: 0 }}>Job Opportunities</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(122, 201, 255, 0.2)', backgroundColor: 'rgba(122, 201, 255, 0.05)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Project</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Client</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Budget</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Deadline</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(122, 201, 255, 0.1)' }}>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{app.project}</td>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{app.client}</td>
                  <td style={{ padding: '1rem', color: '#4ade80', fontWeight: '600' }}>{app.budget}</td>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{app.deadline}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: '#7bc9ff', color: '#0f0f1e', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Submit</button>
                    <button style={{ background: 'transparent', color: '#7bc9ff', border: '1px solid #7bc9ff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
