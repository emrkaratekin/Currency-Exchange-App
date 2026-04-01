import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the API URL based on platform
const getApiUrl = () => {
  // If explicitly set via environment variable, use that
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // For web (Docker nginx), use relative URLs
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

  // For native (Expo Go), use the dev server host IP with backend port
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    return `http://${hostIp}:8080`;
  }

  // Fallback for local development
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  RATES: '/api/rates',
  WALLET: '/api/wallet',
  TOPUP: '/api/wallet/topup',
  TRANSACTIONS: '/api/transactions',
};

export default API_BASE_URL;
