import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useJournal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createJournalEntry = async (journalData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createJournalEntry(journalData);
      setJournals(prev => [response.journal, ...prev]);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchJournals = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJournalEntries(params);
      setJournals(response.journals);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchJournalById = async (id) => {
    try {
      setError(null);
      const response = await apiClient.getJournalEntry(id);
      return response.journal;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateJournalEntry = async (id, journalData) => {
    try {
      setError(null);
      const response = await apiClient.updateJournalEntry(id, journalData);
      setJournals(prev => prev.map(journal => 
        journal._id === id ? response.journal : journal
      ));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteJournalEntry = async (id) => {
    try {
      setError(null);
      await apiClient.deleteJournalEntry(id);
      setJournals(prev => prev.filter(journal => journal._id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      setError(null);
      const response = await apiClient.toggleJournalFavorite(id);
      setJournals(prev => prev.map(journal => 
        journal._id === id ? response.journal : journal
      ));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const archiveEntry = async (id) => {
    try {
      setError(null);
      const response = await apiClient.archiveJournalEntry(id);
      setJournals(prev => prev.filter(journal => journal._id !== id));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    journals,
    loading,
    error,
    createJournalEntry,
    fetchJournals,
    fetchJournalById,
    updateJournalEntry,
    deleteJournalEntry,
    toggleFavorite,
    archiveEntry,
  };
};

export const useJournalStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJournalStats();
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
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
