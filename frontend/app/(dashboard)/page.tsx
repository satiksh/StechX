"use client"

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // Redirect based on role
    if (!isLoading && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'CLIENT') {
        router.push('/dashboard/client');
      } else if (user.role === 'FREELANCER') {
        router.push('/dashboard/freelancer');
      }
    }
  }, [user, isLoading, router]);

  return (
    <main style={{ padding: '40px', color: '#000', textAlign: 'center' }}>
      <p>Loading dashboard...</p>
    </main>
  );
}
