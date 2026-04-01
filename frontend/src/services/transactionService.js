import api from './api';
import { API_ENDPOINTS } from '../utils/config';

export const transactionService = {
  async getTransactions() {
    const response = await api.get(API_ENDPOINTS.TRANSACTIONS);
    return response.data;
  },

  async executeTransaction(type, currency, amount) {
    const response = await api.post(API_ENDPOINTS.TRANSACTIONS, { currency, type, amount });
    return response.data;
  },
};

export default transactionService;
