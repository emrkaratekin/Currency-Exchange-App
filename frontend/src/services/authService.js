import api from './api';
import { API_ENDPOINTS } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', response.data.email);
    }
    return response.data;
  },

  async register(email, password) {
    const response = await api.post(API_ENDPOINTS.REGISTER, { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', response.data.email);
    }
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  async getEmail() {
    return await AsyncStorage.getItem('email');
  },
};

export default authService;
