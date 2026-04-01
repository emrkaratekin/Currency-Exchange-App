import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../utils/config';

const RATES_CACHE_KEY = 'cached_rates';
const RATES_CACHE_TIME_KEY = 'cached_rates_time';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const rateService = {
  async getRates() {
    try {
      const response = await api.get(API_ENDPOINTS.RATES);
      // Cache the rates
      await AsyncStorage.setItem(RATES_CACHE_KEY, JSON.stringify(response.data));
      await AsyncStorage.setItem(RATES_CACHE_TIME_KEY, Date.now().toString());
      return { data: response.data, isStale: false };
    } catch (error) {
      // Return cached rates if available
      const cachedRates = await this.getCachedRates();
      if (cachedRates) {
        return { data: cachedRates.data, isStale: cachedRates.isStale };
      }
      throw error;
    }
  },

  async getCachedRates() {
    const cachedData = await AsyncStorage.getItem(RATES_CACHE_KEY);
    const cachedTime = await AsyncStorage.getItem(RATES_CACHE_TIME_KEY);
    
    if (cachedData && cachedTime) {
      const isStale = Date.now() - parseInt(cachedTime) > CACHE_DURATION;
      return { data: JSON.parse(cachedData), isStale };
    }
    return null;
  },
};

export default rateService;
