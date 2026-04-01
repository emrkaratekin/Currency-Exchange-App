import api from './api';
import { API_ENDPOINTS } from '../utils/config';

export const walletService = {
  async getWallets() {
    const response = await api.get(API_ENDPOINTS.WALLET);
    return response.data;
  },

  async topup(currency, amount) {
    const response = await api.post(API_ENDPOINTS.TOPUP, { currency, amount });
    return response.data;
  },
};

export default walletService;
