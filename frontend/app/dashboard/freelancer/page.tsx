"use client"

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FreelancerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not a freelancer
    if (!isLoading && user && user.role !== 'FREELANCER') {
      router.push('/dashboard');
    }
    // Redirect if not authenticated
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main style={{ padding: '40px', color: '#000', textAlign: 'center' }}>
        Loading...
      </main>
    );
  }

  if (!user || user.role !== 'FREELANCER') {
    return null;
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#000', marginBottom: '8px' }}>Welcome, {user.name}!</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Freelancer Dashboard</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '24px' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#000', marginBottom: '8px' }}>Available Projects</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Browse projects matching your skills</p>
            <button style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Browse Projects
            </button>
          </div>

          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#000', marginBottom: '8px' }}>My Applications</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Track your project applications</p>
            <button style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              View Applications
            </button>
          </div>

          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#000', marginBottom: '8px' }}>Portfolio</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Showcase your best work</p>
            <button style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Edit Portfolio
            </button>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #0070f3' }}>
          <h3 style={{ color: '#0070f3', marginTop: 0 }}>Profile Tips</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li>Complete your profile with your skills and experience</li>
            <li>Add samples of your previous work to your portfolio</li>
            <li>Respond quickly to project opportunities</li>
            <li>Build your reputation with quality work and timely delivery</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
