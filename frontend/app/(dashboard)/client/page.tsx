"use client"

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not a client
    if (!isLoading && user && user.role !== 'CLIENT') {
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

  if (!user || user.role !== 'CLIENT') {
    return null;
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#000', marginBottom: '8px' }}>Welcome, {user.name}!</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Client Dashboard</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '24px' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#000', marginBottom: '8px' }}>My Projects</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>View and manage your projects</p>
            <button style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              View Projects
            </button>
          </div>

          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#000', marginBottom: '8px' }}>Applications</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Track your applications</p>
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
            <h3 style={{ color: '#000', marginBottom: '8px' }}>Profile</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Edit your profile information</p>
            <button style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Edit Profile
            </button>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #0070f3' }}>
          <h3 style={{ color: '#0070f3', marginTop: 0 }}>Getting Started</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li>Complete your profile to get better project matches</li>
            <li>Browse available talent in our network</li>
            <li>Post projects and connect with freelancers</li>
            <li>Track project progress and communicate with your team</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
