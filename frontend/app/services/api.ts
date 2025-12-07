// API Service - All API calls for the application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ===== USER / PROFILE =====
export const userApi = {
  async getProfile() {
    return apiCall('/users/me');
  },

  async updateProfile(data: {
    name?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
    portfolioUrl?: string;
  }) {
    return apiCall('/users/me', { method: 'PUT', body: data });
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) throw new Error('Avatar upload failed');
    return response.json();
  },

  async getUserById(userId: string) {
    return apiCall(`/users/${userId}`);
  },
};

// ===== PROJECTS / JOBS =====
export const projectApi = {
  async getMyProjects(filters?: { status?: string; limit?: number; skip?: number }) {
    const query = new URLSearchParams();
    if (filters?.status) query.append('status', filters.status);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    if (filters?.skip) query.append('skip', filters.skip.toString());
    
    return apiCall(`/projects/my-projects?${query.toString()}`);
  },

  async getProjectById(projectId: string) {
    return apiCall(`/projects/${projectId}`);
  },

  async createProject(data: {
    title: string;
    description: string;
    budget: number;
    deadline: string;
    requiredSkills: string[];
    category: string;
  }) {
    return apiCall('/projects', { method: 'POST', body: data });
  },

  async updateProject(projectId: string, data: any) {
    return apiCall(`/projects/${projectId}`, { method: 'PUT', body: data });
  },

  async deleteProject(projectId: string) {
    return apiCall(`/projects/${projectId}`, { method: 'DELETE' });
  },

  async browseProjects(filters?: {
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
    search?: string;
    limit?: number;
    skip?: number;
  }) {
    const query = new URLSearchParams();
    if (filters?.category) query.append('category', filters.category);
    if (filters?.minBudget) query.append('minBudget', filters.minBudget.toString());
    if (filters?.maxBudget) query.append('maxBudget', filters.maxBudget.toString());
    if (filters?.skills) query.append('skills', filters.skills.join(','));
    if (filters?.search) query.append('search', filters.search);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    if (filters?.skip) query.append('skip', filters.skip.toString());
    
    return apiCall(`/projects/browse?${query.toString()}`);
  },
};

// ===== APPLICATIONS / PROPOSALS =====
export const applicationApi = {
  async getMyApplications(filters?: { status?: string; limit?: number; skip?: number }) {
    const query = new URLSearchParams();
    if (filters?.status) query.append('status', filters.status);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    if (filters?.skip) query.append('skip', filters.skip.toString());
    
    return apiCall(`/applications/my-applications?${query.toString()}`);
  },

  async submitProposal(projectId: string, data: {
    coverLetter: string;
    proposedBudget?: number;
    estimatedDays?: number;
    attachments?: string[];
  }) {
    return apiCall('/applications', { 
      method: 'POST', 
      body: { projectId, ...data } 
    });
  },

  async getProjectApplications(projectId: string) {
    return apiCall(`/applications/project/${projectId}`);
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    return apiCall(`/applications/${applicationId}`, {
      method: 'PUT',
      body: { status },
    });
  },
};

// ===== CONTRACTS =====
export const contractApi = {
  async getMyContracts(filters?: { status?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (filters?.status) query.append('status', filters.status);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    
    return apiCall(`/contracts?${query.toString()}`);
  },

  async getContractById(contractId: string) {
    return apiCall(`/contracts/${contractId}`);
  },

  async createContract(data: {
    projectId: string;
    freelancerId: string;
    amount: number;
    startDate: string;
    endDate: string;
    terms: string;
  }) {
    return apiCall('/contracts', { method: 'POST', body: data });
  },

  async updateContractStatus(contractId: string, status: string) {
    return apiCall(`/contracts/${contractId}`, {
      method: 'PUT',
      body: { status },
    });
  },
};

// ===== EARNINGS / PAYMENTS =====
export const earningsApi = {
  async getEarnings(period?: 'week' | 'month' | 'year') {
    const query = period ? `?period=${period}` : '';
    return apiCall(`/earnings${query}`);
  },

  async getPaymentHistory(limit?: number, skip?: number) {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());
    if (skip) query.append('skip', skip.toString());
    
    return apiCall(`/payments?${query.toString()}`);
  },

  async withdrawFunds(amount: number, method: 'bank' | 'paypal') {
    return apiCall('/withdrawals', {
      method: 'POST',
      body: { amount, method },
    });
  },
};

// ===== MESSAGES / NOTIFICATIONS =====
export const messageApi = {
  async getConversations(limit?: number, skip?: number) {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());
    if (skip) query.append('skip', skip.toString());
    
    return apiCall(`/messages/conversations?${query.toString()}`);
  },

  async getMessages(conversationId: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return apiCall(`/messages/${conversationId}${query}`);
  },

  async sendMessage(recipientId: string, content: string) {
    return apiCall('/messages', {
      method: 'POST',
      body: { recipientId, content },
    });
  },

  async getNotifications() {
    return apiCall('/notifications');
  },

  async markNotificationAsRead(notificationId: string) {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'PUT',
      body: { read: true },
    });
  },
};

// ===== ADMIN API =====
export const adminApi = {
  async getStats() {
    return apiCall('/admin/stats');
  },

  async getUsers(filters?: { role?: string; limit?: number; skip?: number }) {
    const query = new URLSearchParams();
    if (filters?.role) query.append('role', filters.role);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    if (filters?.skip) query.append('skip', filters.skip.toString());
    
    return apiCall(`/admin/users?${query.toString()}`);
  },

  async getUserById(userId: string) {
    return apiCall(`/admin/users/${userId}`);
  },

  async updateUser(userId: string, data: any) {
    return apiCall(`/admin/users/${userId}`, { method: 'PUT', body: data });
  },

  async deleteUser(userId: string) {
    return apiCall(`/admin/users/${userId}`, { method: 'DELETE' });
  },

  async getApplications(filters?: { status?: string; limit?: number; skip?: number }) {
    const query = new URLSearchParams();
    if (filters?.status) query.append('status', filters.status);
    if (filters?.limit) query.append('limit', filters.limit.toString());
    if (filters?.skip) query.append('skip', filters.skip.toString());
    
    return apiCall(`/admin/applications?${query.toString()}`);
  },

  async approveContent(type: 'project' | 'portfolio' | 'review', id: string) {
    return apiCall(`/admin/approve/${type}/${id}`, { method: 'POST' });
  },

  async flagContent(type: string, id: string, reason: string) {
    return apiCall(`/admin/flag/${type}/${id}`, {
      method: 'POST',
      body: { reason },
    });
  },

  async getReports() {
    return apiCall('/admin/reports');
  },
};

// ===== SEARCH & DISCOVERY =====
export const searchApi = {
  async searchFreelancers(query: string, filters?: { skills?: string[]; minRating?: number }) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    
    return apiCall(`/search/freelancers?${params.toString()}`);
  },

  async searchProjects(query: string, filters?: { category?: string; maxBudget?: number }) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.maxBudget) params.append('maxBudget', filters.maxBudget.toString());
    
    return apiCall(`/search/projects?${params.toString()}`);
  },

  async getTrendingSkills() {
    return apiCall('/trending/skills');
  },

  async getTrendingCategories() {
    return apiCall('/trending/categories');
  },
};

// ===== BOOKMARKS / FAVORITES =====
export const bookmarkApi = {
  async saveProject(projectId: string) {
    return apiCall('/bookmarks/projects', {
      method: 'POST',
      body: { projectId },
    });
  },

  async unsaveProject(projectId: string) {
    return apiCall(`/bookmarks/projects/${projectId}`, { method: 'DELETE' });
  },

  async getSavedProjects(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return apiCall(`/bookmarks/projects${query}`);
  },

  async saveFreelancer(freelancerId: string) {
    return apiCall('/bookmarks/freelancers', {
      method: 'POST',
      body: { freelancerId },
    });
  },

  async getSavedFreelancers() {
    return apiCall('/bookmarks/freelancers');
  },
};
