import React, { createContext, useState, useContext } from 'react';

const BiasContext = createContext();

export function useBias() {
  return useContext(BiasContext);
}

export function BiasProvider({ children }) {
  const [biasWeights, setBiasWeights] = useState({
    government: 50,
    mainstream: 50,
    alternative: 50,
    academic: 50,
    whistleblower: 50
  });

  const updateWeight = (source, value) => {
    setBiasWeights(prev => ({ ...prev, [source]: value }));
  };

  const resetWeights = () => {
    setBiasWeights({
      government: 50,
      mainstream: 50,
      alternative: 50,
      academic: 50,
      whistleblower: 50
    });
  };

  const value = {
    biasWeights,
    updateWeight,
    resetWeights
  };

  return <BiasContext.Provider value={value}>{children}</BiasContext.Provider>;
}