export const isStandalone = import.meta.env.VITE_STANDALONE === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getAuthHeader = () => {
  const token = localStorage.getItem('openflp_token');
  return token ? `Bearer ${token}` : '';
};

export const simulateDelay = async (ms = 1000) => {
  if (isStandalone) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
};
