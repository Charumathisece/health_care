import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useMood = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMoodEntry = async (moodData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createMoodEntry(moodData);
      setMoods(prev => [response.mood, ...prev]);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMoods = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMoodEntries(params);
      setMoods(response.moods);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMoodEntry = async (id, moodData) => {
    try {
      setError(null);
      const response = await apiClient.updateMoodEntry(id, moodData);
      setMoods(prev => prev.map(mood => 
        mood._id === id ? response.mood : mood
      ));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteMoodEntry = async (id) => {
    try {
      setError(null);
      await apiClient.deleteMoodEntry(id);
      setMoods(prev => prev.filter(mood => mood._id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    moods,
    loading,
    error,
    createMoodEntry,
    fetchMoods,
    updateMoodEntry,
    deleteMoodEntry,
  };
};

export const useMoodStats = (period = 'month') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (newPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMoodStats(newPeriod);
      setStats(response);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
