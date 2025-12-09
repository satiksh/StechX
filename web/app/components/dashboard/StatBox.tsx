import React from 'react';

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

export default function StatBox({
  icon,
  label,
  value,
  color = '#7bc9ff',
  trend,
}: StatBoxProps) {
  return (
    <div
      style={{
        background: 'rgba(122, 201, 255, 0.1)',
        border: `1px solid ${color}`,
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div>
        <div style={{ fontSize: '0.875rem', color: '#8a8aa0', marginBottom: '0.5rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
          {value}
        </div>
        {trend && (
          <div style={{ fontSize: '0.75rem', color: trend.direction === 'up' ? '#4ade80' : '#ff6b6b' }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last month
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: '2rem',
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '50px',
        }}
      >
        {icon}
      </div>
    </div>
  );
}
