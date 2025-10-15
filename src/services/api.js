// API client for SoulScribe backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Make HTTP request with proper headers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async refreshToken() {
    const response = await this.post('/auth/refresh');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // User profile methods
  async updateProfile(profileData) {
    return this.put('/users/profile', profileData);
  }

  async updatePreferences(preferences) {
    return this.put('/users/preferences', preferences);
  }

  async changePassword(passwordData) {
    return this.put('/users/password', passwordData);
  }

  // Mood tracking methods
  async createMoodEntry(moodData) {
    return this.post('/moods', moodData);
  }

  async getMoodEntries(params = {}) {
    return this.get('/moods', params);
  }

  async getMoodEntry(id) {
    return this.get(`/moods/${id}`);
  }

  async updateMoodEntry(id, moodData) {
    return this.put(`/moods/${id}`, moodData);
  }

  async deleteMoodEntry(id) {
    return this.delete(`/moods/${id}`);
  }

  async getMoodStats(period = 'month') {
    return this.get('/moods/stats', { period });
  }

  // Journal methods
  async createJournalEntry(journalData) {
    return this.post('/journals', journalData);
  }

  async getJournalEntries(params = {}) {
    return this.get('/journals', params);
  }

  async getJournalEntry(id) {
    return this.get(`/journals/${id}`);
  }

  async updateJournalEntry(id, journalData) {
    return this.put(`/journals/${id}`, journalData);
  }

  async deleteJournalEntry(id) {
    return this.delete(`/journals/${id}`);
  }

  async toggleJournalFavorite(id) {
    return this.patch(`/journals/${id}/favorite`);
  }

  async archiveJournalEntry(id) {
    return this.patch(`/journals/${id}/archive`);
  }

  async getJournalStats() {
    return this.get('/journals/stats/overview');
  }

  // Chat methods
  async createChatSession(sessionData) {
    return this.post('/chats/sessions', sessionData);
  }

  async getChatSessions(params = {}) {
    return this.get('/chats/sessions', params);
  }

  async getChatSession(sessionId) {
    return this.get(`/chats/sessions/${sessionId}`);
  }

  async addChatMessage(sessionId, messageData) {
    return this.post(`/chats/sessions/${sessionId}/messages`, messageData);
  }

  async updateChatSession(sessionId, sessionData) {
    return this.put(`/chats/sessions/${sessionId}`, sessionData);
  }

  async addChatFeedback(sessionId, feedback) {
    return this.post(`/chats/sessions/${sessionId}/feedback`, feedback);
  }

  async deleteChatSession(sessionId) {
    return this.delete(`/chats/sessions/${sessionId}`);
  }

  async getChatStats() {
    return this.get('/chats/stats/overview');
  }

  // Analytics methods
  async getDashboardAnalytics(period = 'month') {
    return this.get('/analytics/dashboard', { period });
  }

  async getMoodTrends(period = 'month', granularity = 'day') {
    return this.get('/analytics/mood-trends', { period, granularity });
  }

  async getWellnessInsights() {
    return this.get('/analytics/insights');
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
