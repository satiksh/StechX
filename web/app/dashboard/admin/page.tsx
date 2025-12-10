'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface StatBoxProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

function StatBox({ icon, label, value, color = '#7bc9ff' }: StatBoxProps) {
  return (
    <div className="bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-xl p-6 flex justify-between items-start">
      <div>
        <div className="text-sm text-gray-400 mb-2">{label}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'contracts'>('overview');
  const [showGoogleMeetModal, setShowGoogleMeetModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [googleMeetLink, setGoogleMeetLink] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/');
        return;
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Fetch pending contracts
      const contractsResponse = await fetch('/api/contracts?status=PENDING_ADMIN_APPROVAL', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const result = await statsResponse.json();
        setStats(result.data);
      }

      if (usersResponse.ok) {
        const result = await usersResponse.json();
        setUsers(result.data);
      }

      if (contractsResponse.ok) {
        const result = await contractsResponse.json();
        setContracts(result.data);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirmed = confirm(`Are you sure you want to ${suspend ? 'suspend' : 'unsuspend'} this user?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ suspend }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        fetchData();
      } else {
        alert(result.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to update user');
    }
  };

  const handleApproveContract = async (contractId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/contracts/${contractId}/admin-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ googleMeetLink }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Contract approved successfully!');
        setShowGoogleMeetModal(false);
        setSelectedContract(null);
        setGoogleMeetLink('');
        fetchData();
      } else {
        alert(result.error || 'Failed to approve contract');
      }
    } catch (error) {
      console.error('Error approving contract:', error);
      alert('Failed to approve contract');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-gray-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard 🛠️</h1>
          <p className="text-gray-400">Platform management and oversight</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-[rgba(122,201,255,0.1)] text-gray-400 border border-[#7bc9ff]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-[rgba(122,201,255,0.1)] text-gray-400 border border-[#7bc9ff]'
            }`}
          >
            Users ({stats?.overview?.totalUsers || 0})
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'contracts'
                ? 'bg-blue-600 text-white'
                : 'bg-[rgba(122,201,255,0.1)] text-gray-400 border border-[#7bc9ff]'
            }`}
          >
            Pending Contracts ({contracts.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatBox icon="👥" label="Total Users" value={stats.overview.totalUsers} />
              <StatBox icon="💼" label="Total Projects" value={stats.overview.totalProjects} />
              <StatBox icon="📄" label="Active Contracts" value={stats.overview.activeContracts} />
              <StatBox icon="💰" label="Total Revenue" value={`$${stats.overview.totalRevenue.toLocaleString()}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatBox icon="🧑‍💼" label="Clients" value={stats.overview.totalClients} />
              <StatBox icon="👨‍💻" label="Freelancers" value={stats.overview.totalFreelancers} />
              <StatBox icon="📋" label="Total Bids" value={stats.overview.totalBids} />
              <StatBox icon="⏳" label="Pending Approvals" value={stats.overview.pendingContracts} />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-[rgba(122,201,255,0.1)]">
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {stats.recentActivity.users.map((u: any) => (
                    <div key={u.id} className="flex justify-between items-center p-3 bg-[rgba(122,201,255,0.05)] rounded-lg">
                      <div>
                        <div className="text-white font-semibold">{u.name}</div>
                        <div className="text-sm text-gray-400">{u.email}</div>
                      </div>
                      <div className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                        {u.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-[rgba(122,201,255,0.1)]">
                  Recent Projects
                </h3>
                <div className="space-y-3">
                  {stats.recentActivity.projects.map((p: any) => (
                    <div key={p.id} className="p-3 bg-[rgba(122,201,255,0.05)] rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-semibold">{p.title}</div>
                        <div className="text-green-400 font-bold">${p.budget.toLocaleString()}</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-400">by {p.client.name}</div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          p.status === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                          p.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 pb-6 border-b border-[rgba(122,201,255,0.1)]">
              User Management
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(122,201,255,0.2)]">
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Name</th>
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Email</th>
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Role</th>
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Rating</th>
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-[#7bc9ff] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[rgba(122,201,255,0.1)]">
                      <td className="py-4 px-4 text-white">{u.name}</td>
                      <td className="py-4 px-4 text-gray-400">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">⭐ {u.rating.toFixed(1)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          u.isSuspended
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {u.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleSuspendUser(u.id, !u.isSuspended)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            u.isSuspended
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 pb-6 border-b border-[rgba(122,201,255,0.1)]">
              Pending Contract Approvals
            </h3>
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No pending contracts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="bg-[rgba(122,201,255,0.05)] border border-[rgba(122,201,255,0.2)] rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">{contract.job.title}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Client:</span>{' '}
                            <span className="text-white">{contract.client.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Freelancer:</span>{' '}
                            <span className="text-white">{contract.freelancer.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Amount:</span>{' '}
                            <span className="text-white font-bold">${contract.amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Advance (30%):</span>{' '}
                            <span className="text-green-400 font-bold">${contract.advanceAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-[rgba(122,201,255,0.1)]">
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowGoogleMeetModal(true);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Approve Contract
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Meet Modal */}
      {showGoogleMeetModal && selectedContract && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.3)] rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Approve Contract</h2>
            <p className="text-gray-400 mb-6">
              Optionally add a Google Meet link for the kickoff meeting
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Google Meet Link (Optional)
              </label>
              <input
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleApproveContract(selectedContract.id)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setShowGoogleMeetModal(false);
                  setSelectedContract(null);
                  setGoogleMeetLink('');
                }}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
