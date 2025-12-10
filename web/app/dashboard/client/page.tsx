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

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showPostProject, setShowPostProject] = useState(false);
  const [selectedBudgetType, setSelectedBudgetType] = useState<'preset' | 'custom'>('preset');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requiredSkills: '',
    budget: '',
    customBudget: '',
    budgetType: 'fixed',
    deadline: '',
    isUrgent: false,
  });

  const budgetPresets = [
    { label: 'Small ($500 - $2,000)', value: '1000' },
    { label: 'Medium ($2,000 - $5,000)', value: '3500' },
    { label: 'Large ($5,000 - $10,000)', value: '7500' },
    { label: 'Enterprise ($10,000+)', value: '15000' },
  ];

  const categories = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Data Science',
    'AI/ML',
    'Blockchain',
    'DevOps',
    'Cloud Services',
    'QA Testing',
    'Digital Marketing',
  ];

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'CLIENT') {
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

      const response = await fetch('/api/projects?my=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const myProjects = result.data || [];
        setProjects(myProjects);

        // Calculate stats
        const activeJobs = myProjects.filter((p: any) => 
          p.status === 'OPEN' || p.status === 'IN_PROGRESS' || p.status === 'BIDDING'
        ).length;
        const totalSpent = myProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
        const totalBids = myProjects.reduce((sum: number, p: any) => sum + (p._count?.bids || 0), 0);

        setStats({
          activeProjects: activeJobs,
          totalSpent: `$${totalSpent.toLocaleString()}`,
          applications: totalBids,
          activeFreelancers: myProjects.filter((p: any) => p.assignedFreelancerId).length,
        });
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const finalBudget = selectedBudgetType === 'custom' 
        ? parseFloat(formData.customBudget) 
        : parseFloat(formData.budget);

      if (!finalBudget || finalBudget <= 0) {
        alert('Please enter a valid budget');
        return;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          budget: selectedBudgetType === 'preset' ? finalBudget : null,
          customBudget: selectedBudgetType === 'custom' ? finalBudget : null,
          requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Project posted successfully!');
        setShowPostProject(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          requiredSkills: '',
          budget: '',
          customBudget: '',
          budgetType: 'fixed',
          deadline: '',
          isUrgent: false,
        });
        fetchData();
      } else {
        alert(result.error || 'Failed to post project');
      }
    } catch (error: any) {
      console.error('Error posting project:', error);
      alert('Failed to post project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-gray-400">Loading your projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-400">Here's your client dashboard</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBox icon="💼" label="Active Projects" value={stats.activeProjects} trend={{ direction: 'up', percentage: 15 }} />
            <StatBox icon="💰" label="Total Spent" value={stats.totalSpent} trend={{ direction: 'up', percentage: 25 }} />
            <StatBox icon="📋" label="Total Bids Received" value={stats.applications} />
            <StatBox icon="👥" label="Active Freelancers" value={stats.activeFreelancers} trend={{ direction: 'up', percentage: 10 }} />
          </div>
        )}

        {/* Post Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowPostProject(!showPostProject)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition"
          >
            {showPostProject ? '✕ Cancel' : '+ Post New Project'}
          </button>
        </div>

        {/* Post Project Form */}
        {showPostProject && (
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Post a New Project</h2>
            <form onSubmit={handlePostProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Build a Modern E-commerce Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Describe your project in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills *</label>
                  <input
                    type="text"
                    required
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>
              </div>

              {/* Budget Selection - PRESET OR CUSTOM */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Budget *</label>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedBudgetType('preset')}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      selectedBudgetType === 'preset'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[rgba(122,201,255,0.1)] text-gray-400 border border-[#7bc9ff]'
                    }`}
                  >
                    Choose from Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBudgetType('custom')}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      selectedBudgetType === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[rgba(122,201,255,0.1)] text-gray-400 border border-[#7bc9ff]'
                    }`}
                  >
                    Enter Custom Amount
                  </button>
                </div>

                {selectedBudgetType === 'preset' ? (
                  <select
                    required={selectedBudgetType === 'preset'}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select budget range</option>
                    {budgetPresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>{preset.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-white">$</span>
                    <input
                      type="number"
                      required={selectedBudgetType === 'custom'}
                      min="1"
                      step="0.01"
                      value={formData.customBudget}
                      onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your budget amount"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-[rgba(122,201,255,0.1)] border border-[#7bc9ff] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isUrgent" className="ml-3 text-sm font-medium text-gray-300">
                    Mark as Urgent 🔥
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition"
                >
                  Post Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostProject(false)}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[rgba(122,201,255,0.2)] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 pb-6 border-b border-[rgba(122,201,255,0.1)]">
            Your Projects
          </h3>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No projects yet</p>
              <p className="text-gray-500">Post your first project to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[rgba(122,201,255,0.05)] border border-[rgba(122,201,255,0.2)] rounded-xl p-6 hover:border-[#7bc9ff] transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-semibold text-white">{project.title}</h4>
                        {project.isUrgent && <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">🔥 URGENT</span>}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{project.description.slice(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.requiredSkills?.slice(0, 5).map((skill: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        ${(project.customBudget || project.budget).toLocaleString()}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                        project.status === 'COMPLETED' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {project.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(122,201,255,0.1)]">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>📋 {project._count?.bids || 0} bids</span>
                      <span>📁 {project.category}</span>
                      {project.deadline && (
                        <span>⏰ Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/dashboard/client/projects/${project.id}`)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
