'use client';

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
    <div className="bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-xl p-6 flex justify-between items-start">
      <div>
        <div className="text-sm text-gray-400 mb-2">{label}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
        {trend && (
          <div className={`text-xs mt-2 ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last month
          </div>
        )}
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [bidFormData, setBidFormData] = useState({
    bidAmount: '',
    proposedDays: '',
    coverLetter: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'FREELANCER' && user.role !== 'AGENCY') {
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

      // Fetch available jobs
      const jobsResponse = await fetch('/api/projects?status=OPEN', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch my bids
      const bidsResponse = await fetch('/api/bids', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (jobsResponse.ok) {
        const result = await jobsResponse.json();
        setAvailableJobs(result.data || []);
      }

      if (bidsResponse.ok) {
        const result = await bidsResponse.json();
        setMyBids(result.data || []);

        // Calculate stats
        const totalEarned = user?.totalEarnings || 0;
        const activeBids = result.data.filter((b: any) => b.status === 'pending' || b.status === 'won').length;
        const wonBids = result.data.filter((b: any) => b.status === 'won' || b.status === 'accepted').length;

        setStats({
          activeProjects: wonBids,
          totalEarned: `$${totalEarned.toLocaleString()}`,
          rating: user?.rating || 4.8,
          pendingProposals: activeBids,
        });
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) return;

    const bidAmount = parseFloat(bidFormData.bidAmount);
    if (bidAmount > selectedJob.maxBidPrice) {
      alert(`Your bid cannot exceed $${selectedJob.maxBidPrice.toLocaleString()} (80% of the budget)`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          bidAmount,
          proposedDays: bidFormData.proposedDays ? parseInt(bidFormData.proposedDays) : undefined,
          coverLetter: bidFormData.coverLetter,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Bid placed successfully! 🎉');
        setShowBidModal(false);
        setSelectedJob(null);
        setBidFormData({ bidAmount: '', proposedDays: '', coverLetter: '' });
        fetchData();
      } else {
        alert(result.error || 'Failed to place bid');
      }
    } catch (error: any) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid');
    }
  };

  const handleAcceptWonBid = async (bidId: number) => {
    const confirmed = confirm('Do you want to accept this project? This will create a contract requiring 30% advance payment.');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/bids/${bidId}/freelancer-accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert('Project accepted! Contract created and sent to admin for approval. 🎉');
        fetchData();
      } else {
        alert(result.error || 'Failed to accept bid');
      }
    } catch (error: any) {
      console.error('Error accepting bid:', error);
      alert('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: number) => {
    const reason = prompt('Why are you rejecting this project? (This will affect your profile rating)');
    if (!reason) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/bids/${bidId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Bid rejected. Your profile rating has been affected.');
        fetchData();
      } else {
        alert(result.error || 'Failed to reject bid');
      }
    } catch (error: any) {
      console.error('Error rejecting bid:', error);
      alert('Failed to reject bid');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-gray-400">Loading job opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-400">Here's your freelance activity</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBox icon="💼" label="Active Projects" value={stats.activeProjects} trend={{ direction: 'up', percentage: 15 }} />
            <StatBox icon="💰" label="Total Earned" value={stats.totalEarned} trend={{ direction: 'up', percentage: 25 }} />
            <StatBox icon="⭐" label="Average Rating" value={stats.rating} />
            <StatBox icon="📋" label="Pending Bids" value={stats.pendingProposals} trend={{ direction: 'up', percentage: 33 }} />
          </div>
        )}

        {/* My Bids */}
        {myBids.length > 0 && (
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 pb-6 border-b border-[rgba(122,201,255,0.1)]">
              My Bids
            </h3>
            <div className="space-y-4">
              {myBids.map((bid) => (
                <div
                  key={bid.id}
                  className="bg-[rgba(122,201,255,0.05)] border border-[rgba(122,201,255,0.2)] rounded-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">{bid.job.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{bid.job.description.slice(0, 120)}...</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">💰 Your Bid: <span className="text-white font-bold">${bid.bidAmount.toLocaleString()}</span></span>
                        <span className="text-gray-400">📁 Budget: <span className="text-white">${(bid.job.customBudget || bid.job.budget).toLocaleString()}</span></span>
                        {bid.proposedDays && (
                          <span className="text-gray-400">⏰ {bid.proposedDays} days</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                        bid.status === 'won' ? 'bg-green-500/20 text-green-400' :
                        bid.status === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                        bid.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        bid.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {bid.status.toUpperCase()}
                      </div>
                      
                      {bid.status === 'won' && bid.acceptanceDeadline && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400">
                            Accept by: {new Date(bid.acceptanceDeadline).toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptWonBid(bid.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBid(bid.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Jobs */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 pb-6 border-b border-[rgba(122,201,255,0.1)]">
            🔥 Available Projects
          </h3>

          {availableJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No available projects right now</p>
              <p className="text-gray-500">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[rgba(122,201,255,0.05)] border border-[rgba(122,201,255,0.2)] rounded-xl p-6 hover:border-[#7bc9ff] transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                        {job.isUrgent && <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">🔥 URGENT</span>}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{job.description.slice(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.requiredSkills?.slice(0, 5).map((skill: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span>💰 Budget: <span className="text-white font-bold">${(job.customBudget || job.budget).toLocaleString()}</span></span>
                        <span>📊 Max Bid (80%): <span className="text-green-400 font-bold">${job.maxBidPrice.toLocaleString()}</span></span>
                        <span>📋 {job._count?.bids || 0} bids</span>
                        {job.biddingEndsAt && (
                          <span>⏰ Ends: {new Date(job.biddingEndsAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(122,201,255,0.1)]">
                    <div className="text-sm text-gray-400">
                      Posted by: <span className="text-white">{job.client.name}</span> ⭐ {job.client.rating || 0}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowBidModal(true);
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-semibold"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.3)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Place Your Bid</h2>
            <div className="mb-6 p-4 bg-[rgba(122,201,255,0.1)] rounded-lg border border-[rgba(122,201,255,0.2)]">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedJob.title}</h3>
              <div className="text-sm space-y-1">
                <p className="text-gray-400">Budget: <span className="text-white font-bold">${(selectedJob.customBudget || selectedJob.budget).toLocaleString()}</span></p>
                <p className="text-gray-400">Max Bid (80%): <span className="text-green-400 font-bold">${selectedJob.maxBidPrice.toLocaleString()}</span></p>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Bid Amount * (Max ${selectedJob.maxBidPrice.toLocaleString()})</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-white">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedJob.maxBidPrice}
                    step="0.01"
                    value={bidFormData.bidAmount}
                    onChange={(e) => setBidFormData({ ...bidFormData, bidAmount: e.target.value })}
                    className="flex-1 px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your bid amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Days (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={bidFormData.proposedDays}
                  onChange={(e) => setBidFormData({ ...bidFormData, proposedDays: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="How many days will it take?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter</label>
                <textarea
                  rows={5}
                  value={bidFormData.coverLetter}
                  onChange={(e) => setBidFormData({ ...bidFormData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Tell the client why you're the best fit for this project..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition"
                >
                  Submit Bid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBidModal(false);
                    setSelectedJob(null);
                    setBidFormData({ bidAmount: '', proposedDays: '', coverLetter: '' });
                  }}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
