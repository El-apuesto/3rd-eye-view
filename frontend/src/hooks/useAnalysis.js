import { useState } from 'react';
import { api } from '../services/api';

export function useAnalysis(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runAnalysis = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.runAnalysis(query, token);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { runAnalysis, loading, error, result };
}