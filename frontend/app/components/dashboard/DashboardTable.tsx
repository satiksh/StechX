'use client';

import React from 'react';

interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

interface DashboardTableProps {
  headers: string[];
  rows: TableRow[];
  actions?: (row: TableRow) => React.ReactNode;
}

export default function DashboardTable({ headers, rows, actions }: DashboardTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.95rem',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '2px solid rgba(122, 201, 255, 0.2)',
              backgroundColor: 'rgba(122, 201, 255, 0.05)',
            }}
          >
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#7bc9ff',
                }}
              >
                {header}
              </th>
            ))}
            {actions && (
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#7bc9ff' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: '1px solid rgba(122, 201, 255, 0.1)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(122, 201, 255, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {headers.map((header) => (
                <td
                  key={header}
                  style={{
                    padding: '1rem',
                    color: '#ccc',
                  }}
                >
                  {row[header]}
                </td>
              ))}
              {actions && (
                <td style={{ padding: '1rem' }}>
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
