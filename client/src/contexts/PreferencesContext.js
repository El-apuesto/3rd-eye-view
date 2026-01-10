import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const PreferencesContext = createContext(null);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

const defaultPreferences = {
  government_source_weight: 0.5,
  mainstream_media_weight: 0.5,
  alternative_media_weight: 0.5,
  academic_source_weight: 0.8,
  whistleblower_weight: 0.6,
  preferred_analysis_method: 'confidence_system',
  show_government_filter: true,
  track_reading_history: true
};

export const PreferencesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPreferences();
    } else {
      setPreferences(defaultPreferences);
    }
  }, [isAuthenticated]);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await api.users.getCurrentUser();
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const response = await api.users.updatePreferences(newPreferences);
      setPreferences(response.data.preferences);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update preferences'
      };
    }
  };

  const getSourceWeights = () => ({
    government: preferences.government_source_weight,
    mainstream_media: preferences.mainstream_media_weight,
    alternative_media: preferences.alternative_media_weight,
    academic: preferences.academic_source_weight,
    whistleblower: preferences.whistleblower_weight
  });

  const value = {
    preferences,
    loading,
    updatePreferences,
    getSourceWeights
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
