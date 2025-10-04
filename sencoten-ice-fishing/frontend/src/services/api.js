import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vocabulary API
export const vocabularyAPI = {
  // Get all vocabulary
  getAll: async () => {
    const response = await api.get('/vocabulary');
    return response.data;
  },

  // Get random vocabulary set
  getRandom: async (limit = 5) => {
    const response = await api.get(`/vocabulary/random?limit=${limit}`);
    return response.data;
  },

  // Get vocabulary by ID
  getById: async (id) => {
    const response = await api.get(`/vocabulary/${id}`);
    return response.data;
  },
};

// Score API
export const scoreAPI = {
  // Get all scores
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/scores?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get top scores (leaderboard)
  getTop: async (limit = 10) => {
    const response = await api.get(`/scores/top?limit=${limit}`);
    return response.data;
  },

  // Get player's best score
  getPlayerBest: async (playerName) => {
    const response = await api.get(`/scores/player/${playerName}`);
    return response.data;
  },

  // Submit new score
  submit: async (scoreData) => {
    const response = await api.post('/scores', scoreData);
    return response.data;
  },
};

export default api;